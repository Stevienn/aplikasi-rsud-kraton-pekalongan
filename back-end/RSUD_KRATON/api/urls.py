from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

router.register(r'Dokter Spesialis', DokterSpesialisViewSet)
router.register(r'Dokter Umum', DokterUmumViewSet)
router.register(r'ICD', IcdViewSet)
router.register(r'Pasien', PasienViewSet)
router.register(r'HariPraktek', HariPraktekViewSet)
router.register(r'Schedule', ScheduleViewSet)
router.register(r'Perawat', PerawatViewSet)
router.register(r'Pendaftaran', PendaftaranViewSet)
router.register(r'Diagnosa', DiagnosaViewSet)

urlpatterns = router.urls