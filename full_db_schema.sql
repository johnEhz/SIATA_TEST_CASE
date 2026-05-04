-- TABLA DE USUARIOS (Custom User)
CREATE TABLE public.users_user (
    id bigint NOT NULL,
    first_name character varying(150),
    last_name character varying(150),
    email character varying(254) UNIQUE,
    document_number character varying(50) UNIQUE,
    is_active boolean,
    date_joined timestamp with time zone
);

-- TABLA DE CLIENTES
CREATE TABLE public.logistics_client (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    last_name character varying(255),
    email character varying(254) UNIQUE,
    phone character varying(50),
    address text,
    is_active boolean DEFAULT TRUE
);

-- TABLA DE PRODUCTOS
CREATE TABLE public.logistics_product (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    is_active boolean DEFAULT TRUE
);

-- TABLAS DE INFRAESTRUCTURA (BODEGAS Y PUERTOS)
CREATE TABLE public.logistics_warehouse (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    location character varying(255),
    capacity integer,
    is_active boolean DEFAULT TRUE
);

CREATE TABLE public.logistics_seaport (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    location character varying(255),
    is_active boolean DEFAULT TRUE
);

-- TABLA BASE DE ENVÍOS
CREATE TABLE public.logistics_shipment (
    id bigint NOT NULL,
    tracking_number character varying(10) UNIQUE,
    registration_date date NOT NULL,
    delivery_date date,
    shipping_price numeric(10,2),
    discount_percentage numeric(5,2),
    status character varying(50),
    client_id bigint REFERENCES public.logistics_client(id),
    product_id bigint REFERENCES public.logistics_product(id)
);

-- TABLAS ESPECIALIZADAS (TERRESTRE Y MARÍTIMO)
CREATE TABLE public.logistics_landshipment (
    shipment_ptr_id bigint PRIMARY KEY REFERENCES public.logistics_shipment(id),
    vehicle_plate character varying(6),
    delivery_warehouse_id bigint REFERENCES public.logistics_warehouse(id)
);

CREATE TABLE public.logistics_maritimeshipment (
    shipment_ptr_id bigint PRIMARY KEY REFERENCES public.logistics_shipment(id),
    fleet_number character varying(8),
    delivery_port_id bigint REFERENCES public.logistics_seaport(id)
);
