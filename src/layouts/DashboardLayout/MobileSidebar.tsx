import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuItem } from '../../shared/types/common.types';
import {
  X,
  Compass,
  Home,
  LayoutDashboard,
  FileCheck2,
  Building2,
  Building,
  Users,
  Files,
  Bell,
  MailCheck,
  BarChart3,
  History,
  Database,
  Globe,
  Sliders,
  Search,
  LineChart,
  Shield,
  Calendar,
  FileText,
  Settings,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Briefcase,
  List,
  Clock,
  ShieldCheck,
  UserCheck,
  Cpu,
  Tag,
  Send,
  User,
  Lock,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../features/authentication/hooks/useAuth';
import { ROLES } from '../../shared/constants/roles.constants';

const ICON_MAP: Record<string, React.ReactNode> = {
  Home: <Home className="w-5 h-5" />,
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  FileCheck2: <FileCheck2 className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Building: <Building className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Files: <Files className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
  MailCheck: <MailCheck className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  History: <History className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Sliders: <Sliders className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  LineChart: <LineChart className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  LayoutGrid: <LayoutGrid className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  List: <List className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  UserCheck: <UserCheck className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Tag: <Tag className="w-5 h-5" />,
  Send: <Send className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Lock: <Lock className="w-5 h-5" />,
  FileSpreadsheet: <FileSpreadsheet className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
};

export interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, items }) => {
  const { user } = useAuth();
  const location = useLocation();

  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        initial[item.id] = true;
      }
    });
    return initial;
  });

  const isPathActive = (targetPath: string) => {
    const [targetBase, targetQuery] = targetPath.split('?');
    const currentPath = location.pathname;
    const currentSearch = location.search;

    if (targetQuery) {
      return currentPath === targetBase && currentSearch === `?${targetQuery}`;
    } else {
      if (currentPath === targetBase) {
        return !currentSearch || currentSearch === '?role=ALL';
      }
      return targetBase !== '/' && currentPath.startsWith(`${targetBase}/`);
    }
  };

  if (!isOpen) return null;

  const toggleGroup = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 left-0 w-72 bg-bg-sidebar text-content-primary border-r border-border-divider shadow-2xl flex flex-col z-10">
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#273244]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs shadow-sm">
              ✦
            </div>
            <div>
              <span className="font-heading font-bold text-sm tracking-wider text-[#F3F4F6] uppercase">
                Project <span className="text-[#3B82F6]">X</span>
              </span>
              <p className="text-xs text-[#9CA3AF] font-medium">
                {user?.role === ROLES.ADMIN ? 'Admin Portal' : 'Owner Portal'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#F3F4F6]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-1.5">
          {items.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isExpanded = Boolean(expandedIds[item.id]);

            if (hasChildren) {
              const isChildActive = item.children?.some((c) => isPathActive(c.path));

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.id)}
                    className={clsx(
                      'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all',
                      isChildActive ? 'text-[#F3F4F6] font-semibold' : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1F2937]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#9CA3AF]">{ICON_MAP[item.icon] || <Compass className="w-5 h-5" />}</span>
                      <span>{item.title}</span>
                    </div>
                    <span className="text-[#9CA3AF]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isExpanded && item.children && (
                    <div className="ml-6 pl-3 border-l border-[#273244] space-y-1 my-1">
                      {item.children.map((child) => {
                        const isSubActive = isPathActive(child.path);

                        return (
                          <NavLink
                            key={child.id}
                            to={child.path}
                            onClick={onClose}
                            className={clsx(
                              'flex items-center justify-between px-2.5 py-2 rounded-lg text-xs sm:text-sm transition-all',
                              isSubActive
                                ? 'text-[#60A5FA] font-semibold bg-[#172554]'
                                : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1F2937]/50'
                            )}
                          >
                            <span className="truncate">{child.title}</span>
                            {child.badge !== undefined && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#172554] text-[#60A5FA] border border-[#1E3A5F]">
                                {child.badge}
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = isPathActive(item.path);

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-[#2B78F6] to-[#162C58] text-white font-semibold shadow-md shadow-blue-500/20'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1F2937]'
                )}
              >
                {ICON_MAP[item.icon] || <Compass className="w-5 h-5" />}
                <span className="flex-1">{item.title}</span>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#172554] text-[#60A5FA] border border-[#1E3A5F]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
