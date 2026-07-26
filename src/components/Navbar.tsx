import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sliders, 
  BarChart3, 
  RefreshCw,
  Sparkles,
  Inbox,
  ChevronDown,
  Building2,
  Zap,
  Layers
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'queue' | 'analytics';
  setActiveTab: (tab: 'queue' | 'analytics') => void;
  onOpenSimulate: () => void;
  onOpenPolicyModal: () => void;
  onRefreshQueue: () => void;
  pendingCount: number;
  isAiConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSimulate,
  onOpenPolicyModal,
  onRefreshQueue,
  pendingCount,
}) => {
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [showMerchantMenu, setShowMerchantMenu] = useState(false);

  return (
    <header className="bg-[#0C1B33] text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      
      {/* Top Razorpay Merchant Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 py-2">
        <div className="flex items-center justify-between text-xs">
          
          {/* Razorpay Branding & Merchant Switcher */}
          <div className="flex items-center space-x-4">
            {/* Razorpay Brand Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#0284C7] rounded-xs flex items-center justify-center font-black text-white text-xs tracking-tighter shadow-xs">
                <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 2L2 19h8l2 3 10-17h-8z" />
                </svg>
              </div>
              <div className="flex items-center space-x-1.5 font-sans">
                <span className="font-extrabold tracking-tight text-white text-sm">Razorpay</span>
                <span className="text-slate-500 font-normal">|</span>
                <span className="text-[#0284C7] font-bold tracking-wider text-xs uppercase">Refund IQ</span>
              </div>
            </div>

            {/* Merchant Account Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowMerchantMenu(!showMerchantMenu)}
                className="flex items-center space-x-2 bg-[#162a4d] hover:bg-[#1f3863] border border-slate-700/70 px-2.5 py-1 rounded-xs text-slate-200 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-[11px]">Acme Retail Pvt Ltd</span>
                <span className="text-[10px] text-slate-400 font-mono">(MID: rzp_live_98a)</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showMerchantMenu && (
                <div className="absolute left-0 mt-1 w-64 bg-[#0C1B33] border border-slate-700 rounded-xs shadow-xl py-1 z-50 text-slate-200">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Merchant MID
                  </div>
                  <button 
                    onClick={() => setShowMerchantMenu(false)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold bg-blue-600/20 text-blue-300 flex items-center justify-between"
                  >
                    <span>Acme Retail Pvt Ltd</span>
                    <span className="text-[10px] font-mono text-blue-400">rzp_live_98a</span>
                  </button>
                  <button 
                    onClick={() => setShowMerchantMenu(false)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-800/80 text-slate-300 flex items-center justify-between"
                  >
                    <span>Acme Global Direct</span>
                    <span className="text-[10px] font-mono text-slate-400">rzp_live_12f</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mode Switcher (Live vs Test) & Support Link */}
          <div className="flex items-center space-x-3">
            
            {/* Live / Test Toggle */}
            <div className="flex items-center space-x-1.5 bg-[#162a4d] border border-slate-700 px-2 py-0.5 rounded-xs">
              <span className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <button
                onClick={() => setIsLiveMode(!isLiveMode)}
                className="text-[10px] font-bold uppercase tracking-wider text-slate-200 hover:text-white transition-colors"
              >
                {isLiveMode ? 'Live Mode' : 'Test Mode'}
              </button>
            </div>

            <span className="text-slate-600 hidden sm:inline">|</span>

            <div className="hidden sm:flex items-center space-x-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Razorpay API v2 Active</span>
            </div>

          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Navigation Links */}
          <nav className="flex space-x-1 text-xs font-bold uppercase tracking-wider">
            <button
              id="tab-queue-btn"
              onClick={() => setActiveTab('queue')}
              className={`h-14 px-3.5 transition-all flex items-center space-x-2 border-b-2 ${
                activeTab === 'queue'
                  ? 'text-white border-[#0284C7] bg-[#162a4d]/50'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
              }`}
            >
              <Inbox className="w-4 h-4 text-blue-400" />
              <span>Refunds Queue</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-xs text-[10px] font-bold bg-amber-500 text-slate-950">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              id="tab-analytics-btn"
              onClick={() => setActiveTab('analytics')}
              className={`h-14 px-3.5 transition-all flex items-center space-x-2 border-b-2 ${
                activeTab === 'analytics'
                  ? 'text-white border-[#0284C7] bg-[#162a4d]/50'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Analytics & Insights</span>
            </button>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center space-x-2">
            <button
              id="open-policy-modal-btn"
              onClick={onOpenPolicyModal}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-200 bg-[#162a4d] hover:bg-[#1f3863] border border-slate-700/80 rounded-xs transition-colors"
              title="Configure Merchant Policy Rules"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Policy Engine</span>
            </button>

            <button
              id="open-simulate-modal-btn"
              onClick={onOpenSimulate}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white bg-[#0284C7] hover:bg-blue-600 rounded-xs shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-100" />
              <span>Simulate AI</span>
            </button>

            <button
              id="refresh-queue-btn"
              onClick={onRefreshQueue}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xs transition-colors border border-slate-700/80"
              title="Reset Queue Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};


