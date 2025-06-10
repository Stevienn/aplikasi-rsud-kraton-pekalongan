from django.db import models

#Create your models here.,
class ICD(models.Model):
    kode = models.CharField(max_length=20)
    nama_diagnosa = models.CharField(max_length=100)

    def __str__(self):
        return (f'id : {self.id}, Kode : {self.kode}, Diagnosa : {self.nama_diagnosa}')
    
class Pasien(models.Model):
    ID_BPJS = models.CharField(max_length=13,primary_key=True)
    nama = models.CharField(max_length=50)
    jenis_kelamin = models.CharField(max_length=10)
    tanggal_lahir = models.DateField()
    nomor_HP = models.CharField(max_length=13)
    email_pasien = models.CharField(max_length=50)
    nomor_urut = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return (f"BPJS: {self.ID_BPJS}, Nama: {self.nama}, Jenis Kelamin: {self.jenis_kelamin}, TTL: {self.tanggal_lahir}, HP: {self.nomor_HP}, email: {self.email_pasien}")

class Pendaftaran(models.Model):
    data_pasien = models.OneToOneField(Pasien, primary_key=True, on_delete=models.CASCADE, related_name='id_bpjs_set')
    tanggal_konsultasi = models.DateField()
    keluhan = models.CharField(max_length=100)
    nama_dokter = models.CharField(max_length=50)
    # sesi_praktek_dokter = models.CharField(max_length=50)

    def __str__(self):
        return (f'Tanggal : {self.tanggal_konsultasi}, Nama Dokter : {self.nama_dokter}, Sesi : {self.sesi_praktek_dokter}') 

class hari_praktek(models.Model):
    hari = models.CharField(max_length=50)

    def __str__(self):
        return (f"ID : {self.id}, Hari : {self.hari}")

class Dokter(models.Model):
    nama_dokter = models.CharField(max_length=50)
    password_dokter = models.CharField(max_length=20)
    email_dokter = models.CharField(max_length=50)
    image_dokter = models.CharField(max_length=100)
    # schedule_dokter = models.ManyToManyField(hari_praktek, related_name='hari_praktek_dokter_set')

    def __str__(self):
        return (f"Id Dokter : {self.id}, Nama Dokter : {self.nama_dokter}")

class Dokter_spesialis(models.Model):
    nama_dokter = models.CharField(max_length=50)
    password_dokter = models.CharField(max_length=20)
    email_dokter = models.CharField(max_length=50)
    spesialization = models.CharField(max_length=100)
    image_dokter = models.CharField(max_length=100)
    # schedule_dokter = models.ManyToManyField(hari_praktek, related_name='hari_praktek_dokter_spc_set')

    def __str__(self):
        return (f"Id Dokter : {self.id}, Nama Dokter : {self.nama_dokter}, Spesialis  : {self.spesialization}")
    
class schedule_praktek(models.Model):
    dokter_umum = models.ForeignKey(Dokter, on_delete=models.CASCADE, blank=True, null=True, related_name="dokter_umum_praktek_set")
    dokter_spesialis = models.ForeignKey(Dokter_spesialis, on_delete=models.CASCADE, blank=True, null=True, related_name="dokter_umum_praktek_set")
    data_pendaftaran = models.ManyToManyField(Pendaftaran, related_name="data_pendaftaran_set", blank=True)
    hari = models.ForeignKey(hari_praktek, on_delete=models.CASCADE, related_name="hari_praktek_set")
    jam_mulai = models.CharField(max_length=100)
    jam_selesai = models.CharField(max_length=100)
    
    def __str__(self):
        dokter = self.dokter_umum if self.dokter_umum else self.dokter_spesialis
        return (f"Id Praktek : {self.id}, Nama Dokter : {dokter}, Hari :{self.hari}")
    
class perawat(models.Model):
    #id_perawat = models.IntegerField()
    nama_perawat = models.CharField(max_length=50)
    password_perawat = models.CharField(max_length=20)
    email_perawat = models.CharField(max_length=50)

    def __str__(self):
        return (f"Perawat : {self.nama_perawat}")

class History(models.Model):
    tanggal_konsultasi = models.DateField()
    keluhan = models.CharField(max_length=100)
    diagnosa_sub = models.CharField(max_length=200)
    diagnosa_primary = models.ForeignKey(ICD, on_delete=models.CASCADE, related_name='diagnosa_primary_set')
    diagnosa_secondary = models.ForeignKey(ICD, on_delete=models.CASCADE, related_name='diagnosa_secondary_set', blank=True, null=True)
    Dokter = models.ForeignKey(Dokter, on_delete=models.CASCADE, related_name='dokter_umum_set', blank=True, null=True)
    Dokter_spesialis = models.ForeignKey(Dokter_spesialis, on_delete=models.CASCADE, related_name='dokter_spesialis_set', blank=True, null=True)

class rekap_medis(models.Model):
    ID_BPJS = models.ForeignKey(Pasien, primary_key=True, on_delete=models.CASCADE, related_name='pasien_set')
    history = models.ManyToManyField(History, related_name='history_set')

    def __str__(self):
        return (f'id : {self.ID_BPJS}')