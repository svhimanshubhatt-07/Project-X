import React from 'react';
import { FilterBar } from '../../../../shared/components/dashboard/FilterBar';
import { Select } from '../../../../shared/components/ui/Select';

export interface CompanyFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  industryFilter: string;
  onIndustryChange: (industry: string) => void;
  onReset: () => void;
  activeCount: number;
}

export const CompanyFilters: React.FC<CompanyFiltersProps> = ({
  statusFilter,
  onStatusChange,
  industryFilter,
  onIndustryChange,
  onReset,
  activeCount,
}) => {
  return (
    <FilterBar onReset={onReset} activeFiltersCount={activeCount}>
      <div className="w-48">
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { label: 'All Company Statuses', value: 'ALL' },
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'Suspended', value: 'SUSPENDED' },
            { label: 'Inactive', value: 'INACTIVE' },
          ]}
        />
      </div>

      <div className="w-52">
        <Select
          value={industryFilter}
          onChange={(e) => onIndustryChange(e.target.value)}
          options={[
            { label: 'All Industries', value: 'ALL' },
            { label: 'Robotics & AI', value: 'Robotics & AI' },
            { label: 'Cloud Infrastructure', value: 'Cloud Infrastructure' },
            { label: 'Semiconductors & Hardware', value: 'Semiconductors & Hardware' },
            { label: 'CleanTech & Energy', value: 'CleanTech & Energy' },
            { label: 'Logistics & Supply Chain', value: 'Logistics & Supply Chain' },
          ]}
        />
      </div>
    </FilterBar>
  );
};
