import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Crown, 
  User, 
  Package, 
  ShieldCheck, 
  IndianRupee, 
  BrainCircuit, 
  Clock, 
  History, 
  Send,
  Sparkles,
  DollarSign,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { RefundRequest, DecisionType } from '../types';

interface RefundDetailViewProps {
  refund: RefundRequest;
  onClose: () => void;
  onUpdateStatus: (refundId: string, action: DecisionType, notes?: string) => void;
  onReanalyzeWithAi: (refund: RefundRequest) => void;
  isAnalyzing: boolean;
}

export const RefundDetailView: React.FC<RefundDetailViewProps> = ({
  refund,
  onClose,
  onUpdateStatus,
  onReanalyzeWithAi,
  isAnalyzing
}) => {
  const [overrideNotes, setOverrideNotes] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'decision' | 'timeline' | 'cost'>('decision');

  const { customer, order, aiDecision, status } = refund;

  const handleActionClick = (action: DecisionType) => {
    onUpdateStatus(refund.id, action, overrideNotes);
  };

  const getActionBadge = (action: DecisionType) => {
    switch (action) {
      case 'APPROVE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            APPROVE (Instant Refund)
          </span>
        );
      case 'REQUEST_INFO':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            REQUEST MORE INFORMATION
          </span>
        );
      case 'ESCALATE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-blue-600" />
            ESCALATE TO MANAGER
          </span>
        );
      case 'REJECT':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            REJECT REQUEST
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end transition-opacity overflow-y-auto">
      <div className="bg-white w-full max-w-4xl min-h-screen shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-[#0C1B33] text-white flex items-center justify-between border-b border-slate-800 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-[#0284C7] rounded-xs flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12 2L2 19h8l2 3 10-17h-8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-blue-400">{refund.id}</span>
                <span className="text-[10px] font-mono text-slate-400">| Payment: pay_{refund.order.id.replace('ORD-', '')}</span>
                <span className="text-xs text-slate-400 hidden sm:inline">• {new Date(refund.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider mt-0.5">
                Razorpay Inspector • Refund Intelligence
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onReanalyzeWithAi(refund)}
              disabled={isAnalyzing}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-[#0284C7] hover:bg-blue-600 text-white rounded-xs transition-colors disabled:opacity-50"
              title="Re-run Gemini AI Reasoning Engine"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Re-run Gemini AI'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xs transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Recommendation Banner */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                AI Recommendation Engine Output
              </div>
              <div className="flex items-center space-x-3">
                {getActionBadge(aiDecision.action)}
                <div className="text-sm font-semibold text-blue-300 flex items-center">
                  <span>Confidence:</span>
                  <span className="ml-1 text-base font-bold text-white">{aiDecision.confidence}%</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 mt-2 font-medium leading-relaxed">
                "{aiDecision.summaryReason}"
              </p>
            </div>

            {/* Quick Action Decision Status */}
            <div className="shrink-0 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <div className="text-xs text-slate-400 mb-1">Current Request Status</div>
              <div className="font-bold text-sm text-amber-400">{status}</div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-4 text-sm font-medium">
          <button
            onClick={() => setActiveSubTab('decision')}
            className={`pb-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeSubTab === 'decision'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>AI Reasoning & Rules</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cost')}
            className={`pb-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeSubTab === 'cost'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Business Cost Analysis</span>
          </button>

          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`pb-3 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeSubTab === 'timeline'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Customer History & Audit Trail</span>
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: AI REASONING & RULES */}
          {activeSubTab === 'decision' && (
            <div className="space-y-6">

              {/* Grid Context: Customer vs Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Customer Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-sm text-slate-900">Customer Profile</span>
                    </div>
                    {customer.isVIP && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                        VIP
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Name / Email:</span>
                      <span className="font-semibold text-slate-900">{customer.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Total Lifetime Value (LTV):</span>
                      <span className="font-bold text-emerald-700">₹{customer.lifetimeValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Total Completed Orders:</span>
                      <span className="font-semibold text-slate-900">{customer.totalOrders} orders</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Account Trust Score:</span>
                      <span className="font-bold text-blue-600">{customer.trustScore} / 100</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Refunds History:</span>
                      <span className="font-semibold text-slate-900">{customer.previousRefundsCount} past ({customer.recentRefundsThisMonth} this month)</span>
                    </div>
                  </div>
                </div>

                {/* Order Details Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-sm text-slate-900">Order Context</span>
                    </div>
                    <span className="font-mono text-xs text-slate-500">{order.id}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Product:</span>
                      <span className="font-semibold text-slate-900 text-right">{order.productName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Category / Type:</span>
                      <span className="font-semibold text-slate-900">{order.productCategory} {order.isDigital && '(Digital Good)'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Order Amount:</span>
                      <span className="font-bold text-slate-900 text-sm">₹{order.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Payment Method:</span>
                      <span className="font-medium text-slate-800">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Delivery Status:</span>
                      <span className="font-semibold text-emerald-700">{order.deliveryStatus}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Return Reason Box */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Customer Claim & Stated Reason
                </div>
                <p className="text-sm font-medium text-amber-950">
                  "{order.returnReason}"
                </p>
                {order.customerNote && (
                  <p className="text-xs text-amber-800 mt-1 italic">
                    Note: {order.customerNote}
                  </p>
                )}
              </div>

              {/* Detailed Reasoning Bullets */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-blue-600" />
                  AI Reasoning Factors
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {aiDecision.detailedReasoning.map((reason, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Merchant Policy Rules Checklist */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Merchant Policy Compliance Checklist
                </h3>
                <div className="space-y-2">
                  {aiDecision.policyCheckResults.map((rule, idx) => (
                    <div key={idx} className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs">
                      <div className="flex items-start space-x-2.5">
                        {rule.status === 'PASSED' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : rule.status === 'FLAGGED' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        ) : (
                          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900">{rule.ruleName}: </span>
                          <span className="text-slate-600">{rule.description}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rule.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' :
                        rule.status === 'FLAGGED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rule.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Impact Summary */}
              <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl">
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Business Impact Analysis
                </div>
                <p className="text-xs text-blue-950 font-medium leading-relaxed">
                  {aiDecision.businessImpactText}
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: BUSINESS COST ANALYSIS */}
          {activeSubTab === 'cost' && (
            <div className="space-y-6">
              
              {/* Highlight Banner: Cheaper to Refund Callout */}
              {aiDecision.costAnalysis.cheaperToRefund ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">
                      Smart Business Intelligence Decision
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                      Refunding is cheaper than manual investigation! Approving this refund saves support operational costs while maintaining customer trust.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-300 rounded-xl flex items-center space-x-3">
                  <div className="p-2.5 bg-blue-600 text-white rounded-lg">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950 text-sm">
                      Formal Investigation Justified
                    </h4>
                    <p className="text-xs text-blue-800 mt-0.5 font-medium">
                      Order value justifies manager review or evidence collection before disbursement.
                    </p>
                  </div>
                </div>
              )}

              {/* Cost Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-medium text-slate-500">Refund Claim Cost</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    ₹{aiDecision.costAnalysis.refundCost.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Direct payout value</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-medium text-slate-500">Investigation Cost</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    ₹{aiDecision.costAnalysis.estimatedInvestigationCost.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Support agent & logistics cost</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-medium text-slate-500">Estimated Churn Risk</div>
                  <div className="text-xl font-bold text-rose-700 mt-1">
                    ₹{aiDecision.costAnalysis.customerChurnRiskValue.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Potential lost LTV if churned</p>
                </div>

              </div>

              {/* Rationale Box */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider mb-2">
                  Cost & Loss Prevention Rationale
                </h4>
                <p className="text-sm text-slate-800 font-medium">
                  {aiDecision.costAnalysis.rationale}
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: CUSTOMER HISTORY & AUDIT TRAIL */}
          {activeSubTab === 'timeline' && (
            <div className="space-y-6">
              
              {/* Audit Trail Timeline */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  Decision Audit Trail & Event Log
                </h3>

                <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                  {refund.auditTrail.map((log) => (
                    <div key={log.id} className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
                      
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{log.actorName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-medium mt-0.5">
                        {log.action}
                      </p>

                      {log.notes && (
                        <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 p-2 rounded border border-slate-200">
                          Note: "{log.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Sticky Footer Action Controls */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3 sticky bottom-0 z-10">
          
          {/* Human Override Notes Input */}
          <div className="flex items-center space-x-2">
            <input
              id="human-override-notes-input"
              type="text"
              placeholder="Add optional internal note for audit trail..."
              value={overrideNotes}
              onChange={(e) => setOverrideNotes(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            
            <button
              id="action-approve-btn"
              onClick={() => handleActionClick('APPROVE')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg text-xs font-bold text-white shadow-sm transition-all active:scale-95 ${
                aiDecision.action === 'APPROVE'
                  ? 'bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-600 ring-offset-1'
                  : 'bg-emerald-700 hover:bg-emerald-600'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve</span>
            </button>

            <button
              id="action-request-info-btn"
              onClick={() => handleActionClick('REQUEST_INFO')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all active:scale-95 ${
                aiDecision.action === 'REQUEST_INFO' ? 'ring-2 ring-amber-500 ring-offset-1' : ''
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>Request Info</span>
            </button>

            <button
              id="action-escalate-btn"
              onClick={() => handleActionClick('ESCALATE')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all active:scale-95 ${
                aiDecision.action === 'ESCALATE' ? 'ring-2 ring-blue-600 ring-offset-1' : ''
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Escalate</span>
            </button>

            <button
              id="action-reject-btn"
              onClick={() => handleActionClick('REJECT')}
              className={`flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all active:scale-95 ${
                aiDecision.action === 'REJECT' ? 'ring-2 ring-rose-600 ring-offset-1' : ''
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
