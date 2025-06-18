from rest_framework import routers
from .views import *
# from .views import icd_lookup
from django.urls import path, include

router = routers.DefaultRouter()

router.register(r'Dokter', DokterViewSet)
router.register(r'Spesialisasi', SpesialisasiViewSet)
router.register(r'ICD', IcdViewSet)
router.register(r'Pasien', PasienViewSet)
router.register(r'HariPraktek', HariPraktekViewSet)
router.register(r'Perawat', PerawatViewSet)
router.register(r'Pendaftaran', PendaftaranViewSet)
router.register(r'History', HistoryViewSet)
router.register(r'SchedulePraktek', SchedulePraktekViewSet)

urlpatterns = router.urls

# urlpatterns  = [
#     path('lookup/<str:code>/', icd_lookup, name='icd_lookup'),
# ]