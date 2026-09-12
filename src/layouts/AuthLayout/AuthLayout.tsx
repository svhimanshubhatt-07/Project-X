import React, { ReactNode } from 'react';
import { Sparkles, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';

export interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#06131c] text-slate-100 flex flex-col lg:flex-row items-stretch justify-center relative overflow-hidden">
      {/* Ambient background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Left side: Brand Showcase */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 xl:p-16 border-r border-[#17384e] relative z-10 bg-[#071926]">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-500 p-[1.5px] shadow-md shadow-teal-500/20">
            <div className="w-full h-full bg-[#06131c] rounded-[10px] flex items-center justify-center">
              <span className="text-teal-400 font-extrabold text-lg tracking-tighter">PX</span>
            </div>
          </div>
          <span className="font-heading font-extrabold text-xl tracking-wider text-slate-100 uppercase">
            Project <span className="text-teal-400">X</span>
          </span>
        </div>

        {/* Hero Narrative */}
        <div className="max-w-xl my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>The Next Era of Company Discovery & Verification</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-100 font-heading leading-tight tracking-tight">
            Discover smarter, <br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              verify faster.
            </span>
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Project X provides a unified, enterprise-grade ecosystem for company onboarding, multi-tier legal verification, and high-visibility corporate presence.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>End-to-end Onboarding Review & Verification Pipeline</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Verified Company Owner Management Portal</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Real-time Compliance, Audit Logs & Enterprise Control</span>
            </div>
          </div>
        </div>

        {/* Bottom Platform Metrics */}
        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#17384e]">
          <div>
            <div className="text-2xl font-bold font-heading text-slate-100">10k+</div>
            <div className="text-xs text-slate-400 mt-0.5">Verified Companies</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading text-slate-100">500k+</div>
            <div className="text-xs text-slate-400 mt-0.5">Monthly Views</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading text-slate-100">99.9%</div>
            <div className="text-xs text-slate-400 mt-0.5">Audit Integrity</div>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};
