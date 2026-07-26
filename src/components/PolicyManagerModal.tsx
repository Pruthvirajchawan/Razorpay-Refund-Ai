import React, { useState } from 'react';
import { X, Sliders, Save, RotateCcw, Check, Shield, Info } from 'lucide-react';
import { MerchantPolicy } from '../types';

interface PolicyManagerModalProps {
  policy: MerchantPolicy;
  onSavePolicy: (updatedPolicy: MerchantPolicy) => void;
  onClose: () => void;
}

export const PolicyManagerModal: React.FC<PolicyManagerModalProps> = ({
  policy,
  onSavePolicy,
  onClose
}) => {
  const [formData, setFormData] = useState<MerchantPolicy>({ ...policy });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof MerchantPolicy, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePolicy(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-sm shadow-xs">
              R
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-white">Policy Engine Rules</h3>
              <p className="text-[11px] text-slate-400">Configure parameters evaluated by Refund IQ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Instant Refund Threshold */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Instant Auto-Approve Limit (₹)
              </label>
              <input
                id="policy-instant-limit-input"
                type="number"
                value={formData.instantRefundLimit}
                onChange={(e) => handleChange('instantRefundLimit', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs font-bold focus:border-blue-600 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">Refunds below auto-approve for low-risk users</p>
            </div>

            {/* Manager Escalation Limit */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Manager Escalation Limit (₹)
              </label>
              <input
                id="policy-manager-limit-input"
                type="number"
                value={formData.managerEscalationLimit}
                onChange={(e) => handleChange('managerEscalationLimit', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs font-bold focus:border-blue-600 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">Refunds above require manager sign-off</p>
            </div>

            {/* Max Monthly Refunds */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Max Monthly Refunds Per Customer
              </label>
              <input
                id="policy-monthly-cap-input"
                type="number"
                value={formData.maxMonthlyRefundsAllowed}
                onChange={(e) => handleChange('maxMonthlyRefundsAllowed', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs font-bold focus:border-blue-600 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">Monthly frequency cap per account</p>
            </div>

            {/* Investigation Cost Benchmark */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Investigation Cost Benchmark (₹)
              </label>
              <input
                id="policy-investigation-cost-input"
                type="number"
                value={formData.investigationCostThreshold}
                onChange={(e) => handleChange('investigationCostThreshold', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs font-bold focus:border-blue-600 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">Support agent & logistics cost benchmark</p>
            </div>

          </div>

          {/* Toggle Switches */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            
            <div className="flex items-center justify-between p-3 rounded-sm bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 block">VIP Fast-Track Instant Approval</span>
                <span className="text-[10px] text-slate-500">Auto-approve requests for VIP customers regardless of standard limit</span>
              </div>
              <input
                id="policy-vip-fasttrack-toggle"
                type="checkbox"
                checked={formData.vipInstantApproval}
                onChange={(e) => handleChange('vipInstantApproval', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-sm bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 block">Allow Digital Goods Refunds</span>
                <span className="text-[10px] text-slate-500">Enable refunds for courses, downloads, or SaaS subscriptions</span>
              </div>
              <input
                id="policy-digital-goods-toggle"
                type="checkbox"
                checked={formData.digitalProductsRefundable}
                onChange={(e) => handleChange('digitalProductsRefundable', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-sm transition-colors"
            >
              Cancel
            </button>
            
            <button
              id="save-policy-btn"
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-sm shadow-xs transition-colors"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved Policy Rules!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Policy Rules</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
