from rest_framework import viewsets
from .serializers import *
from ..models import *

class DokterViewSet(viewsets.ModelViewSet):
    queryset = Dokter.objects.all()
    serializer_class = DokterSerializer

class IcdViewSet(viewsets.ModelViewSet):
    queryset = ICD.objects.all()
    serializer_class = IcdSerializer

class PasienViewSet(viewsets.ModelViewSet):
    queryset = pasien.objects.all()
    serializer_class = PasienSerializer
    
class HariPraktekViewSet(viewsets.ModelViewSet):
    queryset = hari_praktek.objects.all()
    serializer_class = HariPraktekSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = schedule.objects.all()
    serializer_class = ScheduleSerializer

class PerawatViewSet(viewsets.ModelViewSet):
    queryset = perawat.objects.all()
    serializer_class = PerawatSerializer

class PendaftaranViewSet(viewsets.ModelViewSet):
    queryset = Pendaftaran.objects.all()
    serializer_class = PendaftaranSerializer

class DiagnosaViewSet(viewsets.ModelViewSet):
    queryset = Diagnosa.objects.all()
    serializer_class = DiagnosaSerializer

# def isi_pasien():
#     semua_pasien = pasien.objects.all()
#     semua_daftar = Pendaftaran.objects.all()
    
#     tampung_pasien = []
    
#     for patien in semua_pasien:
#         #append data 
#         tampung_pasien.append({
#             'id_BPJS'  : pasien.ID_BPJS,
#             'Nama pasien' : pasien.nama,
#             'Jenis Kelamin' : pasien.jenis_kelamin,
#             'Tanggal Lahir' : pasien.tanggal_lahir,
#             'HP' : pasien.nomor_HP,
#             'Keluhan' : Pendaftaran.keluhan
#         })
    
#     data_pasien_instance = schedule(data_pasien=tampung_pasien)
#     data_pasien_instance.save()