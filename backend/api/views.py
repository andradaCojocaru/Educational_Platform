from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from api import serializers as api_serializer
from rest_framework import generics, viewsets, permissions, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from userauths.models import User
from core.models import Course
from api.permissions import IsTeacherOrReadOnly
from api.serializers import TeacherMiniSerializer
from rest_framework.decorators import action
from rest_framework.response import Response


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for obtaining token pairs.

    Args:
        TokenObtainPairView (type): Base class for token obtain views.
    """

    serializer_class = api_serializer.MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """
    Custom view for user registration.

    Args:
        generics (type): Base class for generic views.
    """

    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = api_serializer.RegisterSerializer

class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Courses with CRUD operations.
    Teachers get full access; everyone else is read-only.
    """
    queryset = Course.objects.all()
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [IsTeacherOrReadOnly]          # already blocks non-teachers

    # ---------- EXISTING ACTION ----------
    @action(detail=True, methods=["post"], permission_classes=[IsTeacherOrReadOnly])
    def enroll(self, request, pk=None):
        """
        Enrol a student.  Body: {"student_email": "..."}
        """
        course = self.get_object()
        student_email = request.data.get("student_email")

        if not student_email:
            return Response({"error": "student_email is required"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            student = User.objects.get(email=student_email, role="student")
        except User.DoesNotExist:
            return Response({"error": "Student not found or wrong role"},
                            status=status.HTTP_404_NOT_FOUND)

        course.students.add(student)
        return Response({"status": f"{student.email} enrolled successfully."},
                        status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsTeacherOrReadOnly])
    def unenroll(self, request, pk=None):
        """
        Remove a student from the course.  Body: {"student_email": "..."}
        """
        course = self.get_object()
        student_email = request.data.get("student_email")

        if not student_email:
            return Response({"error": "student_email is required"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            student = User.objects.get(email=student_email, role="student")
        except User.DoesNotExist:
            return Response({"error": "Student not found or wrong role"},
                            status=status.HTTP_404_NOT_FOUND)

        course.students.remove(student)
        return Response({"status": f"{student.email} removed from course."},
                        status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != "teacher":
            return Response({"detail": "Only teachers can delete courses."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save() 

class TeacherListView(generics.ListAPIView):
    serializer_class = TeacherMiniSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.filter(role="teacher")
