from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User  # Импорт вашей модели пользователя
from django.contrib.auth import get_user_model
from .models import Course, Curriculum
from .models import CourseContent, CourseFile
from django.forms.widgets import ClearableFileInput
from django.forms.widgets import FileInput
from .models import CurriculumItem

User = get_user_model()
class RegisterForm(UserCreationForm):
    first_name = forms.CharField(
        max_length=30,
        required=True,
        label="Имя",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Введите имя'})
    )
    last_name = forms.CharField(
        max_length=30,
        required=True,
        label="Фамилия",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Введите фамилию'})
    )
    username = forms.CharField(
        max_length=30,
        required=True,
        label="Логин",
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Введите логин'})
    )
    email = forms.EmailField(
        required=True,
        label="Email",
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Введите email'})
    )
    password1 = forms.CharField(
        label="Пароль",
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Введите пароль'})
    )
    password2 = forms.CharField(
        label="Подтверждение пароля",
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Повторите пароль'})
    )

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password1', 'password2']

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'group']


class CourseCreateForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ["title", "description"]
        labels = {
            "title": "Название курса",
            "description": "Описание курса",
        }

class CourseEnrollForm(forms.Form):
    course_id = forms.IntegerField(widget=forms.HiddenInput())

class CourseContentForm(forms.ModelForm):
    file = forms.FileField(
        widget=forms.ClearableFileInput(attrs={'class': 'form-control'}),
        required=False
    )

    class Meta:
        model = CourseContent
        fields = ['title', 'text_content', 'file']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'text_content': forms.Textarea(attrs={'class': 'form-control'}),
        }

class CurriculumUploadForm(forms.ModelForm):
    class Meta:
        model = Curriculum
        fields = ["title", "file"]
        widgets = {
            "title": forms.TextInput(attrs={"class": "form-control"}),
            "file": forms.ClearableFileInput(attrs={"class": "form-control"}),
        }

class AssignTeacherForm(forms.ModelForm):
    class Meta:
        model = CurriculumItem
        fields = ['teacher']

    teacher = forms.ModelChoiceField(
        queryset=User.objects.filter(role='teacher'),
        required=False,
        label='Преподаватель',
        widget=forms.Select(attrs={'class': 'form-select'})
    )