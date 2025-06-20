from rest_framework import viewsets
from .serializers import *
from ..models import *
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.db.models.functions import ExtractMonth, ExtractYear, ExtractWeekDay
from django.utils.timezone import now
from datetime import timedelta
import calendar
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters

class DokterViewSet(viewsets.ModelViewSet):
    queryset = Dokter.objects.all()
    serializer_class = DokterSerializer

class SpesialisasiViewSet(viewsets.ModelViewSet):
    queryset = Spesialisasi.objects.all()
    serializer_class = SpesialisasiSerializer
    
class ICDPagination(PageNumberPagination):
    page_size = 10  # tampilkan 10 dulu
    page_size_query_param = 'page_size'

class IcdViewSet(viewsets.ModelViewSet):
    queryset = ICD.objects.all()
    serializer_class = IcdSerializer
    pagination_class = ICDPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['kode', 'nama_diagnosa']  # field yang mau dicari

class PasienViewSet(viewsets.ModelViewSet):
    queryset = Pasien.objects.all()
    serializer_class = PasienSerializer
    
class HariPraktekViewSet(viewsets.ModelViewSet):
    queryset = hari_praktek.objects.all()
    serializer_class = HariPraktekSerializer
    
class PerawatViewSet(viewsets.ModelViewSet):
    queryset = perawat.objects.all()
    serializer_class = PerawatSerializer

class PendaftaranViewSet(viewsets.ModelViewSet):
    queryset = Pendaftaran.objects.all()
    serializer_class = PendaftaranSerializer

class HistoryViewSet(viewsets.ModelViewSet):
    queryset = History.objects.all()
    serializer_class = HistorySerializer

class SchedulePraktekViewSet(viewsets.ModelViewSet):
    queryset = schedule_praktek.objects.all()
    serializer_class = SchedulePraktekSerializer

class LaporanIcdView(APIView):
    def get(self, request):
        data = []
        
        bulan_tahun_list = History.objects.annotate(
            bulan=ExtractMonth('tanggal_konsultasi'),
            tahun=ExtractYear('tanggal_konsultasi'),
        ).values('bulan', 'tahun').distinct()
        
        bulan_indonesia = {
            1: "Januari", 2: "Februari", 3: "Maret", 4: "April",
            5: "Mei", 6: "Juni", 7: "Juli", 8: "Agustus",
            9: "September", 10: "Oktober", 11: "November", 12: "Desember"
        }
        
        for item in bulan_tahun_list:
            bulan_angka = item['bulan']  # ← untuk query
            bulan = bulan_indonesia[item['bulan']]
            tahun = item['tahun']

            # Ambil semua ICD dari primary dan secondary
            icd_queryset = History.objects.filter(
                tanggal_konsultasi__month=bulan_angka,
                tanggal_konsultasi__year=tahun
            ).values(
                'diagnosa_primary__kode',
                'diagnosa_primary__nama_diagnosa',
                'diagnosa_secondary__kode',
                'diagnosa_secondary__nama_diagnosa'
            )

            icd_counter = {}

            for icd in icd_queryset:
                # Primary
                kode_prim = icd['diagnosa_primary__kode']
                nama_prim = icd['diagnosa_primary__nama_diagnosa']
                if kode_prim and nama_prim:
                    key = (kode_prim, nama_prim)
                    icd_counter[key] = icd_counter.get(key, 0) + 1

                # Secondary
                kode_sec = icd['diagnosa_secondary__kode']
                nama_sec = icd['diagnosa_secondary__nama_diagnosa']
                if kode_sec and nama_sec:
                    key = (kode_sec, nama_sec)
                    icd_counter[key] = icd_counter.get(key, 0) + 1

            # Ubah ke list dan urutkan
            icd_list = [
                {
                    'kode': kode,
                    'nama_diagnosa': nama,
                    'jumlah_pasien': count
                }
                for (kode, nama), count in icd_counter.items()
            ]
            icd_list = sorted(icd_list, key=lambda x: x['jumlah_pasien'], reverse=True)[:10]

            data.append({
                'tahun': tahun,
                'bulan': bulan,
                'icd_list': icd_list
            })

        return Response(data)

class LaporanDokterView(APIView):
    def get(self, request):
        
        data = []
        
        bulan_tahun_list = History.objects.annotate(
            bulan = ExtractMonth('tanggal_konsultasi'),
            tahun = ExtractYear('tanggal_konsultasi'),
        ).values('bulan', 'tahun').distinct()
        
        bulan_indonesia = {
            1: "Januari", 2: "Februari", 3: "Maret", 4: "April",
            5: "Mei", 6: "Juni", 7: "Juli", 8: "Agustus",
            9: "September", 10: "Oktober", 11: "November", 12: "Desember"
        }
        
        for item in bulan_tahun_list:
            bulan_angka = item['bulan']  # ← untuk query
            bulan = bulan_indonesia[item['bulan']]
            tahun = item['tahun']
            
            dokter_data = []
            
            for dokter in Dokter.objects.all():
                jumlah_pasien = History.objects.filter(
                    Dokter=dokter,
                    tanggal_konsultasi__month=bulan_angka,
                    tanggal_konsultasi__year=tahun
                ).count()
                
                if jumlah_pasien  > 0:
                    spesialisasi_nama = dokter.spesialisasi.nama_spesialisasi if dokter.spesialisasi else "-"
                    dokter_data.append({
                        'id': dokter.id,
                        'nama_dokter': dokter.nama_dokter,
                        'spesialisasi': spesialisasi_nama,
                        'jumlah_pasien': jumlah_pasien
                    })

            data.append({
                'bulan': bulan,
                'tahun': tahun,
                'dokter_umum': dokter_data
            })

        return Response(data)

class LaporanPengunjungView(APIView):
    def get(self, request):
        #Rekap 7 Hari Terakhir
        today = now().date()
        tahun_ini = today.year
        
        start = today - timedelta(days=6)
        minggu_qs = History.objects.filter(
            tanggal_konsultasi__range=[start, today]
        ).annotate(
            weekday = ExtractWeekDay('tanggal_konsultasi')
        ).values('weekday'). annotate(
            jumlah = Count('id')
        )
        
        rekap_7_hari = []

        for i in range(6, -1, -1):  # 6 → 0
            tanggal = today - timedelta(days=i)
            jumlah = History.objects.filter(tanggal_konsultasi=tanggal).count()
            rekap_7_hari.append({
                'tanggal': tanggal.strftime('%Y-%m-%d'),
                'jumlah': jumlah
            })
            
            #Rekap Bulanan
            bulanan_qs = History.objects.filter(
                tanggal_konsultasi__year = tahun_ini
            ).annotate(
                bulan = ExtractMonth('tanggal_konsultasi')
            ).values('bulan').annotate(
                jumlah = Count('id')
            )
            
        jumlah_pasien_bulanan = {calendar.month_name[i]: 0 for i in range(1,13)}
        for item in bulanan_qs:
            nama_bulan = calendar.month_name[item['bulan']]
            jumlah_pasien_bulanan[nama_bulan] = item['jumlah']
            
        #Rekap Tahunan 
        tahunan_qs = History.objects.annotate(
            tahun = ExtractYear('tanggal_konsultasi')
        ).values('tahun').annotate(
            jumlah = Count('id')
        )
            
        jumlah_pasien_tahunan = {}
        for item in tahunan_qs:
            jumlah_pasien_tahunan[str(item['tahun'])] = item['jumlah']
            
        return Response({
            'rekap_7_hari_terakhir': rekap_7_hari,
            'jumlah_pasien_bulanan': jumlah_pasien_bulanan,
            'jumlah_pasien_tahunan': jumlah_pasien_tahunan
        })

@api_view(['POST'])
def api_kirim_email(request):
    id_bpjs = request.data.get("id_bpjs")
    if not id_bpjs:
        return Response({"error": "id_bpjs harus disertakan"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Ambil data pasien
        pasien = Pasien.objects.get(ID_BPJS=id_bpjs)

        if not pasien.email_pasien:
            return Response({"error": "Email pasien tidak tersedia"}, status=status.HTTP_400_BAD_REQUEST)

        # Ambil history terakhir dari M2M pasien.rekap_medis
        latest_history = pasien.rekap_medis.order_by('-id').first()

        if not latest_history:
            return Response({"error": "Riwayat konsultasi tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)

        # Data diagnosa
        diagnosa_sub = latest_history.diagnosa_sub if latest_history.diagnosa_sub else "-"
        diagnosa_primary = latest_history.diagnosa_primary.nama_diagnosa if latest_history.diagnosa_primary else "-"
        diagnosa_secondary = latest_history.diagnosa_secondary.nama_diagnosa if latest_history.diagnosa_secondary else "-"

        dokter = latest_history.Dokter.nama_dokter if latest_history.Dokter else ""

        # Format email
        subject = f"Hasil Konsultasi Anda - {latest_history.tanggal_konsultasi}"
        message = f"""Halo {pasien.nama},

Hasil konsultasi Anda pada {latest_history.tanggal_konsultasi} bersama Dokter {dokter} adalah:
Keluhan: {latest_history.keluhan}
Diagnosa : {diagnosa_sub}
Diagnosa Utama: {diagnosa_primary}
Diagnosa Sekunder: {diagnosa_secondary}

Terima kasih telah berkonsultasi di RSUD KRATON PEKALONGAN 🙏
"""

        send_mail(
            subject,
            message,
            'bangtanviarta@gmail.com',  # Ganti dengan email kamu di settings.py
            [pasien.email_pasien],
            fail_silently=False,
        )

        return Response({"success": True, "message": "Email berhasil dikirim"}, status=status.HTTP_200_OK)

    except Pasien.DoesNotExist:
        return Response({"error": "Pasien tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": f"Terjadi kesalahan: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)