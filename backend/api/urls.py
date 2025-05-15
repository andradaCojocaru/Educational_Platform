from api import views as api_views
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers
from api.views import students_in_teacher_courses, get_user_details

# Create a router and register our viewsets
router = routers.DefaultRouter()
router.register(r"courses", api_views.CourseViewSet, basename="course")

urlpatterns = [
    # Authentication Endpoints
    path("user/token/", api_views.MyTokenObtainPairView.as_view()),
    path("user/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/register/", api_views.RegisterView.as_view(), name="register"),
    path("user/me/", get_user_details, name="get-user-details"),  # New endpoint
    path("teachers/", api_views.TeacherListView.as_view(), name="teacher-list"),
    path("teacher/students/", students_in_teacher_courses, name="teacher-students"),

    path("", include(router.urls)),
]