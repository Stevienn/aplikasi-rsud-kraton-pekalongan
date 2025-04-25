from rest_framework import serializers
from ..models import *

class DokterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dokter
        fields = ('id', 'nama_dokter')

class IcdSerializer(serializers.ModelSerializer):
    class Meta:
        model = ICD
        fields = ('kode', 'nama_diagnosa')

class PasienSerializer(serializers.ModelSerializer):
    class Meta: 
        model = pasien
        fields = '__all__'

class HariPraktekSerializer(serializers.ModelSerializer):
    class Meta: 
        model = hari_praktek
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = schedule
        fields = '__all__'

class PerawatSerializer(serializers.ModelSerializer):
    class Meta:
        model = perawat
        fields = '__all__'

class PendaftaranSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pendaftaran
        fields = '__all__'

class DiagnosaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosa
        fields = '__all__'