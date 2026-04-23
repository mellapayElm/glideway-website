/**
 * GlideWay Smart Fare Calculation Engine
 * A comprehensive pricing system that combines real-time GPS intelligence,
 * dynamic pricing, driver protection, customer affordability, and operational efficiency.
 */

// ============================================================================
// SECTION A: CORE TYPES & INTERFACES
// ============================================================================

export interface PricingConfig {
  baseFare: number;              // Base fare in dollars
  perMileRate: number;           // Rate per mile
  perMinuteRate: number;         // Rate per minute
  minimumFare: number;           // Minimum fare floor
  bookingFee: number;            // Platform booking fee
  cancellationFee: number;       // Cancellation fee
  
  // Driver protection
  minimumDriverPayout: number;   // Minimum driver gets per trip
  driverPayoutPercentage: number; // Driver's percentage of fare (e.g., 0.80 = 80%)
  
  // Company protection
  minimumCompanyMargin: number;  // Minimum margin percentage
  
  // Traffic multipliers
  lightTrafficMultiplier: number;
  moderateTrafficMultiplier: number;
  heavyTrafficMultiplier: number;
  
  // Zone/special fees
  airportFee: number;
  eventFee: number;
  tollPassthrough: boolean;      // Whether to pass tolls to customer
  
  // Tax rate
  taxRate: number;               // e.g., 0.08 for 8%
  
  // Payment processor fee
  processorFeePercentage: number; // e.g., 0.029 for 2.9%
  processorFeeFixed: number;      // e.g., 0.30 for $0.30 per transaction
}

export interface TripInputs {
  distanceMiles: number;
  estimatedMinutes: number;
  trafficCondition: 'light' | 'moderate' | 'heavy';
  isAirport: boolean;
  isEvent: boolean;
  tollAmount: number;
  demandLevel: 'low' | 'normal' | 'high' | 'surge';
  timeOfDay: 'off-peak' | 'peak' | 'late-night';
  dayOfWeek: 'weekday' | 'weekend';
  rideType: 'economy' | 'comfort' | 'premium' | 'xl';
  promoCode?: string;
  promoDiscountAmount?: number;
  promoDiscountPercentage?: number;
}

export interface FareBreakdown {
  baseFare: number;
  distanceCharge: number;
  timeCharge: number;
  trafficAdjustment: number;
  demandAdjustment: number;
  airportFee: number;
  eventFee: number;
  tollFee: number;
  bookingFee: number;
  subtotal: number;
  discount: number;
  taxAmount: number;
  totalFare: number;
  
  // Tips (calculated separately)
  suggestedTips: {
    fifteen: number;
    twenty: number;
    twentyFive: number;
  };
}

export interface DriverPayout {
  basePayout: number;
  bonusAmount: number;
  tipAmount: number;
  totalPayout: number;
  payoutPercentage: number;
  isProtectedMinimum: boolean;
}

export interface CompanyEconomics {
  customerFare: number;
  processorFee: number;
  driverPayout: number;
  platformCosts: number;
  companyMargin: number;
  marginPercentage: number;
  isProfitable: boolean;
  isMarginProtected: boolean;
}

export interface CompetitorComparison {
  glidewayFare: number;
  uberEstimate: number;
  lyftEstimate: number;
  taxiEstimate: number;
  savings: {
    vsUber: number;
    vsLyft: number;
    vsTaxi: number;
    vsUberPercentage: number;
    vsLyftPercentage: number;
    vsTaxiPercentage: number;
  };
  isPriceCompetitive: boolean;
}

export interface FareCalculationResult {
  breakdown: FareBreakdown;
  driverPayout: DriverPayout;
  companyEconomics: CompanyEconomics;
  competitorComparison: CompetitorComparison;
  guardrails: {
    driverProtected: boolean;
    marginProtected: boolean;
    noLossOnTraffic: boolean;
    discountControlled: boolean;
  };
  priceAdjustmentApplied: 'none' | 'competitive-reduction' | 'minimum-sustainable';
}

// ============================================================================
// SECTION B: DEFAULT PRICING CONFIGURATION
// ============================================================================

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  baseFare: 2.50,
  perMileRate: 1.50,
  perMinuteRate: 0.25,
  minimumFare: 5.00,
  bookingFee: 2.00,
  cancellationFee: 5.00,
  
  minimumDriverPayout: 3.50,
  driverPayoutPercentage: 0.80, // Driver gets 80%
  
  minimumCompanyMargin: 0.10, // 10% minimum margin
  
  lightTrafficMultiplier: 1.0,
  moderateTrafficMultiplier: 1.15,
  heavyTrafficMultiplier: 1.35,
  
  airportFee: 3.00,
  eventFee: 2.00,
  tollPassthrough: true,
  
  taxRate: 0.08,
  
  processorFeePercentage: 0.029,
  processorFeeFixed: 0.30,
};

// Ride type multipliers
const RIDE_TYPE_MULTIPLIERS: Record<string, number> = {
  economy: 1.0,
  comfort: 1.35,
  premium: 2.0,
  xl: 1.75,
};

// Demand level multipliers (surge pricing)
const DEMAND_MULTIPLIERS: Record<string, number> = {
  low: 0.95,
  normal: 1.0,
  high: 1.25,
  surge: 1.75,
};

// Time of day multipliers
const TIME_MULTIPLIERS: Record<string, number> = {
  'off-peak': 1.0,
  'peak': 1.15,
  'late-night': 1.25,
};

// ============================================================================
// SECTION C: CORE FARE CALCULATION
// ============================================================================

/**
 * Calculate the complete fare breakdown
 * Formula: Base + Distance + Time + Traffic + Demand + Fees - Discount + Tax
 */
export function calculateFareBreakdown(
  inputs: TripInputs,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): FareBreakdown {
  const rideMultiplier = RIDE_TYPE_MULTIPLIERS[inputs.rideType] || 1.0;
  const demandMultiplier = DEMAND_MULTIPLIERS[inputs.demandLevel] || 1.0;
  const timeMultiplier = TIME_MULTIPLIERS[inputs.timeOfDay] || 1.0;
  
  // Traffic multiplier
  let trafficMultiplier = config.lightTrafficMultiplier;
  if (inputs.trafficCondition === 'moderate') {
    trafficMultiplier = config.moderateTrafficMultiplier;
  } else if (inputs.trafficCondition === 'heavy') {
    trafficMultiplier = config.heavyTrafficMultiplier;
  }
  
  // Core charges
  const baseFare = config.baseFare * rideMultiplier;
  const distanceCharge = inputs.distanceMiles * config.perMileRate * rideMultiplier;
  const timeCharge = inputs.estimatedMinutes * config.perMinuteRate * rideMultiplier;
  
  // Adjustments
  const trafficAdjustment = (distanceCharge + timeCharge) * (trafficMultiplier - 1);
  const demandAdjustment = (baseFare + distanceCharge + timeCharge) * (demandMultiplier * timeMultiplier - 1);
  
  // Fees
  const airportFee = inputs.isAirport ? config.airportFee : 0;
  const eventFee = inputs.isEvent ? config.eventFee : 0;
  const tollFee = config.tollPassthrough ? inputs.tollAmount : 0;
  const bookingFee = config.bookingFee;
  
  // Subtotal before discount
  const subtotal = baseFare + distanceCharge + timeCharge + trafficAdjustment + 
                   demandAdjustment + airportFee + eventFee + tollFee + bookingFee;
  
  // Calculate discount
  let discount = 0;
  if (inputs.promoDiscountAmount) {
    discount = inputs.promoDiscountAmount;
  } else if (inputs.promoDiscountPercentage) {
    discount = subtotal * inputs.promoDiscountPercentage;
  }
  
  // Apply minimum fare floor
  const fareBeforeTax = Math.max(subtotal - discount, config.minimumFare);
  
  // Tax
  const taxAmount = fareBeforeTax * config.taxRate;
  
  // Total fare
  const totalFare = fareBeforeTax + taxAmount;
  
  // Suggested tips (calculated separately from fare)
  const suggestedTips = {
    fifteen: Math.round(fareBeforeTax * 0.15 * 100) / 100,
    twenty: Math.round(fareBeforeTax * 0.20 * 100) / 100,
    twentyFive: Math.round(fareBeforeTax * 0.25 * 100) / 100,
  };
  
  return {
    baseFare: round(baseFare),
    distanceCharge: round(distanceCharge),
    timeCharge: round(timeCharge),
    trafficAdjustment: round(trafficAdjustment),
    demandAdjustment: round(demandAdjustment),
    airportFee: round(airportFee),
    eventFee: round(eventFee),
    tollFee: round(tollFee),
    bookingFee: round(bookingFee),
    subtotal: round(subtotal),
    discount: round(discount),
    taxAmount: round(taxAmount),
    totalFare: round(totalFare),
    suggestedTips,
  };
}

// ============================================================================
// SECTION D: DRIVER PAYOUT CALCULATION
// ============================================================================

/**
 * Calculate driver payout with protection guardrails
 * Driver payout is ALWAYS protected at minimum level
 */
export function calculateDriverPayout(
  fareBreakdown: FareBreakdown,
  tipAmount: number = 0,
  bonusAmount: number = 0,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): DriverPayout {
  // Base payout is percentage of fare (excluding booking fee and tax)
  const fareForPayout = fareBreakdown.totalFare - fareBreakdown.bookingFee - fareBreakdown.taxAmount;
  let basePayout = fareForPayout * config.driverPayoutPercentage;
  
  // Apply minimum driver payout protection
  const isProtectedMinimum = basePayout < config.minimumDriverPayout;
  if (isProtectedMinimum) {
    basePayout = config.minimumDriverPayout;
  }
  
  // Tips go 100% to driver (calculated separately)
  const totalPayout = basePayout + bonusAmount + tipAmount;
  
  return {
    basePayout: round(basePayout),
    bonusAmount: round(bonusAmount),
    tipAmount: round(tipAmount),
    totalPayout: round(totalPayout),
    payoutPercentage: config.driverPayoutPercentage * 100,
    isProtectedMinimum,
  };
}

// ============================================================================
// SECTION E: COMPANY ECONOMICS CALCULATION
// ============================================================================

/**
 * Calculate company economics and margin
 * Company margin is protected at minimum level
 */
export function calculateCompanyEconomics(
  fareBreakdown: FareBreakdown,
  driverPayout: DriverPayout,
  platformCosts: number = 0.50, // Default platform cost per trip
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): CompanyEconomics {
  const customerFare = fareBreakdown.totalFare;
  
  // Payment processor fee
  const processorFee = (customerFare * config.processorFeePercentage) + config.processorFeeFixed;
  
  // Company revenue after costs
  const companyMargin = customerFare - processorFee - driverPayout.basePayout - platformCosts;
  const marginPercentage = (companyMargin / customerFare) * 100;
  
  const isProfitable = companyMargin > 0;
  const isMarginProtected = marginPercentage >= (config.minimumCompanyMargin * 100);
  
  return {
    customerFare: round(customerFare),
    processorFee: round(processorFee),
    driverPayout: round(driverPayout.basePayout),
    platformCosts: round(platformCosts),
    companyMargin: round(companyMargin),
    marginPercentage: round(marginPercentage),
    isProfitable,
    isMarginProtected,
  };
}

// ============================================================================
// SECTION F: COMPETITOR COMPARISON & SMART PRICING
// ============================================================================

/**
 * Estimate competitor fares and calculate savings
 * GlideWay aims to be 2-3% lower than competitors while maintaining profitability
 */
export function calculateCompetitorComparison(
  inputs: TripInputs,
  glidewayFare: number
): CompetitorComparison {
  // Competitor fare estimation models (simplified)
  // In production, these would use actual API calls or ML models
  
  const baseMiles = inputs.distanceMiles;
  const baseMinutes = inputs.estimatedMinutes;
  
  // Uber estimate: typically $2.50 base + $1.75/mile + $0.35/min + $2.50 booking
  const uberBase = 2.50 + (baseMiles * 1.75) + (baseMinutes * 0.35) + 2.50;
  const uberEstimate = round(uberBase * getDemandMultiplier(inputs.demandLevel, 'uber'));
  
  // Lyft estimate: typically $2.00 base + $1.65/mile + $0.30/min + $2.75 booking  
  const lyftBase = 2.00 + (baseMiles * 1.65) + (baseMinutes * 0.30) + 2.75;
  const lyftEstimate = round(lyftBase * getDemandMultiplier(inputs.demandLevel, 'lyft'));
  
  // Taxi estimate: typically $3.00 base + $2.50/mile + $0.50/min
  const taxiBase = 3.00 + (baseMiles * 2.50) + (baseMinutes * 0.50);
  const taxiEstimate = round(taxiBase);
  
  // Calculate savings
  const savings = {
    vsUber: round(uberEstimate - glidewayFare),
    vsLyft: round(lyftEstimate - glidewayFare),
    vsTaxi: round(taxiEstimate - glidewayFare),
    vsUberPercentage: round(((uberEstimate - glidewayFare) / uberEstimate) * 100),
    vsLyftPercentage: round(((lyftEstimate - glidewayFare) / lyftEstimate) * 100),
    vsTaxiPercentage: round(((taxiEstimate - glidewayFare) / taxiEstimate) * 100),
  };
  
  // Check if price is competitive (2-3% lower than average competitor)
  const avgCompetitor = (uberEstimate + lyftEstimate) / 2;
  const isPriceCompetitive = glidewayFare <= avgCompetitor * 0.97; // At least 3% lower
  
  return {
    glidewayFare,
    uberEstimate,
    lyftEstimate,
    taxiEstimate,
    savings,
    isPriceCompetitive,
  };
}

function getDemandMultiplier(demand: string, competitor: string): number {
  // Competitors have different surge pricing behaviors
  const surgeMultipliers: Record<string, Record<string, number>> = {
    uber: { low: 1.0, normal: 1.0, high: 1.5, surge: 2.5 },
    lyft: { low: 1.0, normal: 1.0, high: 1.4, surge: 2.2 },
  };
  return surgeMultipliers[competitor]?.[demand] || 1.0;
}

// ============================================================================
// SECTION G: SMART COMPETITIVE PRICING RULE
// ============================================================================

/**
 * Apply smart competitive pricing
 * Logic:
 * 1. Calculate GlideWay base fare
 * 2. Compare with competitors
 * 3. If profitable -> reduce by 2-3%
 * 4. If not profitable -> keep minimum sustainable price
 * NEVER go below driver protection level
 */
export function applySmartPricing(
  fareBreakdown: FareBreakdown,
  driverPayout: DriverPayout,
  companyEconomics: CompanyEconomics,
  competitorComparison: CompetitorComparison,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): { adjustedFare: number; adjustment: 'none' | 'competitive-reduction' | 'minimum-sustainable' } {
  
  const currentFare = fareBreakdown.totalFare;
  const avgCompetitor = (competitorComparison.uberEstimate + competitorComparison.lyftEstimate) / 2;
  
  // Target: 2-3% below competitors
  const targetFare = avgCompetitor * 0.975; // 2.5% lower
  
  // Check if we can afford the reduction
  if (companyEconomics.isProfitable && companyEconomics.isMarginProtected) {
    // We have room to reduce
    if (currentFare > targetFare) {
      // Calculate new margin with reduced fare
      const reduction = currentFare - targetFare;
      const newMargin = companyEconomics.companyMargin - reduction;
      const newMarginPercentage = (newMargin / targetFare) * 100;
      
      // Only reduce if we still meet minimum margin
      if (newMarginPercentage >= (config.minimumCompanyMargin * 100)) {
        return { adjustedFare: round(targetFare), adjustment: 'competitive-reduction' };
      }
    }
  }
  
  // If not profitable or can't reduce, use minimum sustainable price
  // Minimum = Driver Payout + Processor Fee + Platform Costs + Minimum Margin
  const minSustainableFare = (
    driverPayout.basePayout + 
    companyEconomics.processorFee + 
    companyEconomics.platformCosts
  ) / (1 - config.minimumCompanyMargin);
  
  if (currentFare < minSustainableFare) {
    return { adjustedFare: round(minSustainableFare), adjustment: 'minimum-sustainable' };
  }
  
  return { adjustedFare: currentFare, adjustment: 'none' };
}

// ============================================================================
// SECTION H: COMPLETE FARE CALCULATION WITH ALL GUARDRAILS
// ============================================================================

/**
 * Complete fare calculation with all guardrails applied
 * Guardrails:
 * - Driver payout ALWAYS protected
 * - Company margin protected
 * - High traffic must NOT create losses
 * - Discounts must be controlled (budget-based)
 */
export function calculateCompleteFare(
  inputs: TripInputs,
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
  maxDiscountBudget: number = 10 // Maximum discount allowed
): FareCalculationResult {
  
  // Step 1: Calculate base fare breakdown
  const breakdown = calculateFareBreakdown(inputs, config);
  
  // Step 2: Apply discount budget control
  if (breakdown.discount > maxDiscountBudget) {
    breakdown.discount = maxDiscountBudget;
    breakdown.totalFare = breakdown.subtotal - breakdown.discount + breakdown.taxAmount;
  }
  
  // Step 3: Calculate driver payout
  const driverPayout = calculateDriverPayout(breakdown, 0, 0, config);
  
  // Step 4: Calculate company economics
  const companyEconomics = calculateCompanyEconomics(breakdown, driverPayout, 0.50, config);
  
  // Step 5: Check competitor comparison
  const competitorComparison = calculateCompetitorComparison(inputs, breakdown.totalFare);
  
  // Step 6: Apply smart pricing adjustment
  const { adjustedFare, adjustment } = applySmartPricing(
    breakdown, driverPayout, companyEconomics, competitorComparison, config
  );
  
  // Update breakdown if fare was adjusted
  if (adjustment !== 'none') {
    const fareRatio = adjustedFare / breakdown.totalFare;
    breakdown.totalFare = adjustedFare;
    breakdown.subtotal = round(breakdown.subtotal * fareRatio);
  }
  
  // Step 7: Recalculate economics with adjusted fare
  const finalDriverPayout = calculateDriverPayout(breakdown, 0, 0, config);
  const finalEconomics = calculateCompanyEconomics(breakdown, finalDriverPayout, 0.50, config);
  const finalComparison = calculateCompetitorComparison(inputs, breakdown.totalFare);
  
  // Step 8: Verify all guardrails
  const guardrails = {
    driverProtected: finalDriverPayout.basePayout >= config.minimumDriverPayout,
    marginProtected: finalEconomics.marginPercentage >= (config.minimumCompanyMargin * 100),
    noLossOnTraffic: finalEconomics.isProfitable,
    discountControlled: breakdown.discount <= maxDiscountBudget,
  };
  
  return {
    breakdown,
    driverPayout: finalDriverPayout,
    companyEconomics: finalEconomics,
    competitorComparison: finalComparison,
    guardrails,
    priceAdjustmentApplied: adjustment,
  };
}

// ============================================================================
// SECTION I: UTILITY FUNCTIONS
// ============================================================================

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Calculate estimated fare for quick display
 */
export function getQuickFareEstimate(
  distanceMiles: number,
  estimatedMinutes: number,
  rideType: 'economy' | 'comfort' | 'premium' | 'xl' = 'economy'
): { low: number; high: number; display: string } {
  const inputs: TripInputs = {
    distanceMiles,
    estimatedMinutes,
    trafficCondition: 'light',
    isAirport: false,
    isEvent: false,
    tollAmount: 0,
    demandLevel: 'normal',
    timeOfDay: 'off-peak',
    dayOfWeek: 'weekday',
    rideType,
  };
  
  const result = calculateCompleteFare(inputs);
  const baseFare = result.breakdown.totalFare;
  
  // Show range: -10% to +20% for uncertainty
  const low = round(baseFare * 0.90);
  const high = round(baseFare * 1.20);
  
  return {
    low,
    high,
    display: `${formatCurrency(low)} - ${formatCurrency(high)}`,
  };
}

/**
 * Get fare estimate with competitor comparison for display
 */
export function getFareWithComparison(inputs: TripInputs): {
  glideway: string;
  uber: string;
  lyft: string;
  taxi: string;
  savings: string;
} {
  const result = calculateCompleteFare(inputs);
  const comparison = result.competitorComparison;
  
  return {
    glideway: formatCurrency(comparison.glidewayFare),
    uber: formatCurrency(comparison.uberEstimate),
    lyft: formatCurrency(comparison.lyftEstimate),
    taxi: formatCurrency(comparison.taxiEstimate),
    savings: `Save ${formatCurrency(comparison.savings.vsUber)} vs Uber (${comparison.savings.vsUberPercentage}%)`,
  };
}
