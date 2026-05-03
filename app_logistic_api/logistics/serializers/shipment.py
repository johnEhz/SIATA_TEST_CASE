from rest_framework import serializers
from logistics.models import Shipment, LandShipment, MaritimeShipment
from logistics.services.shipment_service import ShipmentService

class BaseShipmentSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    discount_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    shipping_type = serializers.SerializerMethodField(method_name='get_shipping_type')

    class Meta:
        abstract = True

    def get_shipping_type(self, obj):
        if hasattr(obj, 'landshipment') or hasattr(obj, 'vehicle_plate'):
            return 'Terrestre'
        elif hasattr(obj, 'maritimeshipment') or hasattr(obj, 'fleet_number'):
            return 'Marítimo'
        return 'General'

class LandShipmentSerializer(BaseShipmentSerializer):
    delivery_warehouse_name = serializers.CharField(source='delivery_warehouse.name', read_only=True)
    class Meta:
        model = LandShipment
        fields = '__all__'

    def create(self, validated_data):
        return ShipmentService.create_land_shipment(validated_data)

class MaritimeShipmentSerializer(BaseShipmentSerializer):
    delivery_port_name = serializers.CharField(source='delivery_port.name', read_only=True)
    class Meta:
        model = MaritimeShipment
        fields = '__all__'

    def create(self, validated_data):
        return ShipmentService.create_maritime_shipment(validated_data)

class ShipmentSerializer(BaseShipmentSerializer):
    class Meta:
        model = Shipment
        fields = '__all__'

    def to_representation(self, instance):
        if hasattr(instance, 'landshipment'):
            serializer = LandShipmentSerializer(instance.landshipment, context=self.context)
            return serializer.to_representation(instance.landshipment)
        elif hasattr(instance, 'maritimeshipment'):
            serializer = MaritimeShipmentSerializer(instance.maritimeshipment, context=self.context)
            return serializer.to_representation(instance.maritimeshipment)
        
        return super().to_representation(instance)
