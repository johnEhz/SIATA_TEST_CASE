"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Client } from "@/types/logistic";
import { Users, Mail, Phone, MapPin, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import DataTable, { Column } from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import EntityForm, { FieldConfig } from "@/components/common/EntityForm";
import { toast } from "sonner";

export default function ClientsPage() {
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Client | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchClients = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/logistics/clients/?page=${pageNumber}`);
      const payload = response.data.data;
      setData(payload.results || []);
      setTotalResults(payload.count || 0);
      setTotalPages(Math.ceil((payload.count || 0) / 10));
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients(page);
  }, [page, fetchClients]);

  const handleToggleStatus = async (client: Client) => {
    try {
      await api.patch(`/logistics/clients/${client.id}/`, {
        is_active: !client.is_active,
      });
      toast.success(`Cliente ${!client.is_active ? "activado" : "desactivado"} correctamente`);
      fetchClients(page);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estado");
    }
  };

  const handleOpenModal = (client?: Client) => {
    setSelectedEntity(client || null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      if (selectedEntity) {
        await api.patch(`/logistics/clients/${selectedEntity.id}/`, formData);
        toast.success("Cliente actualizado correctamente");
      } else {
        await api.post("/logistics/clients/", formData);
        toast.success("Cliente creado correctamente");
      }
      setIsModalOpen(false);
      fetchClients(page);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el cliente");
    } finally {
      setFormLoading(false);
    }
  };

  const fields: FieldConfig[] = [
    { name: "name", label: "Nombre", type: "text", required: true },
    { name: "last_name", label: "Apellido", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Teléfono", type: "text", required: true },
    { name: "address", label: "Dirección", type: "text", required: true },
  ];

  const columns: Column<Client>[] = [
    {
      header: "Nombre",
      render: (client) => (
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-10 w-10 ${client.is_active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'} rounded-full flex items-center justify-center`}>
            <Users size={20} />
          </div>
          <div className="ml-4">
            <div className={`text-sm font-medium ${client.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
              {client.name} {client.last_name}
            </div>
            <div className="text-xs text-gray-500">ID: #{client.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Contacto",
      render: (client) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-900 flex items-center gap-2">
            <Mail size={14} className="text-gray-400" /> {client.email}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Phone size={14} className="text-gray-400" /> {client.phone}
          </div>
        </div>
      ),
    },
    {
      header: "Dirección",
      render: (client) => (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={14} className="text-gray-400" /> {client.address}
        </div>
      ),
    },
    {
      header: "Estado",
      render: (client) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          client.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {client.is_active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (client) => (
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => handleOpenModal(client)}
            className="text-blue-600 hover:text-blue-900 font-medium text-sm"
          >
            Editar
          </button>
          <button 
            onClick={() => handleToggleStatus(client)}
            className={`${client.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'} font-medium text-sm flex items-center gap-1`}
          >
            {client.is_active ? (
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
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-2 text-sm text-gray-700">Gestiona la base de datos de tus clientes registrados.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Nuevo Cliente
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="No hay clientes registrados."
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
        title={selectedEntity ? "Editar Cliente" : "Nuevo Cliente"}
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

