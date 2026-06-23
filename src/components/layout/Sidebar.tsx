'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Container,
  FileText,
  MapPin,
  Users,
  ShieldCheck,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/exportaciones', label: 'Exportaciones', icon: Package },
  { href: '/dashboard/contenedores', label: 'Contenedores', icon: Container },
  { href: '/dashboard/documentacion', label: 'Documentación', icon: FileText },
  { href: '/dashboard/tracking', label: 'Tracking', icon: MapPin },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { href: '/dashboard/reportes', label: 'Reportes', icon: BarChart3 },
  { href: '/dashboard/alertas', label: 'Alertas', icon: Bell, badge: 4 },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (val: boolean) => void }) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user?.rol === 'ADMIN') setIsAdmin(true);
      })
      .catch(() => {});
  }, []);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      onClick={() => setCollapsed(!collapsed)}
      className={`fixed left-0 top-0 h-full bg-sidebar z-40 flex flex-col transition-all duration-300 ease-in-out cursor-pointer ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div 
        className={`flex items-center h-20 px-5 border-b border-white/5 hover:bg-white/5 transition-colors ${collapsed ? 'justify-center' : 'gap-3'}`}
      >
        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 bg-nexo-500/20 flex items-center justify-center">
          <Image src="/icon.png" alt="NexoExport" width={36} height={36} className="object-cover" />
        </div>
        {!collapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="text-white font-extrabold text-[15px] tracking-tight leading-tight">
              Nexo<span className="text-nexo-400">Export</span>
            </span>
            <span className="text-xs font-medium text-white/30 uppercase tracking-[0.15em] leading-tight">
              Gestión de Exportaciones
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto sidebar-scroll">
        {NAV_ITEMS.map((item) => {
          if (item.label === 'Clientes' && isAdmin) {
            // Renderizamos Usuarios antes o después de Clientes
            return (
              <React.Fragment key="admin-group">
                <Link
                  href={item.href}
                  onClick={(e) => e.stopPropagation()}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative cursor-pointer ${
                    isActive(item.href) ? 'bg-nexo-500 text-white shadow-lg shadow-nexo-500/25' : 'text-white/50 hover:text-white hover:bg-sidebar-hover'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive(item.href) ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
                
                <Link
                  href="/dashboard/usuarios"
                  onClick={(e) => e.stopPropagation()}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative cursor-pointer ${
                    isActive('/dashboard/usuarios') ? 'bg-nexo-500 text-white shadow-lg shadow-nexo-500/25' : 'text-white/50 hover:text-white hover:bg-sidebar-hover'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? 'Usuarios' : undefined}
                >
                  <ShieldCheck className={`w-[18px] h-[18px] flex-shrink-0 ${isActive('/dashboard/usuarios') ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`} />
                  {!collapsed && <span>Usuarios</span>}
                </Link>
              </React.Fragment>
            );
          }

          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => e.stopPropagation()}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative cursor-pointer ${
                active
                  ? 'bg-nexo-500 text-white shadow-lg shadow-nexo-500/25'
                  : 'text-white/50 hover:text-white hover:bg-sidebar-hover'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`} />
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto text-xs font-bold rounded-full px-2 py-0.5 ${
                      active ? 'bg-white/20 text-white' : 'bg-nexo-500/20 text-nexo-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {/* Footer removed per user request */}
    </aside>
  );
}
