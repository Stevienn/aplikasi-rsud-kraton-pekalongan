from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import *

admin.site.register(Pasien)
admin.site.register(Dokter)
admin.site.register(Dokter_spesialis)
admin.site.register(hari_praktek)
admin.site.register(ICD)
admin.site.register(perawat)
admin.site.register(Pendaftaran)
# admin.site.register(Diagnosa)
# admin.site.register(sesi_praktek)
admin.site.register(History)
admin.site.register(rekap_medis)
admin.site.register(schedule_praktek)