"use client";

import { useState } from "react";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "textarea" | "checkbox";
  placeholder?: string;
  required?: boolean;
}

interface EntityFormProps {
  fields: FieldConfig[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EntityForm({ fields, initialData, onSubmit, onCancel, isLoading }: EntityFormProps) {
  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev: any) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[100px]"
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={!!formData[field.name]}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Activo</span>
              </div>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            )}

          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}
