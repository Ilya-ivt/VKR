# Generated by Django 5.1.4 on 2025-04-29 10:35

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_subject_curriculumitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='curriculum',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='curriculumitem',
            name='control_types',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='curriculumitem',
            name='curriculum',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='main.curriculum'),
        ),
        migrations.AlterField(
            model_name='curriculumitem',
            name='work_types',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('curriculum', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.curriculum')),
            ],
        ),
        migrations.AlterField(
            model_name='user',
            name='group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='main.group'),
        ),
    ]
