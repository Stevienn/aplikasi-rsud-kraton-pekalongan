from rest_framework import viewsets
from .serializers import *
from ..models import *

class DokterViewSet(viewsets.ModelViewSet):
    queryset = Dokter.objects.all()
    serializer_class = DokterSerializer

class DokterSpesialisViewSet(viewsets.ModelViewSet):
    queryset = Dokter_spesialis.objects.all()
    serializer_class = DokterSpesialisSerializer

class IcdViewSet(viewsets.ModelViewSet):
    queryset = ICD.objects.all()
    serializer_class = IcdSerializer

class PasienViewSet(viewsets.ModelViewSet):
    queryset = pasien.objects.all()
    serializer_class = PasienSerializer
    
class HariPraktekViewSet(viewsets.ModelViewSet):
    queryset = hari_praktek.objects.all()
    serializer_class = HariPraktekSerializer
    
class SesiPraktekViewSet(viewsets.ModelViewSet):
    queryset = sesi_praktek.objects.all()
    serializer_class = SesiPraktekSerializer


class PerawatViewSet(viewsets.ModelViewSet):
    queryset = perawat.objects.all()
    serializer_class = PerawatSerializer

class PendaftaranViewSet(viewsets.ModelViewSet):
    queryset = Pendaftaran.objects.all()
    serializer_class = PendaftaranSerializer

class DiagnosaViewSet(viewsets.ModelViewSet):
    queryset = Diagnosa.objects.all()
    serializer_class = DiagnosaSerializer