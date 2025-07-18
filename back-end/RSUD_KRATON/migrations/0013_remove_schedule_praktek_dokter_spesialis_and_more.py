# Generated by Django 5.1.6 on 2025-06-10 10:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RSUD_KRATON', '0012_remove_schedule_praktek_hari_schedule_praktek_hari'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedule_praktek',
            name='dokter_spesialis',
        ),
        migrations.RemoveField(
            model_name='schedule_praktek',
            name='dokter_umum',
        ),
        migrations.AddField(
            model_name='schedule_praktek',
            name='dokter_spesialis',
            field=models.ManyToManyField(blank=True, null=True, related_name='dokter_umum_praktek_set', to='RSUD_KRATON.dokter_spesialis'),
        ),
        migrations.AddField(
            model_name='schedule_praktek',
            name='dokter_umum',
            field=models.ManyToManyField(blank=True, null=True, related_name='dokter_umum_praktek_set', to='RSUD_KRATON.dokter'),
        ),
    ]
