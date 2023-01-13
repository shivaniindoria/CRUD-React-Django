from django.contrib import admin
from .models import StudentModel


@admin.register(StudentModel)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['id', 'student_name', 'student_email']
