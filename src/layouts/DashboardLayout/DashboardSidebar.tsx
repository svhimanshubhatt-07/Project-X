import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuItem } from '../../shared/types/common.types';
import {
  Home,
  LayoutDashboard,
  FileCheck2,
  Building2,
  Building,
  Compass,
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Shield,
  Calendar,
  FileText,
  Settings,
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

export interface DashboardSidebarProps {
  items: MenuItem[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  items,
  isCollapsed,
  onToggleCollapse,
  className,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  // State to track expanded parent groups (defaults all open as in screenshot)
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

  // Ensure active child's parent is expanded on route change
  useEffect(() => {
    items.forEach((item) => {
      if (
        item.children &&
        item.children.some((child) => {
          const [targetBase] = child.path.split('?');
          return location.pathname === targetBase || (targetBase !== '/' && location.pathname.startsWith(`${targetBase}/`));
        })
      ) {
        setExpandedIds((prev) => ({ ...prev, [item.id]: true }));
      }
    });
  }, [location.pathname, location.search, items]);

  const toggleGroup = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-bg-sidebar text-content-primary border-r border-border-divider transition-all duration-300 select-none shadow-2xl',
        isCollapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-20 px-5 flex items-center justify-between border-b border-border-divider shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo Star / Project X Symbol */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 p-[1.5px] shadow-md shadow-teal-500/20 shrink-0">
            <div className="w-full h-full bg-bg-sidebar rounded-[10px] flex items-center justify-center">
              <span className="text-brand-primary font-extrabold text-base tracking-tighter">✦</span>
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base tracking-wider text-content-primary">
                  Project <span className="text-brand-primary">X</span>
                </span>
              </div>
              <span className="text-[11px] text-content-secondary font-medium tracking-wide">
                Build. Manage. Grow.
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-bg-surfaceHover transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-5 px-3 space-y-1.5">
        {items.map((item) => {
          const hasChildren = Boolean(item.children && item.children.length > 0);
          const isExpanded = Boolean(expandedIds[item.id]);

          // Collapsible Parent Item
          if (hasChildren) {
            const isChildActive = item.children?.some((c) => isPathActive(c.path));

            return (
              <div key={item.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(item.id)}
                  className={clsx(
                    'w-full group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150',
                    isChildActive
                      ? 'text-content-primary font-semibold'
                      : 'text-content-secondary hover:text-content-primary hover:bg-bg-surfaceHover'
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 text-content-secondary group-hover:text-brand-primary transition-colors">
                      {ICON_MAP[item.icon] || <Compass className="w-5 h-5" />}
                    </span>
                    {!isCollapsed && <span className="truncate">{item.title}</span>}
                  </div>

                  {!isCollapsed && (
                    <span className="text-content-secondary group-hover:text-content-primary shrink-0 ml-2">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  )}
                </button>

                {/* Sub-items Tree branch with left vertical line */}
                {!isCollapsed && isExpanded && item.children && (
                  <div className="ml-6 pl-4 border-l border-brand-primary/40 space-y-1 my-1 animate-fadeIn">
                    {item.children.map((child) => {
                      const isSubActive = isPathActive(child.path);

                      return (
                        <NavLink
                          key={child.id}
                          to={child.path}
                          className={clsx(
                            'group flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-all duration-150',
                            isSubActive
                              ? 'text-teal-300 font-semibold bg-brand-primary/15'
                              : 'text-content-secondary hover:text-content-primary hover:translate-x-1 hover:bg-bg-surfaceHover/50'
                          )}
                        >
                          <span className="truncate">{child.title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Standalone Menu Item
          const isActive = isPathActive(item.path);

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={clsx(
                'group flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 relative',
                isActive
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-bold shadow-lg shadow-teal-500/25'
                  : 'text-content-secondary hover:text-content-primary hover:bg-bg-surfaceHover'
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <span className="shrink-0">
                {ICON_MAP[item.icon] || <Compass className="w-5 h-5" />}
              </span>

              {!isCollapsed && <span className="flex-1 truncate">{item.title}</span>}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
