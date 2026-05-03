from django.db import models
from django.core.validators import RegexValidator, MinValueValidator
from django.utils import timezone
from .base import BaseModel
from .client import Client
from .product import Product
from .location import Warehouse, Seaport

class Shipment(BaseModel):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_TRANSIT = 'IN_TRANSIT', 'In Transit'
        DELIVERED = 'DELIVERED', 'Delivered'
        CANCELLED = 'CANCELLED', 'Cancelled'

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='shipments')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='shipments', null=True)
    product_quantity = models.IntegerField(validators=[MinValueValidator(1)], default=1)
    registration_date = models.DateField(default=timezone.localdate)
    delivery_date = models.DateField(null=True, blank=True)
    shipping_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tracking_number = models.CharField(
        max_length=10,
        unique=True,
        validators=[RegexValidator(r'^[A-Za-z0-9]{10}$', 'El número de seguimiento debe tener 10 caracteres alfanuméricos.')],
        null=False, blank=False
    )
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.PENDING)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        if self.tracking_number:
            self.tracking_number = self.tracking_number.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Shipment #{self.tracking_number} for {self.client.name} - {self.status}"

class LandShipment(Shipment):
    delivery_warehouse = models.ForeignKey(Warehouse, on_delete=models.SET_NULL, null=True, blank=True, related_name='land_shipments')
    vehicle_plate = models.CharField(
        max_length=6,
        validators=[RegexValidator(r'^[A-Za-z]{3}\d{3}$', 'La placa del vehículo debe tener 3 letras seguidas de 3 números (ej. AAA123).')],
        null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if self.vehicle_plate:
            self.vehicle_plate = self.vehicle_plate.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Land Shipment #{self.tracking_number} - Plate: {self.vehicle_plate}"

class MaritimeShipment(Shipment):
    delivery_port = models.ForeignKey(Seaport, on_delete=models.SET_NULL, null=True, blank=True, related_name='maritime_shipments')
    fleet_number = models.CharField(
        max_length=8,
        validators=[RegexValidator(r'^[A-Za-z]{3}\d{4}[A-Za-z]{1}$', 'El número de flota debe tener 3 letras, 4 números y 1 letra (ej. AAA1234A).')],
        null=False, blank=False
    )

    def save(self, *args, **kwargs):
        if self.fleet_number:
            self.fleet_number = self.fleet_number.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Maritime Shipment #{self.tracking_number} - Fleet: {self.fleet_number}"

