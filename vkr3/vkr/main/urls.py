from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView
from .views import profile_view, profile_edit
from django.contrib.auth import views as auth_views
from .views import CustomLoginView
from .views import download_file
from .views import edit_course, delete_course
from .views import course_list, course_detail, create_course, enroll_course, add_course_content, edit_course_material, delete_course_material, grade_students_view
from django.conf import settings
from django.conf.urls.static import static

app_name = 'main'

urlpatterns = [
    path('register/', views.register, name='register'),  # Регистрация
    path("login/", CustomLoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(next_page="main:home"), name="logout"),
    path('', views.home, name='home'),  # Главная страница
    path('profile/', profile_view, name='profile'),  # Личный кабинет
    path('profile/edit/', profile_edit, name='profile_edit'),
    path('password_change/', auth_views.PasswordChangeView.as_view(template_name='main/password_change.html', success_url='/password_change/done/'), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(template_name='main/password_change_done.html'), name='password_change_done'),
    path("courses/", course_list, name="course_list"),
    path("courses/<int:course_id>/", course_detail, name="course_detail"),
    path("courses/create/", create_course, name="create_course"),
    path("courses/<int:course_id>/enroll/", enroll_course, name="enroll_course"),
    path('courses/<int:course_id>/', course_detail, name='course_detail'),
    path('courses/<int:course_id>/add_content/', add_course_content, name='add_course_content'),
    path('courses/<int:course_id>/download/<int:file_id>/', views.download_file, name='download_file'),
    path("courses/<int:course_id>/material/<int:material_id>/edit/", edit_course_material, name="edit_course_material"),
    path("courses/<int:course_id>/material/<int:material_id>/delete/", delete_course_material, name="delete_course_material"),
    path("courses/<int:course_id>/edit/", edit_course, name="edit_course"),
    path("courses/<int:course_id>/delete/", delete_course, name="delete_course"),
    path("curriculum/", views.curriculum_list_view, name="curriculum_list"),
    path("curriculums/<int:curriculum_id>/", views.curriculum_view, name="curriculum"),
    path('student_curriculum/', views.curriculum_view, name='student_curriculum'),
    path('curriculums/<int:curriculum_id>/delete/', views.delete_curriculum_view, name='delete_curriculum'),
    path("curriculum/upload/", views.upload_curriculum, name="upload_curriculum"),
    path('teachers/', views.teacher_list_view, name='teacher_list'),
    path('teachers/<int:teacher_id>/assign/', views.assign_subjects_view, name='assign_subjects'),
    path("teacher/subjects/", views.teacher_subjects_view, name="teacher_subjects"),
    path('grade/<int:assignment_id>/', grade_students_view, name='grade_students'),
    path('export/excel/<int:assignment_id>/', views.export_student_works_excel, name='export_student_works_excel'),
    path('student/progress/', views.student_progress_view, name='student_progress'),
]

# Добавляем поддержку медиафайлов
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

