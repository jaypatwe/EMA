import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Bell, Menu, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Active Claims', path: '/claims' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className={cn(
      "bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-50 shadow-sm",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        {!collapsed && (
          <h1 className="text-xl font-bold text-[#111111] flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#003399] text-white flex items-center justify-center text-xs">C</div>
            Claims Agent
          </h1>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 text-[#6c757d] hover:text-[#111111]">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive ? "bg-[#003399]/10 text-[#003399] font-medium" : "text-[#6c757d] hover:bg-slate-50 hover:text-[#111111]"
              )}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <User className="w-4 h-4 text-[#6c757d]" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111111] truncate">Sarah Jenkins</p>
              <p className="text-xs text-[#6c757d] truncate">Senior Adjuster</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

