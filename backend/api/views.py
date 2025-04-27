from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from api import serializers as api_serializer
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from userauths.models import User
from core.models import Course  # <-- NEW import
from api.permissions import IsTeacherOrReadOnly  # <-- import it
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


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

# ------------------------------
# ✨ NEW: Course ViewSet
# ------------------------------


class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Courses with CRUD operations.
    """
    queryset = Course.objects.all()
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [IsTeacherOrReadOnly]   # <-- replace IsAuthenticated


class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Courses with CRUD operations.
    """
    queryset = Course.objects.all()
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [IsTeacherOrReadOnly]

    @action(detail=True, methods=['post'], permission_classes=[IsTeacherOrReadOnly])
    def enroll(self, request, pk=None):
        """
        Custom action to enroll a student into a course using email.
        Only a teacher can perform this action.
        """
        course = self.get_object()
        student_email = request.data.get('student_email')

        if not student_email:
            return Response({'error': 'student_email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = User.objects.get(email=student_email, role='student')
        except User.DoesNotExist:
            return Response({'error': 'Student with this email not found or invalid role'}, status=status.HTTP_404_NOT_FOUND)

        course.students.add(student)
        course.save()

        return Response({'status': f'Student {student.full_name} enrolled successfully.'})
