"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Client, Product, Warehouse, Seaport } from "@/types/logistic";
import { X, Truck, Ship, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ShipmentFormModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [seaports, setSeaports] = useState<Seaport[]>([]);

  const [type, setType] = useState<"Terrestre" | "Marítimo">("Terrestre");
  const initialFormData = {
    tracking_number: "",
    client: "",
    product: "",
    product_quantity: 1,
    shipping_price: 0,
    delivery_warehouse: "",
    delivery_port: "",
    vehicle_plate: "",
    fleet_number: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
      setFieldErrors({});
    }
  }, [isOpen]);


  const fetchInitialData = async () => {
    setInitialLoading(true);
    try {
      const [cRes, pRes, wRes, sRes] = await Promise.all([
        api.get("/logistics/clients/"),
        api.get("/logistics/products/"),
        api.get("/logistics/warehouses/"),
        api.get("/logistics/seaports/"),
      ]);
      const clientsData = cRes.data.data.results || cRes.data.data;
      const productsData = pRes.data.data.results || pRes.data.data;
      const warehousesData = wRes.data.data.results || wRes.data.data;
      const seaportsData = sRes.data.data.results || sRes.data.data;

      setClients(clientsData.filter((c: Client) => c.is_active));
      setProducts(productsData.filter((p: Product) => p.is_active));
      setWarehouses(warehousesData.filter((w: Warehouse) => w.is_active));
      setSeaports(seaportsData.filter((s: Seaport) => s.is_active));
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar datos del formulario");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const finalValue = ["tracking_number", "vehicle_plate", "fleet_number"].includes(name) 
      ? value.toUpperCase() 
      : value;
    
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    // Clear error for this field when changed
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    const payload: any = {
      tracking_number: formData.tracking_number,
      client: parseInt(formData.client),
      product: parseInt(formData.product),
      product_quantity: parseInt(formData.product_quantity.toString()),
      shipping_price: parseFloat(formData.shipping_price.toString()),
    };

    let endpoint = "";
    if (type === "Terrestre") {
      endpoint = "/logistics/land-shipments/";
      payload.delivery_warehouse = parseInt(formData.delivery_warehouse);
      payload.vehicle_plate = formData.vehicle_plate;
    } else {
      endpoint = "/logistics/maritime-shipments/";
      payload.delivery_port = parseInt(formData.delivery_port);
      payload.fleet_number = formData.fleet_number;
    }

    try {
      await api.post(endpoint, payload);
      toast.success("Envío creado correctamente");
      setFormData(initialFormData);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 400 && typeof error.response.data === 'object') {
        setFieldErrors(error.response.data);
        toast.error("Por favor, corrige los errores en el formulario");
      } else {
        const msg = error.response?.data?.error || "Error al crear el envío";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderError = (fieldName: string) => {
    const errors = fieldErrors[fieldName];
    if (!errors || errors.length === 0) return null;
    return (
      <p className="text-[10px] text-red-500 font-bold mt-1 animate-in fade-in slide-in-from-top-1">
        {errors[0]}
      </p>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Registrar Nuevo Envío</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          {initialLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p>Cargando opciones...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Type Selector */}
              <div className="flex p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setType("Terrestre");
                    setFieldErrors({});
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                    type === "Terrestre" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Truck size={18} /> Terrestre
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType("Marítimo");
                    setFieldErrors({});
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                    type === "Marítimo" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Ship size={18} /> Marítimo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tracking Number */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Número de Guía (10 Alfanuméricos)</label>
                  <input
                    type="text"
                    name="tracking_number"
                    required
                    maxLength={10}
                    minLength={10}
                    placeholder="ABC1234567"
                    value={formData.tracking_number}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border outline-none transition-all uppercase font-mono ${fieldErrors.tracking_number ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-200 focus:border-blue-500'}`}
                  />
                  {renderError("tracking_number")}
                </div>

                {/* Client */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Cliente</label>
                  <select
                    name="client"
                    required
                    value={formData.client}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${fieldErrors.client ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-200 focus:border-blue-500'}`}
                  >
                    <option value="">Seleccionar cliente</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.last_name}
                      </option>
                    ))}
                  </select>
                  {renderError("client")}
                </div>

                {/* Product */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Producto</label>
                  <select
                    name="product"
                    required
                    value={formData.product}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${fieldErrors.product ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-200 focus:border-blue-500'}`}
                  >
                    <option value="">Seleccionar producto</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {renderError("product")}
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Cantidad de Producto</label>
                  <input
                    type="number"
                    name="product_quantity"
                    min="1"
                    required
                    value={formData.product_quantity}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${fieldErrors.product_quantity ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-200 focus:border-blue-500'}`}
                  />
                  {renderError("product_quantity")}
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Precio de Envío</label>
                  <input
                    type="number"
                    name="shipping_price"
                    min="0"
                    step="0.01"
                    required
                    value={formData.shipping_price}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${fieldErrors.shipping_price ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-200 focus:border-blue-500'}`}
                  />
                  {renderError("shipping_price")}
                </div>

                {/* Conditional Fields: Warehouse / Port */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    {type === "Terrestre" ? "Bodega de Entrega" : "Puerto de Entrega"}
                  </label>
                  <select
                    name={type === "Terrestre" ? "delivery_warehouse" : "delivery_port"}
                    required
                    value={type === "Terrestre" ? formData.delivery_warehouse : formData.delivery_port}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${fieldErrors[type === "Terrestre" ? "delivery_warehouse" : "delivery_port"] ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-200 focus:border-blue-500'}`}
                  >
                    <option value="">Seleccionar destino</option>
                    {type === "Terrestre"
                      ? warehouses.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name} ({w.location})
                          </option>
                        ))
                      : seaports.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.location})
                          </option>
                        ))}
                  </select>
                  {renderError(type === "Terrestre" ? "delivery_warehouse" : "delivery_port")}
                </div>

                {/* Conditional Fields: Plate / Fleet */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    {type === "Terrestre" ? "Placa del Vehículo" : "Número de Flota"}
                  </label>
                  <input
                    type="text"
                    name={type === "Terrestre" ? "vehicle_plate" : "fleet_number"}
                    required
                    placeholder={type === "Terrestre" ? "AAA123" : "AAA1234A"}
                    value={type === "Terrestre" ? formData.vehicle_plate : formData.fleet_number}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border outline-none transition-all uppercase ${fieldErrors[type === "Terrestre" ? "vehicle_plate" : "fleet_number"] ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-gray-200 focus:border-blue-500'}`}
                  />
                  {renderError(type === "Terrestre" ? "vehicle_plate" : "fleet_number")}
                  <p className="text-[10px] text-gray-500 mt-1">
                    {type === "Terrestre" ? "Formato: 3 letras y 3 números" : "Formato: 3 letras, 4 números, 1 letra"}
                  </p>
                </div>
              </div>


              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {loading ? "Registrando..." : "Registrar Envío"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
