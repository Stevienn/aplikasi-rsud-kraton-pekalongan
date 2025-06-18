from rest_framework import serializers
from ..models import *

class SpesialisasiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spesialisasi
        fields = '__all__'

class DokterSerializer(serializers.ModelSerializer):
    # spesialisasi = SpesialisasiSerializer(read_only=True, source='spesialisasi_dokter')
    # spesialisasi_id = serializers.PrimaryKeyRelatedField(
    #       queryset = Spesialisasi.objects.all(), source='spesialisasi', write_only=True
    # )
    class Meta:
        model = Dokter
        fields = '__all__'

class IcdSerializer(serializers.ModelSerializer):
    class Meta:
        model = ICD
        fields = '__all__'

class HistorySerializer(serializers.ModelSerializer):
    data_dokter = DokterSerializer(read_only=True, source='Dokter')
    data_dokter_id = serializers.PrimaryKeyRelatedField(
        queryset=Dokter.objects.all(), write_only=True, source='Dokter', required=False, allow_null=True
    )
    diagnosa_primary = IcdSerializer(read_only=True)
    diagnosa_primary_id = serializers.PrimaryKeyRelatedField(
        queryset=ICD.objects.all(), write_only=True, source='diagnosa_primary'
    )
    diagnosa_secondary = IcdSerializer(read_only=True)
    diagnosa_secondary_id = serializers.PrimaryKeyRelatedField(
        queryset=ICD.objects.all(), write_only=True, source='diagnosa_secondary', required=False, allow_null=True
    )
    class Meta:
        model = History
        fields = ['id', 'data_dokter', 'data_dokter_id', 'tanggal_konsultasi', 'keluhan', 'diagnosa_sub', 'diagnosa_primary', 'diagnosa_primary_id', 'diagnosa_secondary', 'diagnosa_secondary_id']

class PasienSerializer(serializers.ModelSerializer):
    tanggal_lahir = serializers.DateField(
    format="%d-%m-%Y",
    input_formats=["%d-%m-%Y"]
)
    rekap_medis = HistorySerializer(many=True, read_only=True)
    class Meta: 
        model = Pasien
        fields = '__all__'

class PendaftaranSerializer(serializers.ModelSerializer):
    data_pasien = PasienSerializer(read_only=True)  # untuk GET (nested)
    data_pasien_id = serializers.PrimaryKeyRelatedField(
        queryset=Pasien.objects.all(), write_only=True, source='data_pasien'
    )  # untuk POST/PUT, hanya kirim ID
    class Meta:
        model = Pendaftaran
        fields = [
            'data_pasien',       # full nested object for response
            'data_pasien_id',    # ID only for write (input)
            'tanggal_konsultasi',
            'keluhan',
            'nama_dokter',
            'sesi_praktek_dokter'
        ]

class HariPraktekSerializer(serializers.ModelSerializer):
    class Meta:
        model = hari_praktek
        fields = ['id', 'hari']

class PerawatSerializer(serializers.ModelSerializer):
    class Meta:
        model = perawat
        fields = '__all__'

class SchedulePraktekSerializer(serializers.ModelSerializer):
    data_pendaftaran_ids = serializers.PrimaryKeyRelatedField(queryset=Pendaftaran.objects.all(), write_only=True, many=True, source='data_pendaftaran')
    data_pendaftaran = PendaftaranSerializer(many=True, read_only=True)
    hari = HariPraktekSerializer(read_only=True)
    dokter_umum = DokterSerializer(read_only=True)
    
    class Meta:
        model = schedule_praktek
        fields = '__all__'