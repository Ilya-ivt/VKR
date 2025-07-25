# Generated by Django 5.1.4 on 2025-05-08 10:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0015_remove_groupdisciplineassignment_lab_works_count_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='curriculumitem',
            name='has_practice',
            field=models.BooleanField(default=False, verbose_name='Практики'),
        ),
        migrations.AlterField(
            model_name='user',
            name='group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='students', to='main.group'),
        ),
    ]
