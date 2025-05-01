from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsTeacherOrReadOnly(BasePermission):
    """
    Custom permission:
    - Allow any authenticated user to read (GET, HEAD, OPTIONS)
    - Only allow teachers to create/update/delete
    """

    def has_permission(self, request, view):
        # SAFE_METHODS are ('GET', 'HEAD', 'OPTIONS')
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated

        # For unsafe methods (POST, PUT, DELETE), check if user is a teacher
        return request.user.is_authenticated and request.user.role == "teacher"
