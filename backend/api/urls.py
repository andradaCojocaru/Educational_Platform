from api import views as api_views
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'courses',       api_views.CourseViewSet,       basename='courses')
router.register(r'enrollments',   api_views.EnrollmentViewSet,   basename='enrollments')
router.register(r'cart',          api_views.CartItemViewSet,     basename='cart')
router.register(r'notifications', api_views.NotificationViewSet, basename='notifications')

urlpatterns = [
    # Authentication Endpoints
    path("user/token/", api_views.MyTokenObtainPairView.as_view()),
    path("user/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/register/", api_views.RegisterView.as_view(), name="register"),
    # Stats endpoint for charts
    path('stats/', api_views.StatsView.as_view()),

    # CRUD routers
    path('', include(router.urls)),
]