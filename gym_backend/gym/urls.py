from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_member),
    path('list/', views.list_members),
    path('edit/<int:id>/', views.edit_member),
    path('delete/<int:id>/', views.delete_member),
    path('expired/', views.expired_members),
    path("dashboard/", views.dashboard_counts),
    path("members/search/", views.search_members),

]
