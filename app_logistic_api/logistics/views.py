from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Client, Product, Warehouse, Seaport, Shipment, LandShipment, MaritimeShipment
from .serializers import (
    ClientSerializer, ProductSerializer, WarehouseSerializer, SeaportSerializer,
    ShipmentSerializer, LandShipmentSerializer, MaritimeShipmentSerializer
)
from rest_framework.decorators import action
from rest_framework.response import Response
from logistics.services.shipment_service import ShipmentService

class ShipmentCompletionMixin:
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        shipment = self.get_object()
        try:
            completed_shipment = ShipmentService.complete_shipment(shipment)
            serializer = self.get_serializer(completed_shipment)
            return Response(serializer.data)
        except ValueError as e:
            return Response({'error': str(e)}, status=400)

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]

class SeaportViewSet(viewsets.ModelViewSet):
    queryset = Seaport.objects.all()
    serializer_class = SeaportSerializer
    permission_classes = [IsAuthenticated]

class ShipmentViewSet(ShipmentCompletionMixin, viewsets.ModelViewSet):
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]

class LandShipmentViewSet(viewsets.ModelViewSet):
    queryset = LandShipment.objects.all()
    serializer_class = LandShipmentSerializer
    permission_classes = [IsAuthenticated]

class MaritimeShipmentViewSet(viewsets.ModelViewSet):
    queryset = MaritimeShipment.objects.all()
    serializer_class = MaritimeShipmentSerializer
    permission_classes = [IsAuthenticated]
