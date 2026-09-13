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
    <Card className="h-full bg-[#111827] border border-[#273244] shadow-xl">
      <CardHeader
        title="Recent Companies"
        action={
          <button
            onClick={() => navigate(ROUTES.ADMIN.COMPANIES)}
            className="text-xs font-semibold text-[#22C55E] hover:underline transition-all"
          >
            View All
          </button>
        }
      />
      <CardBody className="p-0 overflow-x-auto">
        <table className="w-full text-left text-xs text-[#F3F4F6]">
          <thead className="text-[11px] font-semibold text-[#9CA3AF] border-b border-[#273244] bg-[#1F2937] select-none">
            <tr>
              <th className="py-3 px-5">Company Name</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Industry</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-5 text-right">Registered On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#273244]">
            {companiesList.map((comp) => (
              <tr
                key={comp.id}
                onClick={() => navigate(ROUTES.ADMIN.COMPANIES)}
                className="hover:bg-[#1F2937] transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-5 font-semibold text-[#F3F4F6] group-hover:text-[#3B82F6] transition-colors truncate">
                  {comp.name}
                </td>
                <td className="py-3.5 px-4 text-[#9CA3AF] truncate">
                  {comp.owner}
                </td>
                <td className="py-3.5 px-4 text-[#667085] truncate">
                  {comp.industry}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      comp.status === 'Active'
                        ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                        : 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                    }`}
                  >
                    {comp.status}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right text-[#9CA3AF] font-mono text-[11px]">
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
