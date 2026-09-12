import React from 'react';
import { CompanyRecord } from '../../../../shared/services/mockDataStore';
import { StatusBadge } from '../../../../shared/components/dashboard/StatusBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { Eye, Edit3, MapPin, Calendar, Users, Eye as EyeIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/constants/routes.constants';

export interface CompanyCardProps {
  company: CompanyRecord;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const navigate = useNavigate();

  const name = typeof company.name === 'string' ? company.name : 'Company';
  const headquarters = typeof company.headquarters === 'string' ? company.headquarters : 'India';
  const industry = typeof company.industry === 'string' ? company.industry : 'Technology';
  const companySize = typeof company.companySize === 'string' ? company.companySize : '11-50';
  const representativeName = typeof company.representativeName === 'string' ? company.representativeName : 'Authorized Signatory';
  const profileViews = typeof company.profileViews === 'number' ? company.profileViews : 0;
  const profileCompletion = typeof company.profileCompletion === 'number' ? company.profileCompletion : 100;
  const foundedYear = company.foundedYear || new Date().getFullYear();

  return (
    <div
      onClick={() => navigate(ROUTES.ADMIN.COMPANY_DETAILS(company.id))}
      className="group bg-[var(--bg-table)] border border-[var(--border-table)] hover:border-[var(--brand-primary)]/50 rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] group-hover:border-[var(--brand-primary)]/40 flex items-center justify-center font-bold text-[var(--brand-primary)] text-sm shrink-0 shadow-inner transition-colors">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-100 text-base group-hover:text-emerald-300 transition-colors truncate">
                {name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 truncate flex items-center gap-1.5">
                <span>{headquarters.split(',')[0]}</span>
                <span>•</span>
                <span>Founded {foundedYear}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <StatusBadge status={company.verificationStatus} size="sm" />
          <StatusBadge status={company.listingStatus} size="sm" />
        </div>

        {/* Key Info Chips */}
        <div className="mt-4 space-y-2 bg-[var(--bg-card-inner)]/80 rounded-xl p-3 border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Industry</span>
            <span className="font-semibold text-slate-200 truncate ml-2">{industry}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Company Size</span>
            <span className="font-medium text-slate-300">{companySize}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Representative</span>
            <span className="font-medium text-slate-200 truncate ml-2">{representativeName}</span>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1.5">
            <span className="text-slate-400">Profile Completion</span>
            <span className="text-[var(--brand-primary)] font-bold">{profileCompletion}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-card-inner)] overflow-hidden border border-[var(--border-subtle)]">
            <div
              className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 pt-4 border-t border-[var(--border-divider)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <EyeIcon className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
          <span className="font-mono">{profileViews.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500">views</span>
        </div>

        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(ROUTES.ADMIN.COMPANY_DETAILS(company.id))}
            className="p-1.5 rounded-lg text-[var(--brand-primary)] hover:text-emerald-300 hover:bg-emerald-500/10 border border-transparent hover:border-[var(--brand-primary)]/20 transition-all duration-150 inline-flex items-center justify-center cursor-pointer"
            title="View Company Details"
            aria-label="View Company Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
