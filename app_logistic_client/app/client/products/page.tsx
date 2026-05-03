"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Product } from "@/types/logistic";
import { Package, DollarSign, Tag, Archive, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import DataTable, { Column } from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import EntityForm, { FieldConfig } from "@/components/common/EntityForm";
import { toast } from "sonner";

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchProducts = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/logistics/products/?page=${pageNumber}`);
      const payload = response.data.data;
      setData(payload.results || []);
      setTotalResults(payload.count || 0);
      setTotalPages(Math.ceil((payload.count || 0) / 10));
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const handleToggleStatus = async (product: Product) => {
    try {
      await api.patch(`/logistics/products/${product.id}/`, {
        is_active: !product.is_active,
      });
      toast.success(`Producto ${!product.is_active ? "activado" : "desactivado"} correctamente`);
      fetchProducts(page);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estado");
    }
  };

  const handleOpenModal = (product?: Product) => {
    setSelectedEntity(product || null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      if (selectedEntity) {
        await api.patch(`/logistics/products/${selectedEntity.id}/`, formData);
        toast.success("Producto actualizado correctamente");
      } else {
        await api.post("/logistics/products/", formData);
        toast.success("Producto creado correctamente");
      }
      setIsModalOpen(false);
      fetchProducts(page);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el producto");
    } finally {
      setFormLoading(false);
    }
  };

  const fields: FieldConfig[] = [
    { name: "name", label: "Nombre", type: "text", required: true },
    { name: "description", label: "Descripción", type: "textarea", required: true },
    { name: "price", label: "Precio", type: "number", required: true },
    { name: "stock", label: "Stock", type: "number", required: true },
    { name: "is_active", label: "Estado", type: "checkbox" },
  ];

  const columns: Column<Product>[] = [
    {
      header: "Producto",
      render: (product) => (
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-10 w-10 ${product.is_active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'} rounded-lg flex items-center justify-center`}>
            <Package size={20} />
          </div>
          <div className="ml-4">
            <div className={`text-sm font-medium ${product.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
              {product.name}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Tag size={10} /> #{product.id}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Descripción",
      render: (product) => (
        <div className="text-sm text-gray-500 max-w-xs truncate" title={product.description}>
          {product.description}
        </div>
      ),
    },
    {
      header: "Precio",
      render: (product) => (
        <div className="text-sm font-bold text-gray-900 flex items-center">
          <DollarSign size={14} className="text-gray-400" />
          {parseFloat(product.price).toLocaleString()}
        </div>
      ),
    },
    {
      header: "Stock",
      render: (product) => (
        <div className="flex items-center gap-2">
          <Archive size={14} className="text-gray-400" />
          <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
            {product.stock}
          </span>
        </div>
      ),
    },
    {
      header: "Estado",
      render: (product) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {product.is_active ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (product) => (
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => handleOpenModal(product)}
            className="text-blue-600 hover:text-blue-900 font-medium text-sm"
          >
            Editar
          </button>
          <button 
            onClick={() => handleToggleStatus(product)}
            className={`${product.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'} font-medium text-sm flex items-center gap-1`}
          >
            {product.is_active ? (
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
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="mt-2 text-sm text-gray-700">Catálogo detallado de productos disponibles para envío.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="No hay productos registrados."
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
        title={selectedEntity ? "Editar Producto" : "Nuevo Producto"}
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

