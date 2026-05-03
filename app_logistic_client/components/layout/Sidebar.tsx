"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, Users, Package, Anchor, Warehouse } from "lucide-react";

const navigation = [
  { name: "Envíos", href: "/client/shipments", icon: Truck },
  { name: "Clientes", href: "/client/clients", icon: Users },
  { name: "Productos", href: "/client/products", icon: Package },
  { name: "Puertos", href: "/client/seaports", icon: Anchor },
  { name: "Bodegas", href: "/client/warehouses", icon: Warehouse },
];


export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">Cliente Logístico</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`flex-shrink-0 w-5 h-5 mr-3 ${
                    isActive ? "text-blue-700" : "text-gray-400"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
