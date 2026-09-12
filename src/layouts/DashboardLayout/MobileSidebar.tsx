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
        <div className="h-20 px-5 flex items-center justify-between border-b border-border-divider">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-teal-500 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md shadow-teal-500/20">
              PX
            </div>
            <div>
              <span className="font-heading font-bold text-sm tracking-wider text-content-primary uppercase">
                Project <span className="text-brand-primary">X</span>
              </span>
              <p className="text-xs text-content-secondary font-medium">
                {user?.role === ROLES.ADMIN ? 'Admin Portal' : 'Owner Portal'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-content-secondary hover:text-content-primary">
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
                      'w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all',
                      isChildActive ? 'text-content-primary font-semibold' : 'text-content-secondary hover:text-content-primary hover:bg-bg-surfaceHover'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-content-secondary">{ICON_MAP[item.icon] || <Compass className="w-5 h-5" />}</span>
                      <span>{item.title}</span>
                    </div>
                    <span className="text-content-secondary">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isExpanded && item.children && (
                    <div className="ml-6 pl-4 border-l border-brand-primary/40 space-y-1 my-1">
                      {item.children.map((child) => {
                        const isSubActive = isPathActive(child.path);

                        return (
                          <NavLink
                            key={child.id}
                            to={child.path}
                            onClick={onClose}
                            className={clsx(
                              'flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-all',
                              isSubActive
                                ? 'text-teal-300 font-semibold bg-brand-primary/15'
                                : 'text-content-secondary hover:text-content-primary hover:bg-bg-surfaceHover/30'
                            )}
                          >
                            <span className="truncate">{child.title}</span>
                            {child.badge !== undefined && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/20 text-teal-300 border border-brand-primary/30">
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
                  'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-teal-500/25'
                    : 'text-content-secondary hover:text-content-primary hover:bg-bg-surfaceHover'
                )}
              >
                {ICON_MAP[item.icon] || <Compass className="w-5 h-5" />}
                <span className="flex-1">{item.title}</span>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
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
