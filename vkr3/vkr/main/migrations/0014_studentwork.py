# Generated by Django 5.1.4 on 2025-05-05 04:55

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_groupdisciplineassignment_lab_works_count'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentWork',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('work_type', models.CharField(choices=[('lab', 'Лабораторная'), ('coursework', 'Курсовая работа'), ('courseproject', 'Курсовой проект'), ('referat', 'Реферат'), ('rgr', 'РГР'), ('exam', 'Экзамен'), ('zachet', 'Зачет'), ('zachet_grade', 'Зачет с оценкой')], max_length=50)),
                ('lab_index', models.PositiveIntegerField(blank=True, null=True)),
                ('is_completed', models.BooleanField(default=False)),
                ('grade', models.PositiveSmallIntegerField(blank=True, null=True)),
                ('is_passed', models.BooleanField(blank=True, null=True)),
                ('assignment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.groupdisciplineassignment')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('student', 'assignment', 'work_type', 'lab_index')},
            },
        ),
    ]
