from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

# Расширение модели пользователя
class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    group = models.ForeignKey('Group', on_delete=models.SET_NULL, null=True, blank=True, related_name="students")
  # Для студентов
    course_year = models.IntegerField(blank=True, null=True)
    def save(self, *args, **kwargs):
        if self.group:
            self.course_year = self.group.course_year
        super().save(*args, **kwargs)

class Course(models.Model):
    title = models.CharField(max_length=255)  # Название курса
    description = models.TextField(blank=True, null=True)  # Описание курса
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_courses")  # Создатель курса
    students = models.ManyToManyField(User, related_name="enrolled_courses", blank=True)  # Записанные студенты

    def __str__(self):
        return self.title

class CourseContent(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="contents")
    title = models.CharField(max_length=255)
    text_content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class CourseFile(models.Model):
    content = models.ForeignKey(CourseContent, on_delete=models.CASCADE, related_name="files")
    file = models.FileField(upload_to="course_files/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name

class Assignment(models.Model):
    TYPE_CHOICES = [
        ('lab', 'Лабораторная'),
        ('coursework', 'Курсовая работа'),
        ('exam', 'Экзамен'),
    ]
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    max_score = models.IntegerField()

class Submission(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    score = models.IntegerField()
    submitted_at = models.DateTimeField(auto_now_add=True)

class Curriculum(models.Model):
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to="curriculums/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.title

class Subject(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class CurriculumItem(models.Model):
    curriculum = models.ForeignKey(Curriculum, related_name='items', on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    course = models.IntegerField()  # Курс, к которому относится предмет
    semester = models.IntegerField()  # Семестр, в котором проходит предмет
    control_types = models.CharField(max_length=100)  # Тип контроля (экзамен, зачет и т.д.)
    work_types = models.CharField(max_length=100, blank=True)  # Курсовые работы, РГР и т.д.
    has_laboratory = models.BooleanField(default=False)  # Наличие лабораторных работ
    has_practice = models.BooleanField(default=False, verbose_name="Практики")

    def __str__(self):
        return f'{self.subject.name} ({self.course} курс, {self.semester} семестр)'

class Group(models.Model):
    name = models.CharField(max_length=50, unique=True)
    curriculum = models.ForeignKey('Curriculum', on_delete=models.SET_NULL, null=True, blank=True)
    course_year = models.IntegerField()

    def __str__(self):
        return self.name

class GroupDisciplineAssignment(models.Model):
    group = models.ForeignKey('Group', on_delete=models.CASCADE)
    curriculum_item = models.ForeignKey('CurriculumItem', on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    lab_count = models.PositiveSmallIntegerField(default=0, verbose_name="Количество лабораторных работ")
    practice_count = models.PositiveSmallIntegerField(default=0, blank=True)
    class Meta:
        unique_together = ('group', 'curriculum_item')

    def __str__(self):
        return f"{self.group.name} — {self.curriculum_item.subject.name} — {self.teacher.get_full_name() if self.teacher else 'Не назначен'}"

class StudentWork(models.Model):
    WORK_TYPE_CHOICES = [
        ("lab", "Лабораторная"),
        ("practice", "Практика"),
        ("coursework", "Курсовая работа"),
        ("courseproject", "Курсовой проект"),
        ("referat", "Реферат"),
        ("rgr", "РГР"),
        ("exam", "Экзамен"),
        ("zachet", "Зачет"),
        ("zachet_grade", "Зачет с оценкой"),
    ]

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    assignment = models.ForeignKey("GroupDisciplineAssignment", on_delete=models.CASCADE)
    work_type = models.CharField(max_length=50, choices=WORK_TYPE_CHOICES)
    lab_index = models.PositiveIntegerField(null=True, blank=True)  # для lab: 0, 1, 2...
    is_completed = models.BooleanField(default=False)
    grade = models.PositiveSmallIntegerField(null=True, blank=True)
    is_passed = models.BooleanField(null=True, blank=True)  # для зачетов

    class Meta:
        unique_together = ("student", "assignment", "work_type", "lab_index")

    def __str__(self):
        return f"{self.student.get_full_name()} — {self.work_type} ({self.assignment})"
