from rest_framework import serializers
from ..models import *

class HariPraktekSerializer(serializers.ModelSerializer):
    class Meta: 
        model = hari_praktek
        fields = '__all__'
        
class ScheduleSerializer(serializers.ModelSerializer):
    hari_praktek_dokter = HariPraktekSerializer()
    class Meta:
        model = schedule
        fields = '__all__'

class DokterUmumSerializer(serializers.ModelSerializer):
    schedule = ScheduleSerializer()
    class Meta:
        model = Dokter_umum
        fields = '__all__'

class DokterSpesialisSerializer(serializers.ModelSerializer):
    schedule = ScheduleSerializer()
    class Meta:
        model = Dokter_spesialis
        fields = '__all__'

class IcdSerializer(serializers.ModelSerializer):
    class Meta:
        model = ICD
        fields = '__all__'
        
class PasienSerializer(serializers.ModelSerializer):
    class Meta: 
        model = pasien
        fields = '__all__'

class PerawatSerializer(serializers.ModelSerializer):
    class Meta:
        model = perawat
        fields = '__all__'

class PendaftaranSerializer(serializers.ModelSerializer):
    id = PasienSerializer()
    
    class Meta:
        model = Pendaftaran
        fields = '__all__'

class DiagnosaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosa
        fields = '__all__'