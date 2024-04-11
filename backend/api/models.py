from django.db import models


class StudentModel(models.Model):
    student_name = models.CharField(max_length=100)
    student_email = models.EmailField(max_length=100)
