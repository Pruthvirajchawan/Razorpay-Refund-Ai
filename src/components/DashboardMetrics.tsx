import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  IndianRupee, 
  Zap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { MetricSummary } from '../types';

interface DashboardMetricsProps {
  metrics: MetricSummary;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
      
      {/* Pending Reviews Card */}
      <div className="bg-white border border-slate-200 border-t-2 border-t-amber-500 p-3.5 rounded-xs flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Queue</span>
          <Clock className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{metrics.pendingCount}</div>
          <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">Awaiting Decision</p>
        </div>
      </div>

      {/* Approved Card */}
      <div className="bg-white border border-slate-200 border-t-2 border-t-emerald-500 p-3.5 rounded-xs flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Approved</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{metrics.approvedTodayCount}</div>
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">
            {metrics.autoApprovalRate}% Auto-Approved
          </p>
        </div>
      </div>

      {/* Escalated Card */}
      <div className="bg-white border border-slate-200 border-t-2 border-t-[#0284C7] p-3.5 rounded-xs flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Escalated</span>
          <AlertTriangle className="w-3.5 h-3.5 text-[#0284C7]" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{metrics.escalatedCount}</div>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">Risk Manager Review</p>
        </div>
      </div>

      {/* Rejected Card */}
      <div className="bg-white border border-slate-200 border-t-2 border-t-rose-500 p-3.5 rounded-xs flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rejected</span>
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{metrics.rejectedCount}</div>
          <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider mt-0.5">Fraud Protected</p>
        </div>
      </div>

      {/* Business Cost Saved Card */}
      <div className="bg-white border border-slate-200 border-t-2 border-t-emerald-600 p-3.5 rounded-xs flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cost Saved</span>
          <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-extrabold text-emerald-600 tracking-tight">
            ₹{metrics.totalMoneySavedINR.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Ops & Discrepancy</p>
        </div>
      </div>

      {/* Avg Decision Speed Card */}
      <div className="bg-white border border-slate-200 border-t-2 border-t-indigo-600 p-3.5 rounded-xs flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg SLA Speed</span>
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {metrics.avgDecisionTimeSeconds}s
          </div>
          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">Gemini 2.5 Real-time</p>
        </div>
      </div>

    </div>
  );
};


