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
    data_pasien = PasienSerializer(read_only=True)  # untuk GET (nested)
    data_pasien_id = serializers.PrimaryKeyRelatedField(
        queryset=pasien.objects.all(), write_only=True, source='data_pasien'
    )  # untuk POST/PUT, hanya kirim ID
    class Meta:
        model = Pendaftaran
        fields = [
            'id',
            'data_pasien',       # full nested object for response
            'data_pasien_id',    # ID only for write (input)
            'tanggal_konsultasi',
            'keluhan',
            'nama_dokter',
            'sesi_praktek_dokter',
        ]

class ScheduleSerializer(serializers.ModelSerializer):
    data_pendaftaran = PendaftaranSerializer(many=True)
    data_pendaftaran_ids = serializers.PrimaryKeyRelatedField(queryset=Pendaftaran.objects.all(), write_only=True, many=True, source='data_pendaftaran')
    hari_praktek_dokter = HariPraktekSerializer(many=True)
    class Meta:
        model = schedule
        fields = [
            'id',
            'data_pendaftaran',
            'data_pendaftaran_ids',
            'hari_praktek_dokter',
        ]

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