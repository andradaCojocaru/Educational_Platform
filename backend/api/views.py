from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from api import serializers as api_serializer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from userauths.models import User
from rest_framework import viewsets, permissions, mixins
from .serializers import (
    CourseSerializer, EnrollmentSerializer,
    CartItemSerializer, NotificationSerializer
)
from core.models import Course, Enrollment, CartItem, Notification
from .permissions import IsTeacherOrReadOnly, IsOwner
from django.db.models import Count, Sum
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

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
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        if self.request.user.role == 'student':
            return Enrollment.objects.filter(student=self.request.user)
        return Enrollment.objects.all()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    # extra action -> PATCH  /notifications/{id}/mark_read/
    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        noti = self.get_object()
        noti.is_read = True
        noti.save()
        return Response({'status': 'marked read'})


# -------  simple stats for charts  ---------
from rest_framework.views import APIView

class StatsView(APIView):
    """
    Returns three small datasets:
      1. courses_per_category
      2. enrollments_per_month (current year)
      3. role_distribution
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        year = timezone.now().year
        courses_per_category = (
            Course.objects.values('category')
            .annotate(total=Count('id'))
            .order_by('category')
        )

        enrollments_per_month = (
            Enrollment.objects.filter(enrolled__year=year)
            .annotate(month=timezone.datetime(year, 1, 1).month)  # dummy field so it exists
            .values('enrolled__month')
            .annotate(total=Count('id'))
            .order_by('enrolled__month')
        )

        role_distribution = (
            request.user.__class__.objects.values('role')
            .annotate(total=Count('id'))
        )

        return Response({
            'courses_per_category': courses_per_category,
            'enrollments_per_month': enrollments_per_month,
            'role_distribution': role_distribution,
        })
