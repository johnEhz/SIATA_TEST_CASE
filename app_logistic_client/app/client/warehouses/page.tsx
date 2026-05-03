"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Warehouse } from "@/types/logistic";
import { Warehouse as WarehouseIcon, MapPin, Box, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import DataTable, { Column } from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import EntityForm, { FieldConfig } from "@/components/common/EntityForm";
import { toast } from "sonner";

export default function WarehousesPage() {
  const [data, setData] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Warehouse | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchWarehouses = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/logistics/warehouses/?page=${pageNumber}`);
      const payload = response.data.data;

      const results = payload.results || payload;
      setData(results || []);
      setTotalResults(payload.count || results.length || 0);
      setTotalPages(Math.ceil((payload.count || results.length || 0) / 10));
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar las bodegas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses(page);
  }, [page, fetchWarehouses]);

  const handleToggleStatus = async (warehouse: Warehouse) => {
    try {
      await api.patch(`/logistics/warehouses/${warehouse.id}/`, {
        is_active: !warehouse.is_active,
      });
      toast.success(`Bodega ${!warehouse.is_active ? "activada" : "desactivada"} correctamente`);
      fetchWarehouses(page);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estado");
    }
  };

  const handleOpenModal = (warehouse?: Warehouse) => {
    setSelectedEntity(warehouse || null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      if (selectedEntity) {
        await api.patch(`/logistics/warehouses/${selectedEntity.id}/`, formData);
        toast.success("Bodega actualizada correctamente");
      } else {
        await api.post("/logistics/warehouses/", formData);
        toast.success("Bodega creada correctamente");
      }
      setIsModalOpen(false);
      fetchWarehouses(page);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la bodega");
    } finally {
      setFormLoading(false);
    }
  };

  const fields: FieldConfig[] = [
    { name: "name", label: "Nombre de la Bodega", type: "text", required: true },
    { name: "location", label: "Ubicación", type: "text", required: true },
    { name: "capacity", label: "Capacidad (unidades)", type: "number", required: true },
  ];

  const columns: Column<Warehouse>[] = [
    {
      header: "Bodega",
      render: (warehouse) => (
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-10 w-10 ${warehouse.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} rounded-lg flex items-center justify-center`}>
            <WarehouseIcon size={20} />
          </div>
          <div className="ml-4">
            <div className={`text-sm font-medium ${warehouse.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
              {warehouse.name}
            </div>
            <div className="text-xs text-gray-500">ID: #{warehouse.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Ubicación",
      render: (warehouse) => (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={14} className="text-gray-400" /> {warehouse.location}
        </div>
      ),
    },
    {
      header: "Capacidad",
      render: (warehouse) => (
        <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
          <Box size={14} className="text-gray-400" /> {warehouse.capacity} uds
        </div>
      ),
    },
    {
      header: "Estado",
      render: (warehouse) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          warehouse.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {warehouse.is_active ? 'Activa' : 'Inactiva'}
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (warehouse) => (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => handleOpenModal(warehouse)}
            className="text-blue-600 hover:text-blue-900 font-medium text-sm"
          >
            Editar
          </button>
          <button 
            onClick={() => handleToggleStatus(warehouse)}
            className={`${warehouse.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'} font-medium text-sm flex items-center gap-1`}
          >
            {warehouse.is_active ? (
              <ToggleRight size={16} />
            ) : (
              <ToggleLeft size={16} />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bodegas</h1>
          <p className="mt-2 text-sm text-gray-700">Centros de almacenamiento terrestre.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Nueva Bodega
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="No hay bodegas registradas."
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          totalResults: totalResults,
          itemsPerPage: 10,
          onPageChange: (newPage) => setPage(newPage),
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEntity ? "Editar Bodega" : "Nuevo Bodega"}
      >
        <EntityForm
          fields={fields}
          initialData={selectedEntity}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={formLoading}
        />
      </Modal>
    </div>
  );
}

