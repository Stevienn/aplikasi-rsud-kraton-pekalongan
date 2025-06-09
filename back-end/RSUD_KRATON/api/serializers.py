from rest_framework import serializers
from ..models import *

class PasienSerializer(serializers.ModelSerializer):
    tanggal_lahir = serializers.DateField(
    format="%d-%m-%Y",
    input_formats=["%d-%m-%Y"]
)
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
            'sesi_praktek_dokter',
        ]

class HariPraktekSerializer(serializers.ModelSerializer):
    class Meta:
        model = hari_praktek
        fields = ['id', 'hari', 'hari_praktek_set']

class DokterSerializer(serializers.ModelSerializer):
    # schedule_dokter = HariPraktekSerializer(many=True, read_only=True)
    class Meta:
        model = Dokter
        fields = '__all__'

class DokterWithoutScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dokter
        exclude = ['schedule_dokter', 'password_dokter']

class DokterSpesialisSerializer(serializers.ModelSerializer):
    # schedule_dokter = HariPraktekSerializer(many=True, read_only=True)
    class Meta:
        model = Dokter_spesialis
        fields = '__all__'
        
class DokterSpesialisWithoutScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dokter_spesialis
        exclude = ['schedule_dokter', 'password_dokter']

class IcdSerializer(serializers.ModelSerializer):
    class Meta:
        model = ICD
        fields = '__all__'

class PerawatSerializer(serializers.ModelSerializer):
    class Meta:
        model = perawat
        fields = '__all__'

class HistorySerializer(serializers.ModelSerializer):
    data_dokter_umum = DokterWithoutScheduleSerializer(read_only=True, source='Dokter')
    data_dokter_umum_id = serializers.PrimaryKeyRelatedField(
        queryset=Dokter.objects.all(), write_only=True, source='Dokter', required=False, allow_null=True
    )
    data_dokter_spesialis = DokterSpesialisWithoutScheduleSerializer(read_only=True, source='Dokter_spesialis')
    data_dokter_spesialis_id = serializers.PrimaryKeyRelatedField(
        queryset=Dokter_spesialis.objects.all(), write_only=True, source='Dokter_spesialis', required=False, allow_null=True
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
        fields = ['id', 'data_dokter_umum', 'data_dokter_umum_id', 'data_dokter_spesialis', 'data_dokter_spesialis_id', 'tanggal_konsultasi', 'keluhan', 'diagnosa_sub', 'diagnosa_primary', 'diagnosa_primary_id', 'diagnosa_secondary', 'diagnosa_secondary_id']

class RekapMedisSerializer(serializers.ModelSerializer):
    data_pasien = PasienSerializer(read_only=True, source='ID_BPJS')  # untuk GET (nested)
    data_pasien_id = serializers.PrimaryKeyRelatedField(
        queryset=Pasien.objects.all(), write_only=True, source='ID_BPJS'
    ) 
    history = HistorySerializer(many=True, read_only=True)
    history_ids = serializers.PrimaryKeyRelatedField(queryset=History.objects.all(), write_only=True, many=True, source='history')

    class Meta:
        model = rekap_medis
        fields = ['data_pasien', 'data_pasien_id', 'history', 'history_ids']

class SchedulePraktekSerializer(serializers.ModelSerializer):
    data_pendaftaran_ids = serializers.PrimaryKeyRelatedField(queryset=Pendaftaran.objects.all(), write_only=True, many=True, source='data_pendaftaran')
    data_pendaftaran = PendaftaranSerializer(many=True, read_only=True)
    hari = HariPraktekSerializer(many=True, read_only=True)
    dokter_umum = DokterSerializer(many=True, read_only=True)
    dokter_spesialis = DokterSpesialisSerializer(many=True, read_only=True)
    
    class Meta:
        model = schedule_praktek
        fields = '__all__'