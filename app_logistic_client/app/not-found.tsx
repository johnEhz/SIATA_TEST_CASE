"use client";

import Link from "next/link";
import { MoveLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="relative bg-white p-8 rounded-full shadow-2xl ring-1 ring-gray-100">
          <HelpCircle size={80} className="text-blue-600" />
        </div>
      </div>
      
      <h1 className="text-9xl font-black text-gray-200 absolute -z-10 select-none">404</h1>
      
      <div className="space-y-4 max-w-md">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Ruta no encontrada</h2>
        <p className="text-lg text-gray-600 font-medium">
          Lo sentimos, el destino que buscas no existe en nuestra red logística o ha sido movido.
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link
          href="/client/shipments"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 group"
        >
          <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver al Inicio
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
        >
          Página Anterior
        </button>
      </div>
    </div>
  );
}
