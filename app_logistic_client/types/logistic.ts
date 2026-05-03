import { BaseEntity } from "./common";

export interface Client extends BaseEntity {
  name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
}

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: string;
  stock: number;
  is_active: boolean;
}

export interface Warehouse extends BaseEntity {
  name: string;
  location: string;
  capacity: number;
  is_active: boolean;
}

export interface Seaport extends BaseEntity {
  name: string;
  location: string;
  is_active: boolean;
}

