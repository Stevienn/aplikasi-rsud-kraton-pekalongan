from django.db import models

# Create your models here.
class pasien(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)
    birth = models.DateField()
    phone = models.CharField(max_length=13)
    email = models.CharField(max_length=30)
    
class Pendaftaran(models.Model):
    id = models.AutoField(primary_key=True)
    id_pasien = models.ForeignKey(pasien, on_delete=models.CASCADE, related_name='id_bpjs_set')
    #nama_pasien = models.ForeignKey(pasien, on_delete=models.CASCADE, related_name='nama_pasien_set')
    tanggal_konsultasi = models.DateField()
    keluhan = models.CharField(max_length=100)
    nama_dokter = models.CharField(max_length=50)
    #hari_konsul_dokter = models.ForeignKey(hari_praktek, on_delete=models.CASCADE, related_name='hari_konsul_dokter_set')

class hari_praktek(models.Model):
    hari = models.CharField(max_length=50)
    sesi_praktek = models.JSONField(default=list)
    
class schedule(models.Model):
    #id_dokter = models.ForeignKey(Dokter, on_delete=models.CASCADE, related_name='id_dokter_set')
    hari_praktek_dokter = models.ForeignKey(hari_praktek, on_delete=models.CASCADE, related_name='hari_praktek_dokter_set')
    jam_total = models.IntegerField()
    data_pasien = models.ForeignKey(Pendaftaran, on_delete=models.CASCADE, related_name='data_pasien_set')

class Dokter_umum(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    password = models.CharField(max_length=20)
    email = models.CharField(max_length=15)
    schedule = models.ForeignKey(schedule, on_delete=models.CASCADE, related_name='schedule_umum_set')
    image = models.CharField(max_length=50)
    
class Dokter_spesialis(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    password = models.CharField(max_length=20)
    email = models.CharField(max_length=15)
    schedule = models.ForeignKey(schedule, on_delete=models.CASCADE, related_name='schedule_spesialis_set')
    image = models.CharField(max_length=50)
    specialty = models.CharField(max_length=100)
    
class perawat(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    password = models.CharField(max_length=20)
    email = models.CharField(max_length=15)
    
    def __str__(self):
        return (f'Id: {self.id_dokter}, Hari:{self.hari_praktek_dokter}')
    
class ICD(models.Model):
    kode = models.CharField(max_length=10)
    nama_diagnosa = models.CharField(max_length=20)
    
    def __str__(self):
        return (f'id : {self.id}, Kode : {self.kode}, Diagnosa : {self.nama_diagnosa}')

class Diagnosa(models.Model):
    id = models.AutoField(primary_key=True)
    data_pendaftaran = models.ForeignKey(Pendaftaran, on_delete=models.CASCADE, related_name='data_pendaftaran_set')
    #data_pasien = models.ForeignKey(pasien, on_delete=models.CASCADE, related_name='nama_pasien_set')
    penyakit_pasien = models.CharField(max_length=100)
    kode_icd = models.ForeignKey(ICD, on_delete=models.CASCADE, related_name='kode_icd_set')
    diagnosa_icd = models.ForeignKey(ICD, on_delete=models.CASCADE,related_name='diagnosa_icd_set')
    
    def __str__(self):
        return (f'Id Pendaftaran: {self.data_pendaftaran.id}, Penyakit: {self.penyakit_pasien}, Diagnosa ICD: {self.kode_icd} -> {self.diagnosa_icd}')