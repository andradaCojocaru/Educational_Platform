from django.db import models
# Ensure this import is correct based on your project structure
from userauths.models import User


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    students = models.ManyToManyField(
        User, related_name='enrolled_courses', blank=True)

    def __str__(self):
        return self.title
