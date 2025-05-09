# Generated by Django 5.2 on 2025-04-27 08:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RSUD_KRATON', '0009_dokter_schedule_dokter_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedule',
            name='data_pasien',
        ),
        migrations.AddField(
            model_name='schedule',
            name='data_pendaftaran',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='data_pendaftaran_set', to='RSUD_KRATON.pendaftaran'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='pendaftaran',
            name='nama_dokter',
            field=models.CharField(max_length=50),
        ),
    ]
