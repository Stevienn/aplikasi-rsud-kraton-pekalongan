from django.db import models

# Create your models here.
class pasien(models.Model):
    ID_BPJS = models.CharField(max_length=13,primary_key=True)
    nama = models.CharField(max_length=50)
    jenis_kelamin = models.CharField(max_length=10)
    tanggal_lahir = models.DateField()
    nomor_HP = models.CharField(max_length=13)
    email_pasien = models.CharField(max_length=30)
    
    def __str__(self):
        return (f"BPJS: {self.ID_BPJS}, Nama: {self.nama}, Jenis Kelamin: {self.jenis_kelamin}, TTL: {self.tanggal_lahir}, HP: {self.nomor_HP}, email: {self.email_pasien}")

class hari_praktek(models.Model):
    hari = models.CharField(max_length=50)
    sesi_praktek = models.JSONField(default=list)
    
    def __str__(self):
        return (f'Hari : {self.hari}, Sesi Praktek : {self.sesi_praktek}')
    
class Dokter(models.Model):
    id_dokter = models.IntegerField()
    nama_dokter = models.CharField(max_length=50)
    password_dokter = models.CharField(max_length=20)
    email_dokter = models.CharField(max_length=15)
    
    def __str__(self):
        return (f"Id Dokter : {self.id_dokter}, Nama Dokter : {self.nama_dokter}")

class schedule(models.Model):
    #id_dokter = models.ForeignKey(Dokter, on_delete=models.CASCADE, related_name='id_dokter_set')
    hari_praktek_dokter = models.ForeignKey(hari_praktek, on_delete=models.CASCADE, related_name='hari_praktek_dokter_set')
    jam_total = models.IntegerField()
    data_pasien = models.JSONField(default=list)
    
    def __str__(self):
        return (f'Id: {self.id_dokter}, Hari:{self.hari_praktek_dokter}')
    
class Pendaftaran(models.Model):
    id_pendaftaran = models.IntegerField()
    id_bpjs = models.ForeignKey(pasien, on_delete=models.CASCADE, related_name='id_bpjs_set')
    nama_pasien = models.ForeignKey(pasien, on_delete=models.CASCADE, related_name='nama_pasien_set')
    tanggal_konsultasi = models.DateField()
    keluhan = models.CharField(max_length=100)
    nama_dokter = models.ForeignKey(Dokter, on_delete=models.CASCADE, related_name='nama_dokter_set')
    hari_konsul_dokter = models.ForeignKey(hari_praktek, on_delete=models.CASCADE, related_name='hari_konsul_dokter_set')
    sesi_praktek_dokter = models.ForeignKey(hari_praktek, on_delete=models.CASCADE, related_name='sesi_praktek_dokter_set')
    
class perawat(models.Model):
    id_perawat = models.IntegerField()
    nama_perawat = models.CharField(max_length=50)
    password_perawat = models.CharField(max_length=20)
    email_perawat = models.CharField(max_length=15)
    
class ICD(models.Model):
    kode = models.CharField(max_length=10)
    nama_diagnosa = models.CharField(max_length=20)
    
    def __str__(self):
        return (f'id : {self.id}, Kode : {self.kode}, Diagnosa : {self.nama_diagnosa}')

class Diagnosa(models.Model):
    id_pendaftaran = models.ForeignKey(Pendaftaran, on_delete=models.CASCADE, related_name='is_pendaftaran_set')
    nama_pasien = models.ForeignKey(Pendaftaran, on_delete=models.CASCADE, related_name='nama_pasien_set')
    penyakit_pasien = models.CharField(max_length=100)
    kode_icd = models.ForeignKey(ICD, on_delete=models.CASCADE, related_name='kode_icd_set')
    diagnosa_icd = models.ForeignKey(ICD, on_delete=models.CASCADE,related_name='diagnosa_icd_set')
    
    def __str__(self):
        return (f'Id Pendaftaran: {self.id_pendaftaran}, Pasien : {self.nama_pasien}, Penyakit Pasien: {self.penyakit_pasien}, Diagnosa: {self.kode_icd} -> {self.diagnosa_icd}')