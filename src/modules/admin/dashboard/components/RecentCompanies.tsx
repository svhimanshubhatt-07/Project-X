import React from 'react';
import { Card, CardHeader, CardBody } from '../../../../shared/components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants/routes.constants';

export const RecentCompanies: React.FC = () => {
  const navigate = useNavigate();

  const companiesList = [
    { id: '1', name: 'TechVision Pvt Ltd', owner: 'Rahul Mehta', industry: 'IT Services', status: 'Active', registeredOn: '09 Sep 2026' },
    { id: '2', name: 'GreenLeaf Solutions', owner: 'Priya Sharma', industry: 'Renewable Energy', status: 'Pending', registeredOn: '08 Sep 2026' },
    { id: '3', name: 'NextGen Industries', owner: 'Amit Patel', industry: 'Manufacturing', status: 'Active', registeredOn: '07 Sep 2026' },
    { id: '4', name: 'Bright Future Ltd', owner: 'Sneha Kapoor', industry: 'Education', status: 'Pending', registeredOn: '06 Sep 2026' },
    { id: '5', name: 'Urban Build Co.', owner: 'Vikram Singh', industry: 'Real Estate', status: 'Active', registeredOn: '05 Sep 2026' },
  ];

  return (
    <Card className="h-full bg-[var(--bg-table)] border border-[var(--border-table)] shadow-xl">
      <CardHeader
        title="Recent Companies"
        action={
          <button
            onClick={() => navigate(ROUTES.ADMIN.COMPANIES)}
            className="text-xs font-semibold text-[var(--brand-primary)] hover:opacity-80 transition-opacity"
          >
            View All
          </button>
        }
      />
      <CardBody className="p-0 overflow-x-auto">
        <table className="w-full text-left text-xs text-[var(--text-table-body)]">
          <thead className="text-[11px] font-semibold text-[var(--text-table-header)] border-b border-[var(--border-table-header)] bg-[var(--bg-table-header)] select-none">
            <tr>
              <th className="py-3 px-5">Company Name</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Industry</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-5 text-right">Registered On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-table-row)]">
            {companiesList.map((comp) => (
              <tr
                key={comp.id}
                onClick={() => navigate(ROUTES.ADMIN.COMPANIES)}
                className="hover:bg-[var(--bg-table-row-hover)] transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-5 font-semibold text-[var(--text-table-body)] group-hover:text-[var(--brand-primary)] transition-colors truncate">
                  {comp.name}
                </td>
                <td className="py-3.5 px-4 text-slate-300 truncate">
                  {comp.owner}
                </td>
                <td className="py-3.5 px-4 text-slate-400 truncate">
                  {comp.industry}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      comp.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {comp.status}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right text-slate-400 font-mono text-[11px]">
                  {comp.registeredOn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};
