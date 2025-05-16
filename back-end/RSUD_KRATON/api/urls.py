from rest_framework import routers
from .views import *
# from .views import icd_lookup
from django.urls import path, include

router = routers.DefaultRouter()

router.register(r'Dokter', DokterViewSet)
router.register(r'DokterSpesialis', DokterSpesialisViewSet)
router.register(r'ICD', IcdViewSet)
router.register(r'Pasien', PasienViewSet)
router.register(r'HariPraktek', HariPraktekViewSet)
router.register(r'SesiPraktek', SesiPraktekViewSet)
router.register(r'Perawat', PerawatViewSet)
router.register(r'Pendaftaran', PendaftaranViewSet)
# router.register(r'Diagnosa', DiagnosaViewSet)
router.register(r'History', HistoryViewSet)
router.register(r'RekapMedis', RekapMedisViewSet)

urlpatterns = router.urls

# urlpatterns  = [
#     path('lookup/<str:code>/', icd_lookup, name='icd_lookup'),
# ]