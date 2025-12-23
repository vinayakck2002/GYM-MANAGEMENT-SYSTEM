from django.db import models
from datetime import date

class Member(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    join_date = models.DateField()
    plan_months = models.IntegerField()  # 1 or 2
    amount = models.IntegerField()
    expiry_date = models.DateField()

    def late_days(self):
        if date.today() > self.expiry_date:
            return (date.today() - self.expiry_date).days
        return 0

    def __str__(self):
        return self.name
