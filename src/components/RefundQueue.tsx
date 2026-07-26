import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Clock, 
  ChevronRight, 
  Crown,
  FileText,
  ArrowUpDown,
  Filter,
  Download,
  CheckSquare,
  Square,
  Play,
  Pause,
  Zap
} from 'lucide-react';
import { RefundRequest, RefundStatus, DecisionType } from '../types';

interface RefundQueueProps {
  refunds: RefundRequest[];
  onSelectRefund: (refund: RefundRequest) => void;
  onQuickAction: (refundId: string, action: DecisionType) => void;
  onBulkAction?: (refundIds: string[], action: DecisionType) => void;
  autoIngestSecondsLeft?: number;
  isAutoIngestActive?: boolean;
  onToggleAutoIngest?: () => void;
  onTriggerIngestNow?: () => void;
}

export const RefundQueue: React.FC<RefundQueueProps> = ({
  refunds,
  onSelectRefund,
  onQuickAction,
  onBulkAction,
  autoIngestSecondsLeft = 300,
  isAutoIngestActive = true,
  onToggleAutoIngest,
  onTriggerIngestNow
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_desc' | 'amount_asc' | 'confidence_desc' | 'trust_asc'>('newest');
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtered dataset
  const filteredRefunds = useMemo(() => {
    return refunds.filter((item) => {
      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }
      // Priority filter
      if (priorityFilter !== 'ALL' && item.priority !== priorityFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'ALL' && item.order.productCategory !== categoryFilter) {
        return false;
      }
      // Search term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchesName = item.customer.name.toLowerCase().includes(term);
        const matchesEmail = item.customer.email.toLowerCase().includes(term);
        const matchesOrder = item.order.id.toLowerCase().includes(term);
        const matchesProduct = item.order.productName.toLowerCase().includes(term);
        const matchesReason = item.order.returnReason.toLowerCase().includes(term);
        const matchesId = item.id.toLowerCase().includes(term);
        return matchesName || matchesEmail || matchesOrder || matchesProduct || matchesReason || matchesId;
      }
      return true;
    });
  }, [refunds, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  // Sorted list
  const sortedAndFiltered = useMemo(() => {
    const list = [...filteredRefunds];
    switch (sortBy) {
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'amount_desc':
        return list.sort((a, b) => b.order.amount - a.order.amount);
      case 'amount_asc':
        return list.sort((a, b) => a.order.amount - b.order.amount);
      case 'confidence_desc':
        return list.sort((a, b) => b.aiDecision.confidence - a.aiDecision.confidence);
      case 'trust_asc':
        return list.sort((a, b) => a.customer.trustScore - b.customer.trustScore);
      default:
        return list;
    }
  }, [filteredRefunds, sortBy]);

  // Categories list for dropdown filter
  const availableCategories = useMemo(() => {
    const categories = new Set(refunds.map(r => r.order.productCategory));
    return Array.from(categories);
  }, [refunds]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['Refund ID', 'Customer Name', 'Email', 'Order ID', 'Product', 'Category', 'Amount (INR)', 'Status', 'AI Action', 'Confidence (%)', 'Created At'];
    const rows = sortedAndFiltered.map(r => [
      r.id,
      `"${r.customer.name}"`,
      r.customer.email,
      r.order.id,
      `"${r.order.productName}"`,
      r.order.productCategory,
      r.order.amount,
      r.status,
      r.aiDecision.action,
      r.aiDecision.confidence,
      r.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `refund_queue_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === sortedAndFiltered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedAndFiltered.map(r => r.id));
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleApplyBulk = (action: DecisionType) => {
    if (onBulkAction && selectedIds.length > 0) {
      onBulkAction(selectedIds, action);
      setSelectedIds([]);
    }
  };

  const getActionBadge = (action: DecisionType) => {
    switch (action) {
      case 'APPROVE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Approve
          </span>
        );
      case 'REQUEST_INFO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <HelpCircle className="w-3 h-3 mr-1 text-amber-600" />
            More Info
          </span>
        );
      case 'ESCALATE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            <AlertTriangle className="w-3 h-3 mr-1 text-blue-600" />
            Escalate
          </span>
        );
      case 'REJECT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 mr-1 text-rose-600" />
            Reject
          </span>
        );
    }
  };

  const getStatusBadge = (status: RefundStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'REQUESTED_INFO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            Requested Info
          </span>
        );
      case 'ESCALATED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            Escalated
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
            Rejected
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-rose-50 text-rose-700 border border-rose-200">URGENT</span>;
      case 'HIGH':
        return <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-amber-50 text-amber-700 border border-amber-200">HIGH</span>;
      default:
        return <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-sm">NORMAL</span>;
    }
  };

  return (
    <div className="bg-white rounded-sm border border-slate-200 shadow-xs overflow-hidden">
      
      {/* 5-Minute Auto-Ingestion Live Banner */}
      <div className="px-4 py-2.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-800 px-2.5 py-1 rounded-sm border border-slate-700">
            <span className={`w-2 h-2 rounded-full ${isAutoIngestActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-200">
              5-Min Auto-Ingestion: {isAutoIngestActive ? 'ACTIVE' : 'PAUSED'}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Next incoming request in: <strong className="text-white">{formatTime(autoIngestSecondsLeft)}</strong></span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onToggleAutoIngest && (
            <button
              onClick={onToggleAutoIngest}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-sm text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors"
            >
              {isAutoIngestActive ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isAutoIngestActive ? 'Pause' : 'Resume'}</span>
            </button>
          )}

          {onTriggerIngestNow && (
            <button
              id="trigger-ingest-now-btn"
              onClick={onTriggerIngestNow}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 shadow-xs transition-colors"
              title="Immediately add a new live refund request into queue"
            >
              <Zap className="w-3 h-3 text-blue-200" />
              <span>+ Ingest Request Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Header Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-refunds-input"
              type="text"
              placeholder="Search customer, email, order ID, product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-sm text-xs placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-all font-medium"
            />
          </div>

          {/* Quick Filter Selects */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            {/* Category Filter */}
            <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-sm px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Category:</span>
              <select
                id="filter-category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-slate-700 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-sm px-2.5 py-1.5">
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Priority:</span>
              <select
                id="filter-priority-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent text-slate-700 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-sm px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Sort:</span>
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-700 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_desc">Amount: High to Low</option>
                <option value="amount_asc">Amount: Low to High</option>
                <option value="confidence_desc">Confidence: High to Low</option>
                <option value="trust_asc">Risk: Low Trust First</option>
              </select>
            </div>

            {/* CSV Export Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
              title="Export filtered records to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

          </div>

        </div>

        {/* Status Filter Tabs & Selection Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs border-t border-slate-200 pt-2.5">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'All Requests', count: refunds.length },
              { id: 'PENDING', label: 'Pending Review', count: refunds.filter(r => r.status === 'PENDING').length },
              { id: 'APPROVED', label: 'Approved', count: refunds.filter(r => r.status === 'APPROVED').length },
              { id: 'ESCALATED', label: 'Escalated', count: refunds.filter(r => r.status === 'ESCALATED').length },
              { id: 'REQUESTED_INFO', label: 'Needs Info', count: refunds.filter(r => r.status === 'REQUESTED_INFO').length },
              { id: 'REJECTED', label: 'Rejected', count: refunds.filter(r => r.status === 'REJECTED').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-sm text-[10px] font-bold ${
                  statusFilter === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Select All Toggle */}
          {sortedAndFiltered.length > 0 && (
            <button
              onClick={handleToggleSelectAll}
              className="text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 flex items-center space-x-1 transition-colors"
            >
              {selectedIds.length === sortedAndFiltered.length ? (
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{selectedIds.length === sortedAndFiltered.length ? 'Deselect All' : 'Select All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-slate-800">
          <span className="font-bold uppercase tracking-wider text-slate-300">
            {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleApplyBulk('APPROVE')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-[10px] tracking-wider rounded-sm transition-colors"
            >
              Bulk Approve
            </button>
            <button
              onClick={() => handleApplyBulk('ESCALATE')}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-[10px] tracking-wider rounded-sm transition-colors"
            >
              Bulk Escalate
            </button>
            <button
              onClick={() => handleApplyBulk('REJECT')}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase text-[10px] tracking-wider rounded-sm transition-colors"
            >
              Bulk Reject
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-slate-400 hover:text-white text-[10px] uppercase font-bold transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Gmail-Style Table / Card List */}
      <div className="divide-y divide-slate-100">
        {sortedAndFiltered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-medium text-slate-700">No refund requests matched your query</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or search terms</p>
          </div>
        ) : (
          sortedAndFiltered.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onSelectRefund(item)}
                className={`p-4 hover:bg-slate-50/80 cursor-pointer transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isSelected ? 'bg-blue-50/60' : ''
                }`}
              >
                {/* Customer & Order Info */}
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  
                  {/* Select Checkbox & Avatar */}
                  <div className="flex items-center space-x-2 shrink-0 mt-0.5">
                    <button
                      onClick={(e) => handleToggleSelect(item.id, e)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Select request"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>

                    {item.customer.isVIP ? (
                      <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center" title="VIP Customer">
                        <Crown className="w-5 h-5 fill-amber-400 text-amber-600" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                        {item.customer.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info Text */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {item.customer.name}
                      </span>
                      {item.customer.isVIP && (
                        <span className="px-1.5 py-0.2 rounded-sm text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-300">
                          VIP
                        </span>
                      )}
                      {getPriorityBadge(item.priority)}
                      <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                        {item.id}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mt-0.5 truncate flex items-center space-x-2">
                      <span className="font-medium text-slate-800">{item.order.productName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{item.order.productCategory}</span>
                    </div>

                    <p className="text-xs text-slate-500 italic mt-1 line-clamp-1">
                      "{item.order.returnReason}"
                    </p>
                  </div>
                </div>

                {/* Amount, AI Recommendation & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end space-x-4 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 shrink-0">
                  
                  {/* Amount */}
                  <div className="text-left md:text-right">
                    <div className="font-bold text-sm text-slate-900">
                      ₹{item.order.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      via {item.order.paymentMethod}
                    </div>
                  </div>

                  {/* AI Recommendation Badge */}
                  <div className="text-center min-w-[110px]">
                    <div className="mb-0.5">
                      {getActionBadge(item.aiDecision.action)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      AI Confidence: <span className="text-slate-800 font-bold">{item.aiDecision.confidence}%</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="hidden sm:block">
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Quick Process Action Buttons */}
                  {item.status === 'PENDING' ? (
                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onQuickAction(item.id, 'APPROVE')}
                        className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-sm transition-colors"
                        title="Approve Refund"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onQuickAction(item.id, 'ESCALATE')}
                        className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-sm transition-colors"
                        title="Escalate to Manager"
                      >
                        Escalate
                      </button>
                    </div>
                  ) : (
                    <div className="text-slate-400">
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
