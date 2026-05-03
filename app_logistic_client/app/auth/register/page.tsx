"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { RegisterCredentials } from "@/types/auth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    document_number: "",
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success("¡Registro exitoso! Por favor inicia sesión.");
      router.push("/login");
    } catch (error) {
      toast.error("Error al registrar el usuario. Revisa los datos.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombres</label>
            <input 
              name="first_name" type="text" required value={formData.first_name} onChange={handleChange}
              className="mt-1 block w-full bg-white text-black rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input 
              name="last_name" type="text" required value={formData.last_name} onChange={handleChange}
              className="mt-1 block w-full bg-white text-black rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Documento</label>
            <input 
              name="document_number" type="text" required value={formData.document_number} onChange={handleChange}
              className="mt-1 block w-full bg-white text-black rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            name="email" type="email" required value={formData.email} onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input 
            name="password" type="password" required value={formData.password} onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Registrarse"}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">¿Ya tienes cuenta? </span>
        <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}
