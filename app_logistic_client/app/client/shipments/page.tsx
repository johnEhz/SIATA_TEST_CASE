"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Shipment } from "@/types/shipment";
import ShipmentDetailModal from "./components/shipment-detail-modal";
import ShipmentFormModal from "./components/shipment-form-modal";
import DataTable, { Column } from "@/components/common/DataTable";
import { Truck, Ship, Package, Tag, Plus } from "lucide-react";

export default function ShipmentsPage() {
  const [data, setData] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleViewDetails = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDetailOpen(true);
  };

  const fetchShipments = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/logistics/shipments/?page=${pageNumber}`);
      const payload = response.data.data;
      setData(payload.results || []);
      setTotalResults(payload.count || 0);
      setTotalPages(Math.ceil((payload.count || 0) / 10));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShipments(page);
  }, [page, fetchShipments]);

  const columns: Column<Shipment>[] = [
    {
      header: "Tracking",
      render: (s) => (
        <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Tag size={14} className="text-blue-500" />
          {s.tracking_number}
        </div>
      ),
    },
    {
      header: "Cliente",
      render: (s) => (
        <div className="text-sm text-gray-900">{s.client_name}</div>
      ),
    },
    {
      header: "Producto",
      render: (s) => (
        <div className="flex flex-col">
          <div className="text-sm text-gray-900 font-medium">{s.product_name}</div>
          <div className="text-xs text-gray-500">Cant: {s.product_quantity}</div>
        </div>
      ),
    },
    {
      header: "Estado",
      render: (s) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          s.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
          s.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
          s.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {s.status}
        </span>
      ),
    },
    {
      header: "Tipo",
      render: (s) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          {s.shipping_type === 'Terrestre' ? <Truck size={14} /> : <Ship size={14} />}
          {s.shipping_type}
        </div>
      ),
    },
    {
      header: "Transporte",
      render: (s) => (
        <div className="text-xs text-gray-500 font-medium">
          {s.vehicle_plate ? `Placa: ${s.vehicle_plate}` : `Flota: ${s.fleet_number}`}
        </div>
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (s) => (
        <button 
          onClick={() => handleViewDetails(s)}
          className="text-blue-600 hover:text-blue-900 font-bold text-xs uppercase tracking-wider"
        >
          Ver Detalles
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Envíos</h1>
          <p className="mt-2 text-sm text-gray-700">Listado de todos los envíos registrados.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Nuevo Envío
        </button>
      </div>
      
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="No hay envíos registrados."
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          totalResults: totalResults,
          itemsPerPage: 10,
          onPageChange: (newPage) => setPage(newPage),
        }}
      />

      <ShipmentDetailModal 
        shipment={selectedShipment} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        onStatusUpdate={() => {
          fetchShipments(page);
          setIsDetailOpen(false);
        }}
      />

      <ShipmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => fetchShipments(1)}
      />
    </div>
  );
}

