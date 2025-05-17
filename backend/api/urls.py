from api import views as api_views
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from api.views import (
    students_in_teacher_courses,
    get_user_details,
    rate_course,
    UserCourseReviewView,
    get_course_ratings,
)

# Create a router and register our viewsets
router = routers.DefaultRouter()
router.register(r"courses", api_views.CourseViewSet, basename="course")

# Add Bearer Token Authorization to Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="Educational Platform API",
        default_version="v1",
        description="API documentation for the Educational Platform",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=[],
)

urlpatterns = [
    # Authentication Endpoints
    path("user/token/", api_views.MyTokenObtainPairView.as_view()),
    path("user/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/register/", api_views.RegisterView.as_view(), name="register"),
    path("user/me/", get_user_details, name="get-user-details"),  # New endpoint
    path("teachers/", api_views.TeacherListView.as_view(), name="teacher-list"),
    path("teacher/students/", students_in_teacher_courses, name="teacher-students"),
    path("courses/<int:course_id>/rate/", rate_course, name="rate-course"),
    path("courses/<int:course_id>/user-review/", UserCourseReviewView.as_view(), name="user-course-review"),
    path("courses/<int:course_id>/ratings/", get_course_ratings, name="get-course-ratings"),

    # Swagger UI
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),

    # Include the router URLs
    path("", include(router.urls)),
]