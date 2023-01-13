from django.urls import path
from api import views


urlpatterns = [
    path('student/', views.StudentList.as_view(), name='student-list'),
    path('student/<int:pk>/', views.StudentDetail.as_view(), name='student-detail'),
]
