# Generated by Django 5.1.6 on 2025-06-09 15:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RSUD_KRATON', '0009_remove_dokter_schedule_dokter_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedule_praktek',
            name='Dokter_spesialis',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dokter_umum_praktek_set', to='RSUD_KRATON.dokter_spesialis'),
        ),
        migrations.AlterField(
            model_name='schedule_praktek',
            name='dokter_umum',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dokter_umum_praktek_set', to='RSUD_KRATON.dokter'),
        ),
    ]
