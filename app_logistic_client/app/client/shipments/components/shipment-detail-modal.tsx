import React, { useState } from 'react';
import { X, Package, Truck, Ship, Calendar, Tag, User, MapPin, DollarSign, Save, Loader2 } from 'lucide-react';
import { Shipment } from '@/types/shipment';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Props {
  shipment: Shipment | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: () => void;
}

const ShipmentDetailModal = ({ shipment, isOpen, onClose, onStatusUpdate }: Props) => {
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<string>(shipment?.status || '');

  React.useEffect(() => {
    if (shipment) setNewStatus(shipment.status);
  }, [shipment]);

  if (!isOpen || !shipment) return null;

  const handleUpdateStatus = async () => {
    if (newStatus === shipment.status) return;
    setLoading(true);
    try {
      await api.patch(`/logistics/shipments/${shipment.id}/`, {
        status: newStatus
      });
      toast.success("Estado actualizado correctamente");
      onStatusUpdate?.();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el estado");
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'IN_TRANSIT': 'bg-blue-100 text-blue-800',
    'DELIVERED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Guía: {shipment.tracking_number}</h3>
              <p className="text-sm text-gray-500">Información detallada del envío</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info Section */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400"><User size={18} /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Cliente</p>
                  <p className="text-sm font-semibold text-gray-900">{shipment.client_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400"><Package size={18} /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Producto</p>
                  <p className="text-sm font-semibold text-gray-900">{shipment.product_name}</p>
                  <p className="text-xs text-gray-500">{shipment.product_quantity} unidades registradas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400"><Tag size={18} /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Gestionar Estado</p>
                  <div className="flex items-center gap-2">
                    <select 
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className={`text-xs font-bold rounded-lg px-2 py-1 border-none focus:ring-2 focus:ring-blue-200 cursor-pointer ${statusColors[newStatus] || 'bg-gray-100'}`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_TRANSIT">IN_TRANSIT</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    {newStatus !== shipment.status && (
                      <button 
                        onClick={handleUpdateStatus}
                        disabled={loading}
                        className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                        title="Guardar nuevo estado"
                      >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transport Section */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400">
                  {shipment.shipping_type === 'Terrestre' ? <Truck size={18} /> : <Ship size={18} />}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Transporte ({shipment.shipping_type})</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {shipment.vehicle_plate ? `Placa: ${shipment.vehicle_plate}` : `Flota: ${shipment.fleet_number}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400"><MapPin size={18} /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Destino</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {shipment.delivery_warehouse_name || shipment.delivery_port_name || 'No especificado'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-1.5 bg-gray-50 rounded-lg text-gray-400"><Calendar size={18} /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Cronología</p>
                  <div className="space-y-1">
                    <p className="text-[11px] text-gray-500 flex justify-between gap-4">
                      <span>Registro:</span> 
                      <span className="font-medium text-gray-700">{shipment.registration_date ? new Date(shipment.registration_date).toLocaleDateString() : '---'}</span>
                    </p>
                    <p className="text-[11px] text-gray-500 flex justify-between gap-4">
                      <span>Entrega:</span> 
                      <span className="font-medium text-gray-700">{shipment.delivery_date ? new Date(shipment.delivery_date).toLocaleDateString() : 'Pendiente'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Price */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-end">
             <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Precio Final del Envío</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-400 font-medium text-lg">$</span>
                  <span className="text-3xl font-black text-gray-900 tracking-tight">
                    {parseFloat(shipment.shipping_price).toLocaleString()}
                  </span>
                </div>
             </div>
             {parseFloat(shipment.discount_percentage) > 0 && (
               <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold ring-1 ring-green-100">
                    <Tag size={12} />
                    {(parseFloat(shipment.discount_percentage) * 100).toFixed(0)}% DESCUENTO APLICADO
                  </span>
               </div>
             )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailModal;