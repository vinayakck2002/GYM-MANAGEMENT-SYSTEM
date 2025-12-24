from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import timedelta, date
from .models import Member
import json
import math
from django.db.models import Q



# ---------------- DASHBOARD ----------------
def dashboard_counts(request):
    today = date.today()

    total_members = Member.objects.count()
    expired_members = Member.objects.filter(expiry_date__lt=today).count()
    active_members = Member.objects.filter(expiry_date__gte=today).count()

    return JsonResponse({
        "total": total_members,
        "active": active_members,
        "expired": expired_members,
    })


# ---------------- ADD MEMBER ----------------
@csrf_exempt
def add_member(request):

    if request.method == "OPTIONS":
        return JsonResponse({}, status=200)

    if request.method == "POST":
        try:
            data = json.loads(request.body)

            name = data.get("name")
            phone = data.get("phone")
            plan = data.get("plan_months")
            join_date = data.get("join_date")

            if not all([name, phone, plan, join_date]):
                return JsonResponse(
                    {"error": "Missing required fields"},
                    status=400
                )

            plan = int(plan)
            join_date = date.fromisoformat(join_date)

            if plan == 1:
                amount = 1000
                expiry = join_date + timedelta(days=30)
            elif plan == 2:
                amount = 1500
                expiry = join_date + timedelta(days=60)
            elif plan == 3:
                amount = 2500
                expiry = join_date + timedelta(days=90)
            elif plan == 6:
                amount = 4500
                expiry = join_date + timedelta(days=180)
            else:
                return JsonResponse(
                    {"error": "Invalid plan"},
                    status=400
                )

            Member.objects.create(
                name=name,
                phone=phone,
                join_date=join_date,
                plan_months=plan,
                amount=amount,
                expiry_date=expiry
            )

            return JsonResponse(
                {"message": "Member Added Successfully"},
                status=201
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        except ValueError:
            return JsonResponse({"error": "Invalid data format"}, status=400)

        except Exception as e:
            return JsonResponse(
                {"error": f"Server error: {str(e)}"},
                status=500
            )

    return JsonResponse({"error": "POST method only"}, status=405)


# ---------------- LIST MEMBERS ----------------
def list_members(request):
    if request.method == "GET":
        members = Member.objects.all().order_by("-id")

        data = []
        today = date.today()

        for m in members:
            late_days = (today - m.expiry_date).days if m.expiry_date < today else 0

            data.append({
                "id": m.id,
                "name": m.name,
                "phone": m.phone,
                "join_date": m.join_date,
                "plan": m.plan_months,
                "amount": m.amount,
                "expiry_date": m.expiry_date,
                "late_days": late_days,
            })

        return JsonResponse(data, safe=False)

    return JsonResponse({"error": "GET method only"}, status=405)


# ---------------- EDIT MEMBER ----------------
@csrf_exempt
def edit_member(request, id):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            member = Member.objects.get(id=id)

            member.name = data.get("name", member.name)
            member.phone = data.get("phone", member.phone)
            member.save()

            return JsonResponse({"message": "Member Updated Successfully"})

        except Member.DoesNotExist:
            return JsonResponse({"error": "Member not found"}, status=404)

        except Exception as e:
            return JsonResponse(
                {"error": f"Server error: {str(e)}"},
                status=500
            )

    return JsonResponse({"error": "PUT method only"}, status=405)


# ---------------- DELETE MEMBER ----------------
@csrf_exempt
def delete_member(request, id):
    if request.method == "DELETE":
        try:
            member = Member.objects.get(id=id)
            member.delete()
            return JsonResponse({"message": "Deleted successfully"})

        except Member.DoesNotExist:
            return JsonResponse({"error": "Member not found"}, status=404)

    return JsonResponse({"error": "DELETE method only"}, status=405)


# ---------------- EXPIRED MEMBERS ----------------
def expired_members(request):
    today = date.today()
    members = Member.objects.filter(expiry_date__lt=today)

    members = sorted(
        members,
        key=lambda m: (today - m.expiry_date).days,
        reverse=True
    )

    data = []
    for m in members:
        data.append({
            "id": m.id,
            "name": m.name,
            "phone": m.phone,
            "expiry_date": m.expiry_date,
            "late_days": (today - m.expiry_date).days,
        })

    return JsonResponse(data, safe=False)


# ---------------- SEARCH MEMBERS ----------------

def search_members(request):
    query = request.GET.get("q", "").strip()
    status = request.GET.get("status", "all")
    page = int(request.GET.get("page", 1))
    page_size = int(request.GET.get("page_size", 8))  # ✅ FIXED

    today = date.today()

    members = Member.objects.all().order_by("-id")

    # 🔍 SEARCH
    if query:
        members = members.filter(
            Q(name__icontains=query) |
            Q(phone__icontains=query)
        )

    # 🔎 FILTER
    if status == "active":
        members = members.filter(expiry_date__gte=today)
    elif status == "expired":
        members = members.filter(expiry_date__lt=today)

    total_count = members.count()
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 1

    start = (page - 1) * page_size
    end = start + page_size
    members = members[start:end]

    data = []
    for m in members:
        late_days = (today - m.expiry_date).days if m.expiry_date < today else 0
        data.append({
            "id": m.id,
            "name": m.name,
            "phone": m.phone,
            "plan": m.plan_months,
            "amount": m.amount,
            "expiry_date": m.expiry_date,
            "late_days": late_days,
        })

    return JsonResponse({
        "results": data,
        "current_page": page,
        "total_pages": total_pages,
        "total_members": total_count,
    })


def api_home(request):
    return JsonResponse({
        "status": "success",
        "message": "Backend connected successfully 🚀"
    })
