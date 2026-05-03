"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/context/UserContext";
import { LogOut, User as UserIcon, Loader2 } from "lucide-react";

export default function Header() {
  const { logout } = useAuth();
  const { user, loading } = useUser();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Panel de Logística</h2>
        <div className="h-6 w-px bg-gray-200" />
        <p className="text-sm text-gray-500 font-medium">Gestión Operativa</p>
      </div>

      <div className="flex items-center gap-6">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-medium">Cargando perfil...</span>
          </div>
        ) : user ? (
          <div className="flex items-center gap-3 pr-4 border-r border-gray-200">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900">{user.first_name} {user.last_name}</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{user.email}</span>
            </div>
            <div className="p-2 bg-blue-50 rounded-full text-blue-600 ring-2 ring-blue-100">
              <UserIcon size={20} />
            </div>
          </div>
        ) : null}

        <button
          onClick={logout}
          className="flex items-center px-4 py-2 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-all group"
        >
          <LogOut className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}

