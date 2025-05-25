from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from api import serializers as api_serializer
from rest_framework import generics, viewsets, permissions, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from userauths.models import User
from core.models import Course, CourseRating
from api.permissions import IsTeacherOrReadOnly
from api.serializers import CourseDescriptionSerializer, CourseRatingSerializer, TeacherMiniSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.serializers import StudentMiniSerializer
from rest_framework.decorators import permission_classes
from core.models import Course
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


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
        """
        Override the destroy method to ensure only teachers can delete courses.
        """
        course = self.get_object()
        if request.user.role != "teacher":
            return Response({"detail": "Only teachers can delete courses."}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(course)
        return Response({"detail": "Course deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
    def perform_create(self, serializer):
        serializer.save() 

class TeacherListView(generics.ListAPIView):
    serializer_class = TeacherMiniSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.filter(role="teacher")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def students_in_teacher_courses(request):
    """
    Fetch all students enrolled in the courses taught by the logged-in teacher.
    """
    try:
        if request.user.role != "teacher":
            return Response({"detail": "Only teachers can view their students."},
                            status=403)

        # Get all courses taught by the teacher
        teacher_courses = Course.objects.filter(teacher=request.user)

        # Get all students enrolled in those courses
        students = User.objects.filter(role="student", enrolled_courses__in=teacher_courses).distinct()

        # Serialize the students
        student_data = [
            {"id": student.id, "full_name": student.full_name, "email": student.email}
            for student in students
        ]
        return Response(student_data, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    """
    API endpoint to fetch the current user's details.
    """
    user = request.user
    return Response({
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
    })

@swagger_auto_schema(
    method="put",
    operation_description="Update the description of a course. Only the 'description' field is allowed.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "description": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="The new description for the course.",
                example="This is an updated course description."
            ),
        },
        required=["description"],  # Mark 'description' as required
    ),
    responses={
        200: "Course description updated successfully.",
        400: "Invalid input.",
        403: "Permission denied.",
        404: "Course not found.",
    },
)

@action(detail=True, methods=["put"], permission_classes=[IsTeacherOrReadOnly])
def update_description(self, request, pk=None):
    """
    Update the description of a course. Only the 'description' field is allowed.
    """
    course = self.get_object()

    # Use the custom serializer for validation
    serializer = CourseDescriptionSerializer(course, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)

    # Save the updated description
    serializer.save()

    return Response({"message": "Course description updated successfully!"}, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='post',
    operation_description="Rate a course by providing a score between 1 and 5.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'rating': openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description='Rating between 1 and 5',
                example=4
            ),
        },
        required=['rating'],  # Mark 'rating' as required
    ),
    responses={
        201: "Rating created successfully.",
        200: "Rating updated successfully.",
        400: "Invalid rating.",
        404: "Course not found.",
    },
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_course(request, course_id):
    """
    Allows a user to rate a course.
    """
    try:
        # Ensure the course exists
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)

    # Get the rating from the request data
    rating = request.data.get('rating')
    if not rating or not (1 <= int(rating) <= 5):
        return Response({"detail": "Rating must be an integer between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the user has already rated the course
    user = request.user
    course_rating, created = CourseRating.objects.update_or_create(
        course=course,
        user=user,
        defaults={'rating': rating}
    )

    if created:
        return Response({"detail": "Rating created successfully."}, status=status.HTTP_201_CREATED)
    else:
        return Response({"detail": "Rating updated successfully."}, status=status.HTTP_200_OK)
    
class UserCourseReviewView(APIView):
    """
    View to retrieve a user's review for a specific course.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            user = request.user

            # Check if the user has reviewed the course
            review = CourseRating.objects.filter(course=course, user=user).first()
            if review:
                serializer = CourseRatingSerializer(review)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "No review found for this course."}, status=status.HTTP_404_NOT_FOUND)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_course_ratings(request, course_id):
    """
    Retrieve all ratings for a specific course.
    """
    try:
        # Ensure the course exists
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)

    # Fetch all ratings for the course
    ratings = CourseRating.objects.filter(course=course)
    serializer = CourseRatingSerializer(ratings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)