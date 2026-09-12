import { ReactNode } from 'react';

export type Nullable<T> = T | null;

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  badge?: string | number;
  badgeColor?: 'orange' | 'emerald' | 'blue' | 'rose';
  children?: MenuItem[];
  section?: string;
}

export interface NavigationSection {
  title?: string;
  items: MenuItem[];
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}
