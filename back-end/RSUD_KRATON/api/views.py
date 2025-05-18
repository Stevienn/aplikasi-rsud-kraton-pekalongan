from rest_framework import viewsets
from .serializers import *
from ..models import *
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
# from .utils import get_icd_entity

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
    queryset = Pasien.objects.all()
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

# class DiagnosaViewSet(viewsets.ModelViewSet):
#     queryset = Diagnosa.objects.all()
#     serializer_class = DiagnosaSerializer

class HistoryViewSet(viewsets.ModelViewSet):
    queryset = History.objects.all()
    serializer_class = HistorySerializer

class RekapMedisViewSet(viewsets.ModelViewSet):
    queryset = rekap_medis.objects.all()
    serializer_class = RekapMedisSerializer

class LaporanIcdView(APIView):
    def get(self, request):
        data = ICD.objects.annotate(jumlah_pasien=Count('pasien')).values('kode', 'nama_diagnosa', 'jumlah_pasien').order_by('-jumlah_pasien')[:10]
        return Response(data)

# class LaporanIcdViewSet(viewsets.ModelViewSet):
#     queryset = Laporan_icd.objects.all()
#     serializer_class = RekapMedisSerializer
#     def get(self, request):
#         data = rekap_medis.objects.annotate(jumlah_pasien=Count('pasien')).values('kode', 'nama_diagnosa', 'jumlah_pasien')
#         return Response(data)