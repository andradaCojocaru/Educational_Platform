from django.db import models
from userauths.models import User


class Course(models.Model):
    title       = models.CharField(max_length=255)
    description = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)

    teacher  = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True, blank=False,    
        related_name="courses_taught",
        limit_choices_to={"role": "teacher"},
    )
    students = models.ManyToManyField(
        User, related_name="enrolled_courses", blank=True
    )

    def __str__(self):
        return self.title
