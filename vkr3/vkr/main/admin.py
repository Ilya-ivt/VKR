from django.contrib import admin
from .models import User, Course, Assignment, Submission, Group

admin.site.register(User)
admin.site.register(Course)
admin.site.register(Assignment)
admin.site.register(Submission)
admin.site.register(Group)
