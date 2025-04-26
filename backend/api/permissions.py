from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsTeacherOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        # SAFE: allow
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'teacher'


class IsOwner(BasePermission):
    """Generic owner check for objects that have `.user` or `.student`"""
    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, 'user', None) or getattr(obj, 'student', None) or getattr(obj, 'teacher', None)
        return owner == request.user
