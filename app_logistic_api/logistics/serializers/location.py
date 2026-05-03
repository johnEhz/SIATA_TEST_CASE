from rest_framework import serializers
from logistics.models import Warehouse, Seaport

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'

class SeaportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seaport
        fields = '__all__'
