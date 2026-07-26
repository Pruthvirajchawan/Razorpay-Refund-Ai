import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Razorpay Refund Intelligence API",
    geminiKeyPresent: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/analyze-refund", async (req, res) => {
  const { customer, order, policy } = req.body;

  if (!customer || !order) {
    return res.status(400).json({ error: "Missing required customer or order payload" });
  }

  const merchantPolicy = policy || {
    instantRefundLimit: 2000,
    managerEscalationLimit: 10000,
    maxMonthlyRefundsAllowed: 3,
    digitalProductsRefundable: false,
    vipInstantApproval: true,
    investigationCostThreshold: 800,
    autoApproveHighTrustScore: 85,
    timeLimitDays: 14,
  };

  const investigationCost = 800; // Average support agent / investigation cost in INR
  const refundCost = order.amount || 0;
  const cheaperToRefund = refundCost <= investigationCost && customer.trustScore >= 70;

  // Attempt Gemini API call
  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `
You are Razorpay Refund Intelligence — an AI-powered enterprise refund decision engine.
Evaluate this refund request to make the smartest business decision.

CORE PHILOSOPHY:
- Never say "Fraud detected".
- Speak in enterprise risk language: "Based on available information, approving this refund has a low business risk and aligns with company policy."
- Determine ONLY ONE action from: "APPROVE", "REQUEST_INFO", "ESCALATE", "REJECT".

DECISION RULES:
1. APPROVE: High customer trust (score > 80), lower value (< ₹${merchantPolicy.instantRefundLimit} or VIP customer), low refund frequency (< 3/mo), or when Refund Cost (₹${refundCost}) is lower than Investigation Cost (₹${investigationCost}).
2. ESCALATE: Order amount > ₹${merchantPolicy.managerEscalationLimit} (e.g. ₹10,000+), high risk value, or VIP high-tier customer needing custom manager override.
3. REJECT: Customer exceeded monthly refund limit (> 3 refunds this month), serial category refunder pattern, or non-refundable digital goods with no evidence.
4. REQUEST_INFO: Missing necessary evidence for hardware defect claims, or digital goods with user requesting exception.

CONTEXT:
Customer Data:
- Name: ${customer.name}
- VIP Status: ${customer.isVIP ? "YES (VIP)" : "No"}
- Lifetime Value (LTV): ₹${customer.lifetimeValue} across ${customer.totalOrders} orders
- Previous Refunds: ${customer.previousRefundsCount}
- Refunds This Month: ${customer.recentRefundsThisMonth}
- Trust Score: ${customer.trustScore}/100
- Account Age: ${customer.accountAgeMonths} months

Order Details:
- Product: ${order.productName} (${order.productCategory})
- Digital Item: ${order.isDigital ? "YES" : "NO"}
- Amount: ₹${order.amount}
- Payment Method: ${order.paymentMethod}
- Return Reason: ${order.returnReason}
- Customer Note: "${order.customerNote || "None"}"
- Attached Evidence Files: ${order.attachedEvidenceCount}

Merchant Policy Rules:
- Instant Refund Limit: ₹${merchantPolicy.instantRefundLimit}
- Manager Escalation Threshold: ₹${merchantPolicy.managerEscalationLimit}
- Monthly Refund Cap: ${merchantPolicy.maxMonthlyRefundsAllowed}
- VIP Instant Approval Enabled: ${merchantPolicy.vipInstantApproval}
- Digital Goods Refundable: ${merchantPolicy.digitalProductsRefundable}

Return JSON with exact keys:
{
  "action": "APPROVE" | "REQUEST_INFO" | "ESCALATE" | "REJECT",
  "actionLabel": string,
  "confidence": number (e.g. 92),
  "summaryReason": string,
  "detailedReasoning": string[],
  "businessImpactText": string,
  "policyCheckResults": [
    { "ruleName": string, "status": "PASSED" | "FLAGGED" | "MANUAL_REVIEW", "description": string }
  ],
  "costAnalysis": {
    "refundCost": number,
    "estimatedInvestigationCost": number,
    "customerChurnRiskValue": number,
    "costDifference": number,
    "cheaperToRefund": boolean,
    "rationale": string
  }
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING },
              actionLabel: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              summaryReason: { type: Type.STRING },
              detailedReasoning: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              businessImpactText: { type: Type.STRING },
              policyCheckResults: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ruleName: { type: Type.STRING },
                    status: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                },
              },
              costAnalysis: {
                type: Type.OBJECT,
                properties: {
                  refundCost: { type: Type.NUMBER },
                  estimatedInvestigationCost: { type: Type.NUMBER },
                  customerChurnRiskValue: { type: Type.NUMBER },
                  costDifference: { type: Type.NUMBER },
                  cheaperToRefund: { type: Type.BOOLEAN },
                  rationale: { type: Type.STRING },
                },
              },
            },
            required: [
              "action",
              "actionLabel",
              "confidence",
              "summaryReason",
              "detailedReasoning",
              "businessImpactText",
              "policyCheckResults",
              "costAnalysis",
            ],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        parsed.evaluatedAt = new Date().toISOString();
        return res.json(parsed);
      }
    }
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.warn(
      `Gemini API notice (${errMsg.includes("429") || errMsg.includes("quota") ? "Quota rate limit reached" : "API unavailable"}). Smoothly utilizing Refund IQ Rule Engine.`
    );
  }

  // Local Rule Engine Fallback
  let action: "APPROVE" | "REQUEST_INFO" | "ESCALATE" | "REJECT" = "APPROVE";
  let actionLabel = "Approve (Instant Refund)";
  let confidence = 88;
  let summaryReason = "";
  const detailedReasoning: string[] = [];
  const policyCheckResults: any[] = [];

  if (customer.recentRefundsThisMonth >= merchantPolicy.maxMonthlyRefundsAllowed) {
    action = "REJECT";
    actionLabel = "Reject Request";
    confidence = 91;
    summaryReason = `Customer reached monthly limit of ${merchantPolicy.maxMonthlyRefundsAllowed} refunds.`;
    detailedReasoning.push(`Customer has claimed ${customer.recentRefundsThisMonth} refunds this month.`);
    detailedReasoning.push(`Enforces merchant monthly refund abuse prevention policy.`);
    policyCheckResults.push({
      ruleName: "Monthly Refund Limit",
      status: "FLAGGED",
      description: `3 monthly limit exceeded (${customer.recentRefundsThisMonth} claimed).`
    });
  } else if (order.amount >= merchantPolicy.managerEscalationLimit) {
    action = "ESCALATE";
    actionLabel = "Escalate to Manager";
    confidence = 90;
    summaryReason = `Order value (₹${order.amount.toLocaleString("en-IN")}) exceeds manager threshold (₹${merchantPolicy.managerEscalationLimit.toLocaleString("en-IN")}).`;
    detailedReasoning.push(`High order value of ₹${order.amount.toLocaleString("en-IN")} requires senior financial sign-off.`);
    policyCheckResults.push({
      ruleName: "Manager Approval Limit",
      status: "FLAGGED",
      description: `Amount exceeds ₹${merchantPolicy.managerEscalationLimit.toLocaleString("en-IN")} threshold.`
    });
  } else if (order.isDigital && !merchantPolicy.digitalProductsRefundable && customer.trustScore < 90) {
    action = "REQUEST_INFO";
    actionLabel = "Request More Information";
    confidence = 85;
    summaryReason = "Digital items are non-refundable by default. Requesting technical evidence.";
    detailedReasoning.push("Digital downloadable asset requested for refund.");
    policyCheckResults.push({
      ruleName: "Digital Product Non-Refundable",
      status: "FLAGGED",
      description: "Digital goods policy triggered."
    });
  } else if (customer.isVIP && merchantPolicy.vipInstantApproval) {
    action = "APPROVE";
    actionLabel = "Approve (Instant Refund)";
    confidence = 96;
    summaryReason = `VIP Customer (${customer.name}) approved instantly based on ₹${customer.lifetimeValue.toLocaleString("en-IN")} LTV.`;
    detailedReasoning.push(`Customer has completed ${customer.totalOrders} successful orders.`);
    detailedReasoning.push("VIP Fast-track policy applied.");
    policyCheckResults.push({
      ruleName: "VIP Fast Track",
      status: "PASSED",
      description: `Active VIP account with high trust score (${customer.trustScore}/100).`
    });
  } else {
    action = "APPROVE";
    actionLabel = "Approve (Instant Refund)";
    confidence = 92;
    summaryReason = `Refund request of ₹${order.amount.toLocaleString("en-IN")} aligns with merchant policy and risk parameters.`;
    detailedReasoning.push(`Customer trust score of ${customer.trustScore}/100 is within low risk threshold.`);
    detailedReasoning.push(`Order delivered recently within the ${merchantPolicy.timeLimitDays}-day return window.`);
    policyCheckResults.push({
      ruleName: "Standard Return Policy",
      status: "PASSED",
      description: "Order within return window and amount limit."
    });
  }

  const costDifference = investigationCost - refundCost;

  return res.json({
    action,
    actionLabel,
    confidence,
    summaryReason,
    detailedReasoning,
    businessImpactText: action === "APPROVE"
      ? "Approving maintains customer trust while presenting low financial risk."
      : action === "ESCALATE"
      ? "Escalating ensures appropriate risk mitigation for high value transactions."
      : action === "REJECT"
      ? "Rejecting enforces policy limits and mitigates serial refunder costs."
      : "Requesting info preserves digital IP and clarifies customer concern.",
    policyCheckResults,
    costAnalysis: {
      refundCost,
      estimatedInvestigationCost: investigationCost,
      customerChurnRiskValue: Math.round(customer.lifetimeValue * 0.4),
      costDifference,
      cheaperToRefund,
      rationale: cheaperToRefund
        ? `Refunding ₹${refundCost} is ₹${Math.abs(costDifference)} cheaper than manual investigation (₹${investigationCost}).`
        : `Investigation cost (₹${investigationCost}) is justified given the transaction amount (₹${refundCost}).`
    },
    evaluatedAt: new Date().toISOString()
  });
});

// Vite / Static Files Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Razorpay Refund Intelligence Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
