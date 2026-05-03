import { BaseEntity } from "./common";

export interface Shipment extends BaseEntity {
  client_name: string;
  product_name: string;
  discount_percentage: string;
  shipping_type: string;
  delivery_warehouse_name: string;
  product_quantity: number;
  registration_date: string;
  delivery_date: string;
  shipping_price: string;
  tracking_number: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';
  vehicle_plate: string;
  client: number;
  product: number;
  delivery_warehouse: number;
  delivery_port?: number;
  fleet_number?: string;
  delivery_port_name?: string;
}