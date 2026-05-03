"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { LoginCredentials } from "@/types/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const { refreshUser } = useUser();
  const [formData, setFormData] = useState<LoginCredentials>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      await refreshUser();
      toast.success("Bienvenido de nuevo!");
    } catch (error) {
      toast.error("Credenciales inválidas. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="text-gray-900 bg-white mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="admin@admin.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input 
            type="password" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="text-gray-900 bg-white mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Ingresar"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
        <Link href="/auth/register" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}
