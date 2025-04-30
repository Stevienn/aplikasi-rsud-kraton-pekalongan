from django.db import models

# Create your models here.
class pasien(models.Model):
    ID_BPJS = models.CharField(max_length=13,primary_key=True)
    nama = models.CharField(max_length=50)
    jenis_kelamin = models.CharField(max_length=10)
    tanggal_lahir = models.DateField()
    nomor_HP = models.CharField(max_length=13)
    email_pasien = models.CharField(max_length=50)
    
    def __str__(self):
        return (f"BPJS: {self.ID_BPJS}, Nama: {self.nama}, Jenis Kelamin: {self.jenis_kelamin}, TTL: {self.tanggal_lahir}, HP: {self.nomor_HP}, email: {self.email_pasien}")

class hari_praktek(models.Model):
    hari = models.CharField(max_length=50)
    sesi_praktek = models.JSONField(default=list)
    jam_total = models.IntegerField()

    def __str__(self):
        return (f"Hari : {self.hari}, Sesi : {self.sesi_praktek}, Total Jam :  {self.jam_total}")
    
class Pendaftaran(models.Model):
    #id_pendaftaran = models.IntegerField()
    data_pasien = models.ForeignKey(pasien, on_delete=models.CASCADE, related_name='id_bpjs_set')
    tanggal_konsultasi = models.DateField()
    keluhan = models.CharField(max_length=100)
    nama_dokter = models.CharField(max_length=50)
    sesi_praktek_dokter = models.CharField(max_length=50)
    
    def __str__(self):
        return (f'Tanggal : {self.tanggal_konsultasi}, Nama Dokter : {self.nama_dokter}, Sesi : {self.sesi_praktek_dokter}') 
    
class schedule(models.Model):
    #schedule_id = models.IntegerField()
    #id_dokter = models.ForeignKey(Dokter, on_delete=models.CASCADE, related_name='id_dokter_set')
    hari_praktek_dokter = models.ManyToManyField(hari_praktek, related_name='hari_praktek_dokter_set')
    data_pendaftaran = models.ManyToManyField(Pendaftaran, related_name='data_pendaftaran_set', blank=True) 
    
class Dokter(models.Model):
    nama_dokter = models.CharField(max_length=50)
    password_dokter = models.CharField(max_length=20)
    email_dokter = models.CharField(max_length=50)
    image_dokter = models.CharField(max_length=100)
    schedule_dokter = models.ForeignKey(schedule, on_delete=models.CASCADE, related_name='schedule_dokter_set')
    
    def __str__(self):
        return (f"Id Dokter : {self.id}, Nama Dokter : {self.nama_dokter}")

class Dokter_spesialis(models.Model):
    nama_dokter_spc = models.CharField(max_length=50)
    password_dokter_spc = models.CharField(max_length=20)
    email_dokter_spc = models.CharField(max_length=50)
    spesialization = models.CharField(max_length=20)
    image_dokter_spc = models.CharField(max_length=100)
    schedule_dokter_spc = models.ForeignKey(schedule, on_delete=models.CASCADE, related_name='schedule_dokter_spc_set')
    
    def __str__(self):
        return (f"Id Dokter : {self.id}, Nama Dokter : {self.nama_dokter_spc}, Spesialis  : {self.spesialization}")
    
class perawat(models.Model):
    #id_perawat = models.IntegerField()
    nama_perawat = models.CharField(max_length=50)
    password_perawat = models.CharField(max_length=20)
    email_perawat = models.CharField(max_length=50)
    
    def __str__(self):
        return (f"Perawat : {self.nama_perawat}")
    
class ICD(models.Model):
    kode = models.CharField(max_length=10)
    nama_diagnosa = models.CharField(max_length=20)
    
    def __str__(self):
        return (f'id : {self.id}, Kode : {self.kode}, Diagnosa : {self.nama_diagnosa}')

class Diagnosa(models.Model):
    data_pendaftaran = models.ForeignKey(Pendaftaran, on_delete=models.CASCADE, related_name='is_pendaftaran_set')
    diagnosa_subjektif = models.CharField(max_length=100)
    diagnosa_icd_1 = models.ForeignKey(ICD, on_delete=models.CASCADE,related_name='diagnosa_icd_1_set')
    diagnosa_icd_2 = models.ForeignKey(ICD, on_delete=models.CASCADE,related_name='diagnosa_icd_2_set')    
        