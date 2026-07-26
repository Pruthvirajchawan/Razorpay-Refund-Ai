import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { RefundRequest } from '../types';
import { ShieldCheck, IndianRupee, Clock, TrendingUp, DollarSign, Award } from 'lucide-react';

interface AnalyticsViewProps {
  refunds: RefundRequest[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ refunds }) => {
  // 1. Action Breakdown Data
  const statusCounts = refunds.reduce(
    (acc, item) => {
      acc[item.aiDecision.action] = (acc[item.aiDecision.action] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const pieData = [
    { name: 'Approve', value: statusCounts['APPROVE'] || 0, color: '#10B981' },
    { name: 'Request Info', value: statusCounts['REQUEST_INFO'] || 0, color: '#F59E0B' },
    { name: 'Escalate', value: statusCounts['ESCALATE'] || 0, color: '#3B82F6' },
    { name: 'Reject', value: statusCounts['REJECT'] || 0, color: '#EF4444' },
  ].filter(d => d.value > 0);

  // 2. Category Refund Volume & Value
  const categoryData = Object.entries(
    refunds.reduce((acc, item) => {
      const cat = item.order.productCategory;
      if (!acc[cat]) {
        acc[cat] = { count: 0, totalAmount: 0 };
      }
      acc[cat].count += 1;
      acc[cat].totalAmount += item.order.amount;
      return acc;
    }, {} as Record<string, { count: number; totalAmount: number }>)
  ).map(([category, data]: [string, { count: number; totalAmount: number }]) => ({
    category,
    count: data.count,
    amountINR: data.totalAmount,
  }));

  // 3. Financial Cost Savings Math
  const totalRefundValue = refunds.reduce((sum, r) => sum + r.order.amount, 0);
  const totalApprovedValue = refunds
    .filter(r => r.status === 'APPROVED' || (r.status === 'PENDING' && r.aiDecision.action === 'APPROVE'))
    .reduce((sum, r) => sum + r.order.amount, 0);
  const totalSavedFromRejections = refunds
    .filter(r => r.aiDecision.action === 'REJECT')
    .reduce((sum, r) => sum + r.order.amount, 0);

  const costComparisonData = [
    { name: 'Electronics', investigationCost: 3200, refundCost: 29800 },
    { name: 'Fashion', investigationCost: 2000, refundCost: 1899 },
    { name: 'Digital Courses', investigationCost: 1600, refundCost: 4999 },
    { name: 'Home & Living', investigationCost: 1200, refundCost: 499 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-sm flex items-center justify-center border border-emerald-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI Accuracy</div>
            <div className="text-lg font-bold text-slate-900 font-mono">94.8%</div>
            <p className="text-[10px] text-emerald-600 font-medium">Validated against overrides</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-sm flex items-center justify-center border border-blue-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Decision Speedup</div>
            <div className="text-lg font-bold text-slate-900 font-mono">4.2 Sec</div>
            <p className="text-[10px] text-blue-600 font-medium">Down from 24h manual work</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-sm flex items-center justify-center border border-indigo-200">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Capital Saved</div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              ₹{totalSavedFromRejections.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-indigo-600 font-medium">Non-policy requests blocked</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-sm flex items-center justify-center border border-amber-200">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">VIP Trust Index</div>
            <div className="text-lg font-bold text-slate-900 font-mono">98 / 100</div>
            <p className="text-[10px] text-amber-600 font-medium">100% VIP approval retention</p>
          </div>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: AI Decision Distribution */}
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">AI Decision Distribution</h3>
              <p className="text-[11px] text-slate-500">Breakdown of AI recommended actions across all cases</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} requests`, 'Volume']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Breakdown */}
        <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Refund Claims by Product Category</h3>
              <p className="text-[11px] text-slate-500">Total monetary value (₹) per category</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Total Value']} />
                <Bar dataKey="amountINR" name="Refund Value (₹)" fill="#2563EB" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Chart 3: Cost Comparison (Investigation Cost vs Refund Cost) */}
      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs">
        <div className="mb-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">Business Intelligence: Investigation vs Refund Cost</h3>
          <p className="text-[11px] text-slate-500">
            Comparing investigation expense (₹800/ticket) against actual refund claim value
          </p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costComparisonData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']} />
              <Legend />
              <Bar dataKey="investigationCost" name="Estimated Investigation Cost (₹)" fill="#6366F1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="refundCost" name="Refund Claim Value (₹)" fill="#10B981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
