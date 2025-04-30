from rest_framework import serializers
from ..models import *

class PasienSerializer(serializers.ModelSerializer):
    tanggal_lahir = serializers.DateField(
    format="%d-%m-%Y",
    input_formats=["%d-%m-%Y"]
)
    class Meta: 
        model = pasien
        fields = '__all__'

class HariPraktekSerializer(serializers.ModelSerializer):
    class Meta: 
        model = hari_praktek
        fields = '__all__'

class PendaftaranSerializer(serializers.ModelSerializer):
    data_pasien = PasienSerializer()
    #sesi_praktek_dokter = Ha
    # riPraktekSerializer()
    class Meta:
        model = Pendaftaran
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    data_pendaftaran = PendaftaranSerializer(many=True)
    hari_praktek_dokter = HariPraktekSerializer(many=True)
    class Meta:
        model = schedule
        fields = '__all__'

class DokterSerializer(serializers.ModelSerializer):
    schedule_dokter = ScheduleSerializer()
    class Meta:
        model = Dokter
        fields = '__all__'

class DokterSpesialisSerializer(serializers.ModelSerializer):
    schedule_dokter_spc = ScheduleSerializer()
    class Meta:
        model = Dokter_spesialis
        fields = '__all__'

class IcdSerializer(serializers.ModelSerializer):
    class Meta:
        model = ICD
        fields = '__all__'

class PerawatSerializer(serializers.ModelSerializer):
    class Meta:
        model = perawat
        fields = '__all__'

class DiagnosaSerializer(serializers.ModelSerializer):
    data_pendaftaran = PendaftaranSerializer()
    diagnosa_icd_1 = IcdSerializer()
    diagnosa_icd_2 = IcdSerializer()
    
    class Meta:
        model = Diagnosa
        fields = '__all__'