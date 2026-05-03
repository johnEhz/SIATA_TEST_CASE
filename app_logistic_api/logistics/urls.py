from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClientViewSet, ProductViewSet, WarehouseViewSet, SeaportViewSet,
    ShipmentViewSet, LandShipmentViewSet, MaritimeShipmentViewSet
)

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'warehouses', WarehouseViewSet, basename='warehouse')
router.register(r'seaports', SeaportViewSet, basename='seaport')
router.register(r'shipments', ShipmentViewSet, basename='shipment')
router.register(r'land-shipments', LandShipmentViewSet, basename='land-shipment')
router.register(r'maritime-shipments', MaritimeShipmentViewSet, basename='maritime-shipment')

urlpatterns = [
    path('', include(router.urls)),
]
