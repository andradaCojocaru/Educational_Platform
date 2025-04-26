from django.db import models
from userauths.models import User

class Course(models.Model):
    teacher      = models.ForeignKey(User, on_delete=models.CASCADE)
    title        = models.CharField(max_length=255)
    category     = models.CharField(max_length=100)
    description  = models.TextField(blank=True)
    price        = models.DecimalField(max_digits=8, decimal_places=2)
    created      = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    student   = models.ForeignKey(User, on_delete=models.CASCADE)
    course    = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled  = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')


class CartItem(models.Model):
    user     = models.ForeignKey(User, on_delete=models.CASCADE)
    course   = models.ForeignKey(Course, on_delete=models.CASCADE)
    qty      = models.PositiveIntegerField(default=1)
    added_on = models.DateTimeField(auto_now_add=True)


class Notification(models.Model):
    user      = models.ForeignKey(User, on_delete=models.CASCADE)
    message   = models.TextField()
    is_read   = models.BooleanField(default=False)
    created   = models.DateTimeField(auto_now_add=True)
