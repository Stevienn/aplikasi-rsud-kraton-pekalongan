# Generated by Django 5.2 on 2025-04-27 08:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RSUD_KRATON', '0014_remove_perawat_id_perawat'),
    ]

    operations = [
        migrations.AddField(
            model_name='dokter',
            name='image_dokter',
            field=models.CharField(default=1, max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dokter_spesialis',
            name='image_dokter_spc',
            field=models.CharField(default='DrANNISA.jpg', max_length=20),
            preserve_default=False,
        ),
    ]
