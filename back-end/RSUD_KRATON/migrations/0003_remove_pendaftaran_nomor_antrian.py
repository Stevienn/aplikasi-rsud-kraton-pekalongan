# Generated by Django 5.1.6 on 2025-04-25 11:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('RSUD_KRATON', '0002_dokter_hari_praktek_icd_perawat_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pendaftaran',
            name='nomor_antrian',
        ),
    ]
