from django.db import models
from userauths.models import User
from django.conf import settings



class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    teacher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=False,
        related_name="courses_taught",
        limit_choices_to={"role": "teacher"},
    )
    students = models.ManyToManyField(
        User, related_name="enrolled_courses", blank=True
    )

    def __str__(self):
        return self.title

    def get_average_rating(self):
        ratings = self.ratings.all()  # Use the related_name 'ratings' from the CourseRating model
        if ratings.exists():
            return sum(rating.rating for rating in ratings) / ratings.count()
        return 0

class CourseRating(models.Model):
    course = models.ForeignKey('core.Course', on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('course', 'user')  # Ensure a user can only rate a course once

    def __str__(self):
        return f"{self.user.email} rated {self.course.title} with {self.rating} stars"