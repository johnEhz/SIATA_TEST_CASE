from decimal import Decimal
from django.utils import timezone
from logistics.models import LandShipment, MaritimeShipment

class ShipmentService:
    @staticmethod
    def create_land_shipment(validated_data):
        quantity = validated_data.get('product_quantity', 1)
        shipping_price = validated_data.get('shipping_price', Decimal('0.00'))

        if quantity > 10:
            discount = Decimal('0.05')
            shipping_price = shipping_price * (Decimal('1.00') - discount)
            validated_data['shipping_price'] = shipping_price
            validated_data['discount_percentage'] = discount

        return LandShipment.objects.create(**validated_data)

    @staticmethod
    def create_maritime_shipment(validated_data):
        quantity = validated_data.get('product_quantity', 1)
        shipping_price = validated_data.get('shipping_price', Decimal('0.00'))

        if quantity > 10:
            discount = Decimal('0.03')
            shipping_price = shipping_price * (Decimal('1.00') - discount)
            validated_data['shipping_price'] = shipping_price
            validated_data['discount_percentage'] = discount

        return MaritimeShipment.objects.create(**validated_data)

    @staticmethod
    def complete_shipment(shipment):
        if shipment.status == 'DELIVERED':
            raise ValueError("El envío ya ha sido marcado como entregado.")
            
        shipment.status = 'DELIVERED'
        shipment.delivery_date = timezone.localdate()
        shipment.save()
        return shipment
