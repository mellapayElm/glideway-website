"use client"

import { useState } from "react"

interface PaymentMethod {
  id: string
  type: "card" | "apple_pay" | "google_pay" | "cash" | "paypal"
  name: string
  icon: string
  details?: string
  isDefault?: boolean
}

interface PromoCode {
  code: string
  discount: string
  expiry: string
  active: boolean
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "1", type: "card", name: "Visa", details: "****4242", icon: "visa", isDefault: true },
  { id: "2", type: "card", name: "Mastercard", details: "****8888", icon: "mastercard" },
  { id: "3", type: "apple_pay", name: "Apple Pay", icon: "apple" },
  { id: "4", type: "google_pay", name: "Google Pay", icon: "google" },
  { id: "5", type: "cash", name: "Cash", icon: "cash" },
]

const PROMO_CODES: PromoCode[] = [
  { code: "GLIDE10", discount: "10% off", expiry: "Expires Apr 30", active: true },
  { code: "WELCOME50", discount: "$5 off first ride", expiry: "Expires May 15", active: true },
]

export function PaymentsScreen() {
  const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS)
  const [showAddCard, setShowAddCard] = useState(false)
  const [promoCodes] = useState(PROMO_CODES)
  const [newPromoCode, setNewPromoCode] = useState("")
  const [walletBalance] = useState(25.50)

  const setDefaultPayment = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(m => ({ ...m, isDefault: m.id === id }))
    )
  }

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method.icon) {
      case "visa":
        return (
          <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
        )
      case "mastercard":
        return (
          <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">MC</span>
          </div>
        )
      case "apple":
        return (
          <div className="w-10 h-6 bg-black rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
        )
      case "google":
        return (
          <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
        )
      case "cash":
        return (
          <div className="w-10 h-6 bg-emerald-100 rounded flex items-center justify-center">
            <span className="text-emerald-600 text-lg">$</span>
          </div>
        )
      default:
        return (
          <div className="w-10 h-6 bg-gray-200 rounded" />
        )
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Payment</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Wallet Balance */}
        <div className="m-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">GlideWay Wallet</p>
          <p className="text-3xl font-bold mb-4">${walletBalance.toFixed(2)}</p>
          <div className="flex gap-3">
            <button className="flex-1 bg-white/20 backdrop-blur py-2 rounded-lg font-medium text-sm">
              Add Money
            </button>
            <button className="flex-1 bg-white/20 backdrop-blur py-2 rounded-lg font-medium text-sm">
              Withdraw
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-900">Payment Methods</h2>
            <button 
              onClick={() => setShowAddCard(true)}
              className="text-emerald-600 text-sm font-medium"
            >
              + Add New
            </button>
          </div>

          <div className="bg-white rounded-xl overflow-hidden divide-y divide-gray-100">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setDefaultPayment(method.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                {getPaymentIcon(method)}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{method.name}</p>
                  {method.details && (
                    <p className="text-sm text-gray-500">{method.details}</p>
                  )}
                </div>
                {method.isDefault ? (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    Default
                  </span>
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Promo Codes */}
        <div className="px-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Promo Codes</h2>
          
          {/* Add Promo Code */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newPromoCode}
              onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="flex-1 px-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
            />
            <button className="px-4 py-3 bg-emerald-500 text-white font-medium rounded-xl">
              Apply
            </button>
          </div>

          {/* Active Promos */}
          <div className="space-y-2">
            {promoCodes.map((promo) => (
              <div
                key={promo.code}
                className="bg-white rounded-xl p-4 border border-dashed border-emerald-300 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{promo.code}</p>
                  <p className="text-sm text-emerald-600">{promo.discount}</p>
                </div>
                <p className="text-xs text-gray-500">{promo.expiry}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="px-4 pb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Recent Transactions</h2>
          <div className="bg-white rounded-xl overflow-hidden divide-y divide-gray-100">
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Trip to Business Ave</p>
                <p className="text-xs text-gray-500">Today, 2:30 PM</p>
              </div>
              <p className="font-semibold text-gray-900">-$18.50</p>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Added to Wallet</p>
                <p className="text-xs text-gray-500">Yesterday, 11:00 AM</p>
              </div>
              <p className="font-semibold text-emerald-600">+$50.00</p>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Trip to Airport</p>
                <p className="text-xs text-gray-500">Mar 18, 9:15 AM</p>
              </div>
              <p className="font-semibold text-gray-900">-$65.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl">
            <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">Add Payment Method</h2>
              <button 
                onClick={() => setShowAddCard(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                />
              </div>

              <button 
                onClick={() => setShowAddCard(false)}
                className="w-full py-4 bg-emerald-500 text-white font-semibold rounded-xl"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
