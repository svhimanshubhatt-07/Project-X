import React from 'react';
import { FilterBar } from '../../../../shared/components/dashboard/FilterBar';
import { Select } from '../../../../shared/components/ui/Select';

export interface ApplicationFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  industryFilter: string;
  onIndustryChange: (industry: string) => void;
  onReset: () => void;
  activeCount: number;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
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
            { label: 'All Statuses', value: 'ALL' },
            { label: 'Submitted', value: 'SUBMITTED' },
            { label: 'Under Review', value: 'UNDER_REVIEW' },
            { label: 'Approved', value: 'APPROVED' },
            { label: 'Rejected', value: 'REJECTED' },
          ]}
        />
      </div>

      <div className="w-56">
        <Select
          value={industryFilter}
          onChange={(e) => onIndustryChange(e.target.value)}
          options={[
            { label: 'All Industries', value: 'ALL' },
            { label: 'Robotics & AI', value: 'Robotics & AI' },
            { label: 'Cloud Infrastructure', value: 'Cloud Infrastructure' },
            { label: 'FinTech & DeFi', value: 'FinTech & DeFi' },
            { label: 'Biotechnology', value: 'Biotechnology' },
            { label: 'Logistics & Supply Chain', value: 'Logistics & Supply Chain' },
          ]}
        />
      </div>
    </FilterBar>
  );
};
