import { RefundRequest, MerchantPolicy } from '../types';

export const initialMerchantPolicy: MerchantPolicy = {
  instantRefundLimit: 2000,
  managerEscalationLimit: 10000,
  maxMonthlyRefundsAllowed: 3,
  digitalProductsRefundable: false,
  vipInstantApproval: true,
  investigationCostThreshold: 800,
  autoApproveHighTrustScore: 85,
  timeLimitDays: 14,
};

export const initialRefundRequests: RefundRequest[] = [
  {
    id: 'REF-2026-8910',
    createdAt: '2026-07-26T06:15:00Z',
    status: 'PENDING',
    priority: 'LOW',
    customer: {
      id: 'CUST-8821',
      name: 'Aarav Mehta',
      email: 'aarav.mehta@gmail.com',
      phone: '+91 98201 44321',
      isVIP: true,
      totalOrders: 18,
      lifetimeValue: 48000,
      previousRefundsCount: 1,
      totalRefundedAmount: 1299,
      accountAgeMonths: 28,
      trustScore: 94,
      recentRefundsThisMonth: 0,
      sameItemRefundCount: 0,
    },
    order: {
      id: 'ORD-98231',
      orderDate: '2026-07-22T10:30:00Z',
      productName: 'Noise ColorFit Pulse Smartwatch (Jet Black)',
      productCategory: 'Electronics',
      isDigital: false,
      amount: 1299,
      currency: 'INR',
      paymentMethod: 'UPI',
      deliveryStatus: 'DELIVERED',
      deliveredDate: '2026-07-23T14:10:00Z',
      returnReason: 'Minor strap latch looseness',
      customerNote: 'The strap latch feels slightly loose out of the box. Would prefer a refund or replacement.',
      attachedEvidenceCount: 1,
    },
    aiDecision: {
      action: 'APPROVE',
      actionLabel: 'Approve (Instant Refund)',
      confidence: 94,
      summaryReason: 'Customer has 18 successful orders and VIP status. Only 1 previous refund in 2+ years. Refund amount (₹1,299) is within policy.',
      detailedReasoning: [
        'Customer completed 18 successful orders with ₹48,000 total lifetime value.',
        'High customer trust score of 94/100 with zero refunds in the current calendar month.',
        'Product delivered 3 days ago, well within the 14-day return policy window.',
        'Refund amount (₹1,299) is lower than the manual investigation cost threshold (₹800 investigation vs ₹1,299 refund risk).'
      ],
      businessImpactText: 'Approving maintains long-term customer trust and VIP loyalty while presenting minimal financial risk.',
      policyCheckResults: [
        { ruleName: 'VIP Instant Approval', status: 'PASSED', description: 'Customer holds active VIP status with 18 prior completed purchases.' },
        { ruleName: 'Monthly Refund Cap', status: 'PASSED', description: '0 refunds this month (Limit: 3).' },
        { ruleName: 'Return Window Check', status: 'PASSED', description: 'Delivered 3 days ago (Policy limit: 14 days).' },
        { ruleName: 'Manager Threshold Check', status: 'PASSED', description: 'Amount ₹1,299 is below ₹10,000 manager escalation threshold.' }
      ],
      costAnalysis: {
        refundCost: 1299,
        estimatedInvestigationCost: 800,
        customerChurnRiskValue: 48000,
        costDifference: -499,
        cheaperToRefund: true,
        rationale: 'Investigation cost (₹800) plus potential churn risk of ₹48k VIP customer far exceeds the ₹1,299 refund value.'
      },
      evaluatedAt: '2026-07-26T06:15:05Z'
    },
    auditTrail: [
      {
        id: 'AUD-001',
        timestamp: '2026-07-26T06:15:05Z',
        actor: 'AI_ENGINE',
        actorName: 'Refund IQ Engine',
        action: 'Generated recommendation: APPROVE (94% confidence)'
      }
    ]
  },
  {
    id: 'REF-2026-8911',
    createdAt: '2026-07-26T05:40:00Z',
    status: 'PENDING',
    priority: 'URGENT',
    customer: {
      id: 'CUST-3312',
      name: 'Rohan Sharma',
      email: 'rohan.s.tech@yahoo.in',
      phone: '+91 99870 12099',
      isVIP: false,
      totalOrders: 3,
      lifetimeValue: 34500,
      previousRefundsCount: 0,
      totalRefundedAmount: 0,
      accountAgeMonths: 4,
      trustScore: 72,
      recentRefundsThisMonth: 0,
      sameItemRefundCount: 0,
    },
    order: {
      id: 'ORD-98442',
      orderDate: '2026-07-20T11:00:00Z',
      productName: 'Sony WH-1000XM5 Wireless Headphones',
      productCategory: 'Electronics',
      isDigital: false,
      amount: 28990,
      currency: 'INR',
      paymentMethod: 'Credit Card',
      deliveryStatus: 'DELIVERED',
      deliveredDate: '2026-07-22T16:00:00Z',
      returnReason: 'Active Noise Cancellation non-functional in left earbud',
      customerNote: 'Left earbud ANC is making buzzing noise. Requesting full refund.',
      attachedEvidenceCount: 0,
    },
    aiDecision: {
      action: 'ESCALATE',
      actionLabel: 'Escalate to Manager',
      confidence: 89,
      summaryReason: 'Refund amount (₹28,990) exceeds the merchant policy limit (₹10,000) for instant approval. Requires Manager Authorization.',
      detailedReasoning: [
        'Refund request amount of ₹28,990 exceeds merchant manager escalation threshold of ₹10,000.',
        'High value audio unit requires technician inspection or video evidence verification.',
        'Customer account is relatively new (4 months) with 3 prior completed orders.',
        'Zero attached media evidence provided with the initial claim.'
      ],
      businessImpactText: 'Manager escalation protects merchant against high capital loss while allowing human review for valid defect claims.',
      policyCheckResults: [
        { ruleName: 'Manager Threshold Check', status: 'FLAGGED', description: 'Amount ₹28,990 exceeds ₹10,000 limit. Mandatory Manager approval required.' },
        { ruleName: 'Media Evidence Attached', status: 'FLAGGED', description: 'No photo/video evidence attached for hardware malfunction claim.' },
        { ruleName: 'Return Window Check', status: 'PASSED', description: 'Delivered 4 days ago (Within 14-day limit).' }
      ],
      costAnalysis: {
        refundCost: 28990,
        estimatedInvestigationCost: 1200,
        customerChurnRiskValue: 15000,
        costDifference: -27790,
        cheaperToRefund: false,
        rationale: 'High refund value (₹28,990) justifies formal manager review and product collection/inspection before disbursement.'
      },
      evaluatedAt: '2026-07-26T05:40:04Z'
    },
    auditTrail: [
      {
        id: 'AUD-002',
        timestamp: '2026-07-26T05:40:04Z',
        actor: 'AI_ENGINE',
        actorName: 'Refund IQ Engine',
        action: 'Generated recommendation: ESCALATE (89% confidence)'
      }
    ]
  },
  {
    id: 'REF-2026-8912',
    createdAt: '2026-07-26T04:50:00Z',
    status: 'PENDING',
    priority: 'HIGH',
    customer: {
      id: 'CUST-7740',
      name: 'Priya Sundaram',
      email: 'psundaram91@outlook.com',
      phone: '+91 97112 30988',
      isVIP: false,
      totalOrders: 5,
      lifetimeValue: 8400,
      previousRefundsCount: 3,
      totalRefundedAmount: 6200,
      accountAgeMonths: 2,
      trustScore: 41,
      recentRefundsThisMonth: 3,
      sameItemRefundCount: 2,
    },
    order: {
      id: 'ORD-98110',
      orderDate: '2026-07-24T08:15:00Z',
      productName: 'Anarkali Cotton Kurta Set (Size L)',
      productCategory: 'Fashion',
      isDigital: false,
      amount: 1899,
      currency: 'INR',
      paymentMethod: 'COD',
      deliveryStatus: 'DELIVERED',
      deliveredDate: '2026-07-25T12:00:00Z',
      returnReason: 'Fabric quality not as expected',
      customerNote: 'Color looks different from website photo.',
      attachedEvidenceCount: 0,
    },
    aiDecision: {
      action: 'REJECT',
      actionLabel: 'Reject Request',
      confidence: 91,
      summaryReason: 'Customer exceeded monthly refund limit (3 refunds this month) and has a pattern of returning the same item category repeatedly.',
      detailedReasoning: [
        'Customer has already claimed 3 refunds within the past 30 days, exceeding merchant policy limit (Max 3/month).',
        'High refund ratio: 3 out of 5 lifetime orders refunded (60% refund rate).',
        'Same item category refunded twice previously under Cash on Delivery (COD).',
        'Customer trust score is low (41/100).'
      ],
      businessImpactText: 'Rejecting prevents serial returning abuse and enforces standard merchant policy boundaries.',
      policyCheckResults: [
        { ruleName: 'Monthly Refund Cap', status: 'FLAGGED', description: '3 refunds already claimed this month (Policy limit: 3 max).' },
        { ruleName: 'Serial Refunder Policy', status: 'FLAGGED', description: 'Refund to order ratio (60%) exceeds safety threshold of 25%.' },
        { ruleName: 'Trust Score Evaluation', status: 'FLAGGED', description: 'Trust score 41/100 is below minimum threshold of 60.' }
      ],
      costAnalysis: {
        refundCost: 1899,
        estimatedInvestigationCost: 500,
        customerChurnRiskValue: 2000,
        costDifference: -1399,
        cheaperToRefund: false,
        rationale: 'Pattern indicates serial refund abuse. Approving encourages further non-genuine claims.'
      },
      evaluatedAt: '2026-07-26T04:50:02Z'
    },
    auditTrail: [
      {
        id: 'AUD-003',
        timestamp: '2026-07-26T04:50:02Z',
        actor: 'AI_ENGINE',
        actorName: 'Refund IQ Engine',
        action: 'Generated recommendation: REJECT (91% confidence)'
      }
    ]
  },
  {
    id: 'REF-2026-8913',
    createdAt: '2026-07-26T03:30:00Z',
    status: 'PENDING',
    priority: 'MEDIUM',
    customer: {
      id: 'CUST-5510',
      name: 'Vikramaditya Verma',
      email: 'vikram.verma@corp.in',
      phone: '+91 98450 77123',
      isVIP: false,
      totalOrders: 8,
      lifetimeValue: 19500,
      previousRefundsCount: 0,
      totalRefundedAmount: 0,
      accountAgeMonths: 14,
      trustScore: 88,
      recentRefundsThisMonth: 0,
      sameItemRefundCount: 0,
    },
    order: {
      id: 'ORD-98501',
      orderDate: '2026-07-21T15:00:00Z',
      productName: 'Full Stack React & Node Masterclass (Digital Course)',
      productCategory: 'Digital Course',
      isDigital: true,
      amount: 4999,
      currency: 'INR',
      paymentMethod: 'NetBanking',
      deliveryStatus: 'DELIVERED',
      deliveredDate: '2026-07-21T15:01:00Z',
      returnReason: 'Course content did not match expectations',
      customerNote: 'I finished 40% of videos and realized I already knew most topics. Want a full refund.',
      attachedEvidenceCount: 0,
    },
    aiDecision: {
      action: 'REQUEST_INFO',
      actionLabel: 'Request More Information',
      confidence: 86,
      summaryReason: 'Digital goods are non-refundable by default under policy, but customer has 88 trust score. Require completion percentage proof or technical feedback.',
      detailedReasoning: [
        'Order is a Digital Product (course download/access), which is non-refundable per general merchant policy.',
        'LMS analytics indicate customer completed 42% of course videos before requesting refund.',
        'Customer has high account trust score (88/100) with zero past refund requests.',
        'Requesting evidence or specific module feedback before deciding on exception approval.'
      ],
      businessImpactText: 'Requesting info protects digital IP rights while preserving relationship with a high-trust customer.',
      policyCheckResults: [
        { ruleName: 'Digital Product Policy', status: 'FLAGGED', description: 'Digital goods marked non-refundable unless technical flaw proven.' },
        { ruleName: 'Customer Trust Score', status: 'PASSED', description: 'Trust score 88/100 qualifies for manual exception review.' }
      ],
      costAnalysis: {
        refundCost: 4999,
        estimatedInvestigationCost: 400,
        customerChurnRiskValue: 19500,
        costDifference: -4599,
        cheaperToRefund: false,
        rationale: 'Digital product delivery carries zero marginal restocking cost, but indiscriminate digital refunds invite content piracy.'
      },
      evaluatedAt: '2026-07-26T03:30:06Z'
    },
    auditTrail: [
      {
        id: 'AUD-004',
        timestamp: '2026-07-26T03:30:06Z',
        actor: 'AI_ENGINE',
        actorName: 'Refund IQ Engine',
        action: 'Generated recommendation: REQUEST_INFO (86% confidence)'
      }
    ]
  },
  {
    id: 'REF-2026-8914',
    createdAt: '2026-07-25T21:10:00Z',
    status: 'APPROVED',
    priority: 'LOW',
    customer: {
      id: 'CUST-1092',
      name: 'Ananya Deshmukh',
      email: 'ananya.d@gmail.com',
      phone: '+91 99100 88211',
      isVIP: false,
      totalOrders: 12,
      lifetimeValue: 14200,
      previousRefundsCount: 1,
      totalRefundedAmount: 450,
      accountAgeMonths: 18,
      trustScore: 92,
      recentRefundsThisMonth: 0,
      sameItemRefundCount: 0,
    },
    order: {
      id: 'ORD-97882',
      orderDate: '2026-07-22T09:00:00Z',
      productName: 'Organic Stainless Steel Water Bottle (1L)',
      productCategory: 'Home & Living',
      isDigital: false,
      amount: 499,
      currency: 'INR',
      paymentMethod: 'UPI',
      deliveryStatus: 'DELIVERED',
      deliveredDate: '2026-07-24T11:20:00Z',
      returnReason: 'Dented during shipping transit',
      customerNote: 'Box arrived crushed, bottle has noticeable dent on lower rim.',
      attachedEvidenceCount: 2,
    },
    aiDecision: {
      action: 'APPROVE',
      actionLabel: 'Approve (Instant Refund)',
      confidence: 97,
      summaryReason: 'Low refund value (₹499) is lower than investigation cost (₹800). Verified shipping damage photos attached.',
      detailedReasoning: [
        'Item value ₹499 is below manual investigation cost (₹800). Refunding immediately is mathematically cheaper for business.',
        'Customer attached 2 clear photographs of shipping packaging damage.',
        'High trust score (92/100) and 12 completed order history.'
      ],
      businessImpactText: 'Approving saves ₹301 in operational support costs compared to manual investigation.',
      policyCheckResults: [
        { ruleName: 'Business Cost Optimization', status: 'PASSED', description: 'Refund cost (₹499) < Investigation cost (₹800).' },
        { ruleName: 'Evidence Verification', status: 'PASSED', description: '2 media files verified in submission.' }
      ],
      costAnalysis: {
        refundCost: 499,
        estimatedInvestigationCost: 800,
        customerChurnRiskValue: 14200,
        costDifference: 301,
        cheaperToRefund: true,
        rationale: 'Refunding ₹499 saves ₹301 vs dispatching an auditor/support representative.'
      },
      evaluatedAt: '2026-07-25T21:10:03Z'
    },
    auditTrail: [
      {
        id: 'AUD-005',
        timestamp: '2026-07-25T21:10:03Z',
        actor: 'AI_ENGINE',
        actorName: 'Refund IQ Engine',
        action: 'Generated recommendation: APPROVE (97% confidence)'
      },
      {
        id: 'AUD-006',
        timestamp: '2026-07-25T21:12:00Z',
        actor: 'HUMAN_AGENT',
        actorName: 'Neha Kapoor (Finance Agent)',
        action: 'Approved refund via AI instant workflow',
        notes: 'Verified damage photo. Auto-disbursed via Razorpay Payouts.'
      }
    ]
  },
  {
    id: 'REF-2026-8915',
    createdAt: '2026-07-25T18:40:00Z',
    status: 'ESCALATED',
    priority: 'HIGH',
    customer: {
      id: 'CUST-9921',
      name: 'Kabir Kapoor',
      email: 'kabir.kapoor@techcorp.com',
      phone: '+91 98199 44001',
      isVIP: true,
      totalOrders: 31,
      lifetimeValue: 185000,
      previousRefundsCount: 2,
      totalRefundedAmount: 4800,
      accountAgeMonths: 36,
      trustScore: 96,
      recentRefundsThisMonth: 0,
      sameItemRefundCount: 0,
    },
    order: {
      id: 'ORD-97600',
      orderDate: '2026-07-20T14:20:00Z',
      productName: 'MacBook Pro Stand & Dual Monitor Hub Dock',
      productCategory: 'Electronics',
      isDigital: false,
      amount: 14499,
      currency: 'INR',
      paymentMethod: 'Credit Card',
      deliveryStatus: 'DELIVERED',
      deliveredDate: '2026-07-22T10:00:00Z',
      returnReason: 'HDMI 2.1 port flickering on 4K @ 120Hz',
      customerNote: 'The dock works for charging but output displays intermittent black screens on dual 4K monitors.',
      attachedEvidenceCount: 1,
    },
    aiDecision: {
      action: 'ESCALATE',
      actionLabel: 'Escalate to Manager',
      confidence: 88,
      summaryReason: 'High customer LTV (₹1,85,000) and order value (₹14,499) above ₹10,000 threshold. VIP override recommended for expedited review.',
      detailedReasoning: [
        'Amount ₹14,499 exceeds ₹10,000 automatic policy limit.',
        'Customer is a top-tier VIP with ₹185,000 LTV across 31 orders.',
        'High business churn risk if delayed or mismanaged.'
      ],
      businessImpactText: 'Escalating to Manager ensures personalized white-glove VIP handling while validating high-value hardware return.',
      policyCheckResults: [
        { ruleName: 'Manager Escalation Limit', status: 'FLAGGED', description: 'Amount ₹14,499 > ₹10,000 threshold.' },
        { ruleName: 'VIP Priority Routing', status: 'PASSED', description: 'Customer in top 1% LTV bracket.' }
      ],
      costAnalysis: {
        refundCost: 14499,
        estimatedInvestigationCost: 1000,
        customerChurnRiskValue: 185000,
        costDifference: -13499,
        cheaperToRefund: false,
        rationale: 'Customer LTV is 12x higher than order value. Manager override for replacement or instant refund is recommended.'
      },
      evaluatedAt: '2026-07-25T18:40:02Z'
    },
    auditTrail: [
      {
        id: 'AUD-007',
        timestamp: '2026-07-25T18:40:02Z',
        actor: 'AI_ENGINE',
        actorName: 'Refund IQ Engine',
        action: 'Generated recommendation: ESCALATE (88% confidence)'
      }
    ]
  }
];

export const sampleScenarios = [
  {
    title: 'VIP High-LTV Customer (Low Risk)',
    description: 'Aarav Mehta - ₹1,299 Smartwatch return, 18 orders, ₹48k LTV',
    customer: {
      id: 'CUST-SIM-01',
      name: 'Aarav Mehta',
      email: 'aarav.m@gmail.com',
      phone: '+91 98200 11223',
      isVIP: true,
      totalOrders: 18,
      lifetimeValue: 48000,
      previousRefundsCount: 1,
      totalRefundedAmount: 1299,
      accountAgeMonths: 24,
      trustScore: 94,
      recentRefundsThisMonth: 0,
      sameItemRefundCount: 0,
    },
    order: {
      id: 'ORD-SIM-01',
      orderDate: '2026-07-23T10:00:00Z',
      productName: 'Noise ColorFit Pulse Smartwatch',
      productCategory: 'Electronics',
      isDigital: false,
      amount: 1299,
      currency: 'INR',
      paymentMethod: 'UPI' as const,
      deliveryStatus: 'DELIVERED' as const,
      deliveredDate: '2026-07-24T12:00:00Z',
      returnReason: 'Minor strap looseness',
      customerNote: 'Strap is loose',
      attachedEvidenceCount: 1,
    }
  },
  {
    title: 'Serial Refunder (High Risk Policy Flag)',
    description: 'Priya Sundaram - 3 refunds this month, 60% refund rate under COD',
    customer: {
      id: 'CUST-SIM-02',
      name: 'Priya Sundaram',
      email: 'priya.s@outlook.com',
      phone: '+91 97111 22334',
      isVIP: false,
      totalOrders: 5,
      lifetimeValue: 8400,
      previousRefundsCount: 3,
      totalRefundedAmount: 6200,
      accountAgeMonths: 2,
      trustScore: 41,
      recentRefundsThisMonth: 3,
      sameItemRefundCount: 2,
    },
    order: {
      id: 'ORD-SIM-02',
      orderDate: '2026-07-24T08:00:00Z',
      productName: 'Anarkali Cotton Kurta Set',
      productCategory: 'Fashion',
      isDigital: false,
      amount: 1899,
      currency: 'INR',
      paymentMethod: 'COD' as const,
      deliveryStatus: 'DELIVERED' as const,
      deliveredDate: '2026-07-25T11:00:00Z',
      returnReason: 'Fabric quality not as expected',
      customerNote: 'Color slightly different',
      attachedEvidenceCount: 0,
    }
  },
  {
    title: 'High Value Hardware (Manager Threshold ₹28,990)',
    description: 'Rohan Sharma - Sony Headphones ₹28,990 exceeds ₹10,000 auto limit',
    customer: {
      id: 'CUST-SIM-03',
      name: 'Rohan Sharma',
      email: 'rohan.tech@yahoo.in',
      phone: '+91 99870 99887',
      isVIP: false,
      totalOrders: 3,
      lifetimeValue: 34500,
      previousRefundsCount: 0,
      totalRefundedAmount: 0,
      accountAgeMonths: 4,
      trustScore: 72,
      recentRefundsThisMonth: 0,
      sameItemRefundCount: 0,
    },
    order: {
      id: 'ORD-SIM-03',
      orderDate: '2026-07-20T11:00:00Z',
      productName: 'Sony WH-1000XM5 Headphones',
      productCategory: 'Electronics',
      isDigital: false,
      amount: 28990,
      currency: 'INR',
      paymentMethod: 'Credit Card' as const,
      deliveryStatus: 'DELIVERED' as const,
      deliveredDate: '2026-07-22T16:00:00Z',
      returnReason: 'ANC buzzing noise in left earbud',
      customerNote: 'Left earbud ANC buzzing',
      attachedEvidenceCount: 0,
    }
  },
  {
    title: 'Low Value Item (Cheaper to Refund ₹399 vs ₹800 Investigation)',
    description: 'Meera Iyer - ₹399 Phone Case damaged in transit',
    customer: {
      id: 'CUST-SIM-04',
      name: 'Meera Iyer',
      email: 'meera.iyer@gmail.com',
      phone: '+91 98401 55443',
      isVIP: false,
      totalOrders: 9,
      lifetimeValue: 11200,
      previousRefundsCount: 0,
      totalRefundedAmount: 0,
      accountAgeMonths: 11,
      trustScore: 89,
      recentRefundsThisMonth: 0,
      sameItemRefundCount: 0,
    },
    order: {
      id: 'ORD-SIM-04',
      orderDate: '2026-07-24T14:00:00Z',
      productName: 'Matte Silicone Shockproof iPhone Case',
      productCategory: 'Electronics',
      isDigital: false,
      amount: 399,
      currency: 'INR',
      paymentMethod: 'UPI' as const,
      deliveryStatus: 'DELIVERED' as const,
      deliveredDate: '2026-07-25T15:00:00Z',
      returnReason: 'Corner cracked during transit',
      customerNote: 'Corner cracked',
      attachedEvidenceCount: 1,
    }
  }
];
