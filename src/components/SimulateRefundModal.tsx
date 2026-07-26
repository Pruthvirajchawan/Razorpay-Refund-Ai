import React, { useState } from 'react';
import { X, Sparkles, User, Package, Crown, Play, CheckCircle } from 'lucide-react';
import { sampleScenarios } from '../data/mockData';
import { CustomerProfile, OrderDetails } from '../types';

interface SimulateRefundModalProps {
  onSimulateSubmit: (customer: CustomerProfile, order: OrderDetails) => void;
  onClose: () => void;
  isEvaluating: boolean;
}

export const SimulateRefundModal: React.FC<SimulateRefundModalProps> = ({
  onSimulateSubmit,
  onClose,
  isEvaluating
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number | null>(0);

  // Custom Form state initialized with scenario 0
  const [custName, setCustName] = useState('Aarav Mehta');
  const [custEmail, setCustEmail] = useState('aarav.mehta@gmail.com');
  const [isVIP, setIsVIP] = useState(true);
  const [totalOrders, setTotalOrders] = useState(18);
  const [ltv, setLtv] = useState(48000);
  const [prevRefunds, setPrevRefunds] = useState(1);
  const [trustScore, setTrustScore] = useState(94);
  const [refundsThisMonth, setRefundsThisMonth] = useState(0);

  const [productName, setProductName] = useState('Noise ColorFit Pulse Smartwatch');
  const [productCategory, setProductCategory] = useState('Electronics');
  const [isDigital, setIsDigital] = useState(false);
  const [amount, setAmount] = useState(1299);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Debit Card' | 'NetBanking' | 'COD'>('UPI');
  const [returnReason, setReturnReason] = useState('Strap latch loose');

  const handleSelectScenario = (index: number) => {
    setSelectedScenarioIndex(index);
    const scene = sampleScenarios[index];
    setCustName(scene.customer.name);
    setCustEmail(scene.customer.email);
    setIsVIP(scene.customer.isVIP);
    setTotalOrders(scene.customer.totalOrders);
    setLtv(scene.customer.lifetimeValue);
    setPrevRefunds(scene.customer.previousRefundsCount);
    setTrustScore(scene.customer.trustScore);
    setRefundsThisMonth(scene.customer.recentRefundsThisMonth);

    setProductName(scene.order.productName);
    setProductCategory(scene.order.productCategory);
    setIsDigital(scene.order.isDigital);
    setAmount(scene.order.amount);
    setPaymentMethod(scene.order.paymentMethod);
    setReturnReason(scene.order.returnReason);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const customer: CustomerProfile = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: custName,
      email: custEmail,
      phone: '+91 98200 00000',
      isVIP,
      totalOrders,
      lifetimeValue: ltv,
      previousRefundsCount: prevRefunds,
      totalRefundedAmount: prevRefunds * 1000,
      accountAgeMonths: 18,
      trustScore,
      recentRefundsThisMonth: refundsThisMonth,
      sameItemRefundCount: refundsThisMonth > 1 ? 2 : 0
    };

    const order: OrderDetails = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      orderDate: new Date().toISOString(),
      productName,
      productCategory,
      isDigital,
      amount,
      currency: 'INR',
      paymentMethod,
      deliveryStatus: 'DELIVERED',
      deliveredDate: new Date().toISOString(),
      returnReason,
      customerNote: `Simulated refund request for ${productName}`,
      attachedEvidenceCount: 1
    };

    onSimulateSubmit(customer, order);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-sm shadow-xs">
              R
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-white">Simulate AI Refund Analysis</h3>
              <p className="text-[11px] text-slate-400">Trigger live Gemini AI reasoning on custom test scenarios</p>
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
          
          {/* Quick Scenario Selector */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-2">
              Quick Test Scenarios (Preset)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleScenarios.map((scene, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectScenario(idx)}
                  className={`p-3 rounded-sm border text-left cursor-pointer transition-all ${
                    selectedScenarioIndex === idx
                      ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{scene.title}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{scene.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Customer Section */}
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-sm border border-slate-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Customer Profile</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600">Customer Name</label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600">LTV (₹)</label>
                  <input
                    type="number"
                    value={ltv}
                    onChange={(e) => setLtv(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Trust Score (0-100)</label>
                  <input
                    type="number"
                    value={trustScore}
                    onChange={(e) => setTrustScore(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Total Orders</label>
                  <input
                    type="number"
                    value={totalOrders}
                    onChange={(e) => setTotalOrders(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Refunds This Month</label>
                  <input
                    type="number"
                    value={refundsThisMonth}
                    onChange={(e) => setRefundsThisMonth(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  id="sim-vip-toggle"
                  type="checkbox"
                  checked={isVIP}
                  onChange={(e) => setIsVIP(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300"
                />
                <label htmlFor="sim-vip-toggle" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1">
                  <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                  <span>VIP Customer</span>
                </label>
              </div>
            </div>

            {/* Order Section */}
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-sm border border-slate-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                <Package className="w-3.5 h-3.5 text-blue-600" />
                <span>Order Details</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-xs font-bold"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="NetBanking">NetBanking</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600">Return Reason</label>
                <input
                  type="text"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  id="sim-digital-toggle"
                  type="checkbox"
                  checked={isDigital}
                  onChange={(e) => setIsDigital(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300"
                />
                <label htmlFor="sim-digital-toggle" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Digital Good (Software/Course)
                </label>
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 rounded-sm transition-colors"
            >
              Cancel
            </button>
            <button
              id="evaluate-simulated-refund-btn"
              type="submit"
              disabled={isEvaluating}
              className="flex items-center space-x-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-sm shadow-xs transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
              <span>{isEvaluating ? 'Evaluating with Gemini AI...' : 'Evaluate with Gemini AI'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
