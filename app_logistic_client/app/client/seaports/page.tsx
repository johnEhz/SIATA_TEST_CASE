"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Seaport } from "@/types/logistic";
import { Anchor, MapPin, Ship, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import DataTable, { Column } from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import EntityForm, { FieldConfig } from "@/components/common/EntityForm";
import { toast } from "sonner";

export default function SeaportsPage() {
  const [data, setData] = useState<Seaport[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Seaport | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchSeaports = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/logistics/seaports/?page=${pageNumber}`);
      const payload = response.data.data;

      const results = payload.results || payload;
      setData(results || []);
      setTotalResults(payload.count || results.length || 0);
      setTotalPages(Math.ceil((payload.count || results.length || 0) / 10));
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los puertos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeaports(page);
  }, [page, fetchSeaports]);

  const handleToggleStatus = async (port: Seaport) => {
    try {
      await api.patch(`/logistics/seaports/${port.id}/`, {
        is_active: !port.is_active,
      });
      toast.success(`Puerto ${!port.is_active ? "activado" : "desactivado"} correctamente`);
      fetchSeaports(page);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estado");
    }
  };

  const handleOpenModal = (port?: Seaport) => {
    setSelectedEntity(port || null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      if (selectedEntity) {
        await api.patch(`/logistics/seaports/${selectedEntity.id}/`, formData);
        toast.success("Puerto actualizado correctamente");
      } else {
        await api.post("/logistics/seaports/", formData);
        toast.success("Puerto creado correctamente");
      }
      setIsModalOpen(false);
      fetchSeaports(page);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el puerto");
    } finally {
      setFormLoading(false);
    }
  };

  const fields: FieldConfig[] = [
    { name: "name", label: "Nombre del Puerto", type: "text", required: true },
    { name: "location", label: "Ubicación (Ciudad, País)", type: "text", required: true },
  ];

  const columns: Column<Seaport>[] = [
    {
      header: "Puerto",
      render: (port) => (
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-10 w-10 ${port.is_active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'} rounded-lg flex items-center justify-center`}>
            <Anchor size={20} />
          </div>
          <div className="ml-4">
            <div className={`text-sm font-medium ${port.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
              {port.name}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              ID: #{port.id}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Ubicación",
      render: (port) => (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={14} className="text-blue-500" /> {port.location}
        </div>
      ),
    },
    {
      header: "Tipo",
      render: () => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          Marítimo <Ship size={12} />
        </span>
      ),
    },
    {
      header: "Estado",
      render: (port) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          port.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {port.is_active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (port) => (
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => handleOpenModal(port)}
            className="text-blue-600 hover:text-blue-900 font-medium text-sm"
          >
            Editar
          </button>
          <button 
            onClick={() => handleToggleStatus(port)}
            className={`${port.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'} font-medium text-sm flex items-center gap-1`}
          >
            {port.is_active ? (
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
          <h1 className="text-2xl font-bold text-gray-900">Puertos Marítimos</h1>
          <p className="mt-2 text-sm text-gray-700">Terminales de carga para operaciones internacionales.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Nuevo Puerto
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="No hay puertos registrados."
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
        title={selectedEntity ? "Editar Puerto" : "Nuevo Puerto"}
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

