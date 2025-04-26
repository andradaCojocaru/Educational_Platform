from django.contrib import admin
from .models import Course, Enrollment, CartItem, Notification
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title','category','teacher','price','created')
    search_fields = ('title','category','teacher__email')

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student','course','enrolled')
    list_filter  = ('course','student')

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('user','course','qty','added_on')
    list_filter  = ('user','course')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user','is_read','created')
    list_filter  = ('is_read','user')

