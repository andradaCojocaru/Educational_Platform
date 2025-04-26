from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from api import serializers as api_serializer
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from userauths.models import User
from core.models import Course  # <-- NEW import
from api.permissions import IsTeacherOrReadOnly  # <-- import it


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
