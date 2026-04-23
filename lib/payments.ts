// GlideWay Payment System
// Technology: Stripe / WorldPay / Adyen Integration
// Features: Tokenized storage, Driver payouts (ACH/Instant)

// ==========================================
// TYPES
// ==========================================

export interface PaymentMethod {
  id: string
  type: 'card' | 'wallet' | 'bank'
  last4: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  stripePaymentMethodId?: string
}

export interface PaymentIntent {
  id: string
  amount: number // cents
  currency: string
  status: PaymentStatus
  paymentMethodId: string
  rideId: string
  customerId: string
  metadata: Record<string, string>
  createdAt: Date
}

export type PaymentStatus = 
  | 'pending'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded'

export interface Refund {
  id: string
  paymentIntentId: string
  amount: number
  reason: RefundReason
  status: 'pending' | 'succeeded' | 'failed'
  createdAt: Date
}

export type RefundReason = 
  | 'ride_canceled'
  | 'service_issue'
  | 'overcharge'
  | 'duplicate'
  | 'requested_by_customer'
  | 'fraud'

export interface DriverPayout {
  id: string
  driverId: string
  amount: number
  method: 'ach' | 'instant' | 'check'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  periodStart: Date
  periodEnd: Date
  rides: string[]
  tips: number
  bonuses: number
  deductions: number
  netAmount: number
  processedAt?: Date
  failureReason?: string
}

// ==========================================
// PAYMENT CONFIGURATION
// ==========================================

export const PAYMENT_CONFIG = {
  currency: 'usd',
  minCharge: 100, // $1.00 minimum
  maxCharge: 100000, // $1,000 maximum
  
  // Processing fees (basis points + fixed)
  processorFees: {
    card: { percentage: 2.9, fixed: 30 }, // 2.9% + $0.30
    wallet: { percentage: 2.5, fixed: 0 },
    bank: { percentage: 0.8, fixed: 0 }
  },
  
  // Payout configuration
  payouts: {
    ach: {
      processingDays: 2,
      minAmount: 100, // $1.00 minimum
      fee: 0
    },
    instant: {
      processingMinutes: 30,
      minAmount: 100,
      fee: 100 // $1.00 flat fee
    }
  },
  
  // Tip percentages
  tipPresets: [15, 20, 25, 30],
  maxTipPercent: 100,
  
  // Refund policy
  refunds: {
    fullRefundWindow: 5, // minutes after booking
    partialRefundWindow: 60, // minutes
    noRefundAfterStart: true
  }
}

// ==========================================
// PAYMENT PROCESSING
// ==========================================

export async function createPaymentIntent(params: {
  amount: number
  customerId: string
  paymentMethodId: string
  rideId: string
  description?: string
}): Promise<{ success: boolean; paymentIntent?: PaymentIntent; error?: string }> {
  // Validate amount
  if (params.amount < PAYMENT_CONFIG.minCharge) {
    return { success: false, error: 'Amount below minimum charge' }
  }
  if (params.amount > PAYMENT_CONFIG.maxCharge) {
    return { success: false, error: 'Amount exceeds maximum charge' }
  }

  // In production, this would call Stripe API:
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const intent = await stripe.paymentIntents.create({
  //   amount: params.amount,
  //   currency: PAYMENT_CONFIG.currency,
  //   customer: params.customerId,
  //   payment_method: params.paymentMethodId,
  //   confirm: true,
  //   metadata: { rideId: params.rideId }
  // })

  const paymentIntent: PaymentIntent = {
    id: `pi_${Date.now()}`,
    amount: params.amount,
    currency: PAYMENT_CONFIG.currency,
    status: 'succeeded',
    paymentMethodId: params.paymentMethodId,
    rideId: params.rideId,
    customerId: params.customerId,
    metadata: { rideId: params.rideId },
    createdAt: new Date()
  }

  return { success: true, paymentIntent }
}

export async function capturePayment(
  paymentIntentId: string
): Promise<{ success: boolean; error?: string }> {
  // In production: await stripe.paymentIntents.capture(paymentIntentId)
  return { success: true }
}

export async function cancelPayment(
  paymentIntentId: string
): Promise<{ success: boolean; error?: string }> {
  // In production: await stripe.paymentIntents.cancel(paymentIntentId)
  return { success: true }
}

// ==========================================
// REFUNDS
// ==========================================

export async function processRefund(params: {
  paymentIntentId: string
  amount: number
  reason: RefundReason
}): Promise<{ success: boolean; refund?: Refund; error?: string }> {
  // In production: await stripe.refunds.create({ payment_intent, amount, reason })
  
  const refund: Refund = {
    id: `re_${Date.now()}`,
    paymentIntentId: params.paymentIntentId,
    amount: params.amount,
    reason: params.reason,
    status: 'succeeded',
    createdAt: new Date()
  }

  return { success: true, refund }
}

export function calculateRefundAmount(
  originalAmount: number,
  minutesSinceBooking: number,
  rideStarted: boolean
): { amount: number; percentage: number } {
  const { fullRefundWindow, partialRefundWindow, noRefundAfterStart } = PAYMENT_CONFIG.refunds
  
  if (rideStarted && noRefundAfterStart) {
    return { amount: 0, percentage: 0 }
  }
  
  if (minutesSinceBooking <= fullRefundWindow) {
    return { amount: originalAmount, percentage: 100 }
  }
  
  if (minutesSinceBooking <= partialRefundWindow) {
    const percentage = Math.max(50, 100 - (minutesSinceBooking - fullRefundWindow))
    const amount = Math.round(originalAmount * percentage / 100)
    return { amount, percentage }
  }
  
  return { amount: 0, percentage: 0 }
}

// ==========================================
// DRIVER PAYOUTS
// ==========================================

export async function calculateDriverPayout(params: {
  driverId: string
  periodStart: Date
  periodEnd: Date
  rides: Array<{
    id: string
    driverEarnings: number
    tip: number
  }>
  bonuses?: number
  deductions?: number
}): Promise<DriverPayout> {
  const totalEarnings = params.rides.reduce((sum, r) => sum + r.driverEarnings, 0)
  const totalTips = params.rides.reduce((sum, r) => sum + r.tip, 0)
  const bonuses = params.bonuses || 0
  const deductions = params.deductions || 0
  
  const netAmount = totalEarnings + totalTips + bonuses - deductions

  return {
    id: `po_${Date.now()}`,
    driverId: params.driverId,
    amount: totalEarnings,
    method: 'ach',
    status: 'pending',
    periodStart: params.periodStart,
    periodEnd: params.periodEnd,
    rides: params.rides.map(r => r.id),
    tips: totalTips,
    bonuses,
    deductions,
    netAmount
  }
}

export async function initiateDriverPayout(
  payout: DriverPayout,
  method: 'ach' | 'instant' = 'ach'
): Promise<{ success: boolean; error?: string }> {
  const config = PAYMENT_CONFIG.payouts[method]
  
  if (payout.netAmount < config.minAmount) {
    return { success: false, error: `Minimum payout amount is $${config.minAmount / 100}` }
  }

  // Apply instant payout fee if applicable
  const fee = config.fee
  const finalAmount = payout.netAmount - fee

  // In production: 
  // await stripe.transfers.create({
  //   amount: finalAmount,
  //   currency: 'usd',
  //   destination: driverStripeAccountId
  // })

  return { success: true }
}

// ==========================================
// TIPS
// ==========================================

export function calculateTipAmount(
  fareAmount: number,
  tipPercentage: number
): number {
  const maxPercent = PAYMENT_CONFIG.maxTipPercent
  const actualPercent = Math.min(tipPercentage, maxPercent)
  return Math.round(fareAmount * actualPercent / 100)
}

export async function processTip(params: {
  rideId: string
  customerId: string
  paymentMethodId: string
  amount: number
  driverId: string
}): Promise<{ success: boolean; error?: string }> {
  // Tips are 100% to driver
  // In production: Create a separate payment intent for the tip
  return { success: true }
}

// ==========================================
// PAYMENT METHOD MANAGEMENT
// ==========================================

export async function addPaymentMethod(params: {
  customerId: string
  type: 'card' | 'wallet' | 'bank'
  token: string // Stripe token from frontend
  setDefault?: boolean
}): Promise<{ success: boolean; paymentMethod?: PaymentMethod; error?: string }> {
  // In production:
  // const paymentMethod = await stripe.paymentMethods.attach(token, { customer: customerId })
  // if (setDefault) await stripe.customers.update(customerId, { default_payment_method: paymentMethod.id })

  const paymentMethod: PaymentMethod = {
    id: `pm_${Date.now()}`,
    type: params.type,
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2028,
    isDefault: params.setDefault || false
  }

  return { success: true, paymentMethod }
}

export async function removePaymentMethod(
  paymentMethodId: string
): Promise<{ success: boolean; error?: string }> {
  // In production: await stripe.paymentMethods.detach(paymentMethodId)
  return { success: true }
}

export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<{ success: boolean; error?: string }> {
  // In production: await stripe.customers.update(customerId, { default_payment_method: paymentMethodId })
  return { success: true }
}

// ==========================================
// FEE CALCULATIONS
// ==========================================

export function calculateProcessorFee(
  amount: number,
  paymentType: 'card' | 'wallet' | 'bank'
): number {
  const fees = PAYMENT_CONFIG.processorFees[paymentType]
  return Math.round(amount * fees.percentage / 100 + fees.fixed)
}

export function calculateCompanyEarnings(params: {
  totalFare: number
  driverPayout: number
  processorFee: number
  promotionCost?: number
}): {
  grossRevenue: number
  driverCost: number
  processingCost: number
  promotionCost: number
  netRevenue: number
  margin: number
} {
  const promotionCost = params.promotionCost || 0
  const netRevenue = params.totalFare - params.driverPayout - params.processorFee - promotionCost
  const margin = params.totalFare > 0 ? (netRevenue / params.totalFare) * 100 : 0

  return {
    grossRevenue: params.totalFare,
    driverCost: params.driverPayout,
    processingCost: params.processorFee,
    promotionCost,
    netRevenue,
    margin: Math.round(margin * 100) / 100
  }
}

// ==========================================
// TOKENIZATION SECURITY
// ==========================================

export function maskCardNumber(cardNumber: string): string {
  const last4 = cardNumber.slice(-4)
  return `****-****-****-${last4}`
}

export function maskBankAccount(accountNumber: string): string {
  const last4 = accountNumber.slice(-4)
  return `****${last4}`
}

// PCI DSS Compliance Note:
// - Never store raw card numbers
// - Always use tokenized payment methods from Stripe/WorldPay
// - Card data should only exist in Stripe's secure vault
// - Use Stripe Elements or similar for frontend card collection
