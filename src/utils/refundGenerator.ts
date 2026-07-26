import { RefundRequest, MerchantPolicy } from '../types';

const FIRST_NAMES = ['Kavya', 'Siddharth', 'Aaliyah', 'Ishaan', 'Tanvi', 'Devansh', 'Anika', 'Kabir', 'Riya', 'Arjun', 'Meera', 'Rohan', 'Pooja', 'Aditya', 'Neha', 'Vihaan'];
const LAST_NAMES = ['Sharma', 'Verma', 'Patel', 'Chawla', 'Deshmukh', 'Iyer', 'Nair', 'Reddy', 'Singhania', 'Joshi', 'Gupta', 'Sen', 'Kulkarni', 'Bhatia'];

const PRODUCTS = [
  { name: 'Ultra HD Wireless Soundbar with Dolby Atmos', category: 'Electronics', isDigital: false, baseAmount: 12499 },
  { name: 'Ergonomic Mesh High-Back Office Chair', category: 'Furniture', isDigital: false, baseAmount: 8990 },
  { name: 'Pure Mulberry Silk Bedding Sheet Set', category: 'Home & Living', isDigital: false, baseAmount: 4500 },
  { name: 'Premium Leather Minimalist Slim Wallet', category: 'Fashion', isDigital: false, baseAmount: 1499 },
  { name: 'Full Stack Node.js & Microservices Masterclass', category: 'Digital Course', isDigital: true, baseAmount: 3999 },
  { name: 'Active Noise Cancelling True Wireless Earbuds', category: 'Electronics', isDigital: false, baseAmount: 5999 },
  { name: 'Organic Cold-Pressed Ayurvedic Hair Oil (200ml)', category: 'Beauty', isDigital: false, baseAmount: 699 },
  { name: 'Smart Fitness Tracker Watch with SpO2', category: 'Electronics', isDigital: false, baseAmount: 2499 },
  { name: 'Designer Handwoven Cotton Chanderi Saree', category: 'Fashion', isDigital: false, baseAmount: 3200 },
  { name: 'AI Prompt Engineering & LLM Architecture Guide', category: 'Digital Course', isDigital: true, baseAmount: 1999 },
];

const REASONS = [
  { reason: 'Item defective or not powering on', note: 'Unit does not power up even after charging overnight with original cable.' },
  { reason: 'Size mismatch / incorrect fit', note: 'Product sizing is significantly smaller than standard sizing chart.' },
  { reason: 'Damaged in transit packaging', note: 'Outer shipping carton was severely dented and product has visible scratches.' },
  { reason: 'Digital access code invalid or expired', note: 'Received error code 403 when trying to unlock course modules.' },
  { reason: 'Delayed delivery beyond promise date', note: 'Order arrived 10 days late after my scheduled travel date.' },
  { reason: 'Changed mind / product no longer needed', note: 'Item arrived as described but I no longer need it.' }
];

const PAYMENT_METHODS = ['UPI', 'Credit Card', 'NetBanking', 'COD'] as const;

export function generateRandomRefundRequest(): { customer: any; order: any; id: string; createdAt: string; priority: any } {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 90 + 10)}@gmail.com`;
  
  const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const reasonObj = REASONS[Math.floor(Math.random() * REASONS.length)];
  const paymentMethod = PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)];

  const isVIP = Math.random() < 0.25; // 25% chance VIP
  const totalOrders = isVIP ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 8) + 1;
  const lifetimeValue = totalOrders * (Math.floor(Math.random() * 2000) + 1000);
  const trustScore = isVIP ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 50) + 45;
  const recentRefundsThisMonth = Math.random() < 0.2 ? Math.floor(Math.random() * 3) + 1 : 0;

  const idNum = Math.floor(Math.random() * 8999) + 1000;
  const reqId = `REF-2026-${idNum}`;
  const ordId = `ORD-${Math.floor(Math.random() * 89999) + 10000}`;
  const custId = `CUST-${Math.floor(Math.random() * 8999) + 1000}`;

  const amount = product.baseAmount + (Math.floor(Math.random() * 5) - 2) * 100;

  const priority = amount > 10000 ? 'URGENT' : trustScore < 50 ? 'HIGH' : 'NORMAL';

  const customer = {
    id: custId,
    name,
    email,
    phone: `+91 98${Math.floor(Math.random() * 89999999 + 10000000)}`,
    isVIP,
    totalOrders,
    lifetimeValue,
    previousRefundsCount: recentRefundsThisMonth,
    totalRefundedAmount: recentRefundsThisMonth * 1500,
    accountAgeMonths: Math.floor(Math.random() * 24) + 2,
    trustScore,
    recentRefundsThisMonth,
    sameItemRefundCount: recentRefundsThisMonth > 0 ? 1 : 0,
  };

  const order = {
    id: ordId,
    orderDate: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    productName: product.name,
    productCategory: product.category,
    isDigital: product.isDigital,
    amount: Math.max(299, amount),
    currency: 'INR',
    paymentMethod,
    deliveryStatus: 'DELIVERED',
    deliveredDate: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    returnReason: reasonObj.reason,
    customerNote: reasonObj.note,
    attachedEvidenceCount: Math.random() > 0.5 ? 1 : 0,
  };

  return {
    id: reqId,
    createdAt: new Date().toISOString(),
    priority,
    customer,
    order,
  };
}
