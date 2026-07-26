export type DecisionType = 'APPROVE' | 'REQUEST_INFO' | 'ESCALATE' | 'REJECT';

export type RefundStatus = 'PENDING' | 'APPROVED' | 'REQUESTED_INFO' | 'ESCALATED' | 'REJECTED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVIP: boolean;
  totalOrders: number;
  lifetimeValue: number; // in INR ₹
  previousRefundsCount: number;
  totalRefundedAmount: number; // in INR ₹
  accountAgeMonths: number;
  trustScore: number; // 0 - 100
  recentRefundsThisMonth: number;
  sameItemRefundCount: number;
  avatarUrl?: string;
}

export interface OrderDetails {
  id: string;
  orderDate: string; // ISO date string
  productName: string;
  productCategory: string; // 'Electronics' | 'Fashion' | 'Digital Course' | 'SaaS Subscription' | 'Home & Living' | 'Beauty'
  isDigital: boolean;
  amount: number; // in INR ₹
  currency: string; // default 'INR'
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'NetBanking' | 'Razorpay Wallet' | 'EMI' | 'COD';
  deliveryStatus: 'DELIVERED' | 'IN_TRANSIT' | 'PROCESSING' | 'CANCELLED';
  deliveredDate?: string;
  returnReason: string;
  customerNote?: string;
  attachedEvidenceCount: number;
}

export interface PolicyRuleResult {
  ruleName: string;
  status: 'PASSED' | 'FLAGGED' | 'MANUAL_REVIEW';
  description: string;
}

export interface BusinessCostAnalysis {
  refundCost: number; // in INR ₹
  estimatedInvestigationCost: number; // in INR ₹
  customerChurnRiskValue: number; // estimated loss if customer leaves (INR)
  costDifference: number; // Investigation Cost - Refund Cost
  cheaperToRefund: boolean;
  rationale: string;
}

export interface AIDecision {
  action: DecisionType;
  actionLabel: string;
  confidence: number; // percentage e.g. 94
  summaryReason: string;
  detailedReasoning: string[];
  businessImpactText: string;
  policyCheckResults: PolicyRuleResult[];
  costAnalysis: BusinessCostAnalysis;
  evaluatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: 'AI_ENGINE' | 'HUMAN_AGENT' | 'SYSTEM_RULE';
  actorName: string;
  action: string;
  notes?: string;
}

export interface RefundRequest {
  id: string;
  customer: CustomerProfile;
  order: OrderDetails;
  aiDecision: AIDecision;
  status: RefundStatus;
  priority: PriorityLevel;
  humanNotes?: string;
  processedBy?: string;
  processedAt?: string;
  auditTrail: AuditLogEntry[];
  createdAt: string;
}

export interface MerchantPolicy {
  instantRefundLimit: number; // e.g. ₹2,000
  managerEscalationLimit: number; // e.g. ₹10,000
  maxMonthlyRefundsAllowed: number; // e.g. 3
  digitalProductsRefundable: boolean;
  vipInstantApproval: boolean;
  investigationCostThreshold: number; // e.g. ₹800
  autoApproveHighTrustScore: number; // e.g. 85+
  timeLimitDays: number; // e.g. 14 days
}

export interface MetricSummary {
  pendingCount: number;
  approvedTodayCount: number;
  rejectedCount: number;
  escalatedCount: number;
  avgDecisionTimeSeconds: number;
  totalMoneySavedINR: number;
  autoApprovalRate: number;
}
