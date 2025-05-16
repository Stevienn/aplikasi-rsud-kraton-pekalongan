from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

router.register(r'Dokter', DokterViewSet)
router.register(r'DokterSpesialis', DokterSpesialisViewSet)
router.register(r'ICD', IcdViewSet)
router.register(r'Pasien', PasienViewSet)
router.register(r'HariPraktek', HariPraktekViewSet)
router.register(r'SesiPraktek', SesiPraktekViewSet)
router.register(r'Perawat', PerawatViewSet)
router.register(r'Pendaftaran', PendaftaranViewSet)
router.register(r'Diagnosa', DiagnosaViewSet)

urlpatterns = router.urls