from django.contrib import admin
from .models import Client, Product, Warehouse, Seaport, Shipment, LandShipment, MaritimeShipment

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'last_name', 'email', 'phone', 'address', 'is_active')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'stock', 'price', 'is_active')

@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'capacity', 'is_active')

@admin.register(Seaport)
class SeaportAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'is_active')

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'tracking_number', 'client', 'product', 'product_quantity', 'status', 'registration_date')

@admin.register(LandShipment)
class LandShipmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'tracking_number', 'client', 'delivery_warehouse', 'vehicle_plate', 'status')

@admin.register(MaritimeShipment)
class MaritimeShipmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'tracking_number', 'client', 'delivery_port', 'fleet_number', 'status')
