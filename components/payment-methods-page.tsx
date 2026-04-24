'use client';

import { useState } from 'react';
import { CreditCard, Plus, X, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'cash';
  lastFour?: string;
  brand?: string;
  balance?: number;
  isDefault: boolean;
}

interface PaymentMethodsPageProps {
  onBack?: () => void;
}

export function PaymentMethodsPage({ onBack }: PaymentMethodsPageProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      lastFour: '4242',
      brand: 'Visa',
      isDefault: true,
    },
    {
      id: '2',
      type: 'wallet',
      balance: 25.50,
      isDefault: false,
    },
    {
      id: '3',
      type: 'cash',
      isDefault: false,
    },
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const handleAddCard = () => {
    if (cardData.number && cardData.expiry && cardData.cvc && cardData.name) {
      const lastFour = cardData.number.slice(-4);
      const newMethod: PaymentMethod = {
        id: String(methods.length + 1),
        type: 'card',
        lastFour,
        brand: 'Visa',
        isDefault: false,
      };
      setMethods([...methods, newMethod]);
      setCardData({ number: '', expiry: '', cvc: '', name: '' });
      setShowAddCard(false);
    }
  };

  const setDefault = (id: string) => {
    setMethods(methods.map(m => ({
      ...m,
      isDefault: m.id === id,
    })));
  };

  const removeMethod = (id: string) => {
    if (methods.length > 1) {
      setMethods(methods.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" className="text-gray-300 mb-2" onClick={onBack}>
          <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
          Back
        </Button>
      )}
      <div>
        <h2 className="text-2xl font-bold text-white">Payment Methods</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your payment options for rides</p>
      </div>

      {/* Payment Methods List */}
      <div className="space-y-3">
        {methods.map(method => (
          <div
            key={method.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-emerald-500/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                {method.type === 'card' && (
                  <>
                    <p className="font-semibold text-white">{method.brand} ending in {method.lastFour}</p>
                    <p className="text-xs text-gray-500">Credit Card</p>
                  </>
                )}
                {method.type === 'wallet' && (
                  <>
                    <p className="font-semibold text-white">GlideWay Wallet</p>
                    <p className="text-xs text-emerald-400">${method.balance?.toFixed(2)} balance</p>
                  </>
                )}
                {method.type === 'cash' && (
                  <>
                    <p className="font-semibold text-white">Cash</p>
                    <p className="text-xs text-gray-500">Pay driver directly</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {method.isDefault && (
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <p className="text-xs text-emerald-400 font-semibold">Default</p>
                </div>
              )}
              {!method.isDefault && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDefault(method.id)}
                  className="text-gray-400 hover:text-emerald-400"
                >
                  Set Default
                </Button>
              )}
              {methods.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeMethod(method.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Card Section */}
      {!showAddCard ? (
        <Button
          onClick={() => setShowAddCard(true)}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Payment Method
        </Button>
      ) : (
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-3">
          <h3 className="font-semibold text-white">Add Credit Card</h3>
          <Input
            placeholder="Card Number"
            value={cardData.number}
            onChange={(e) => setCardData({...cardData, number: e.target.value.replace(/\D/g, '').slice(0, 16)})}
            className="bg-slate-900 border-slate-600 text-white"
            maxLength={16}
          />
          <Input
            placeholder="Cardholder Name"
            value={cardData.name}
            onChange={(e) => setCardData({...cardData, name: e.target.value})}
            className="bg-slate-900 border-slate-600 text-white"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="MM/YY"
              value={cardData.expiry}
              onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
              className="bg-slate-900 border-slate-600 text-white"
              maxLength={5}
            />
            <Input
              placeholder="CVC"
              value={cardData.cvc}
              onChange={(e) => setCardData({...cardData, cvc: e.target.value.replace(/\D/g, '').slice(0, 3)})}
              className="bg-slate-900 border-slate-600 text-white"
              maxLength={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAddCard}
              className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
            >
              <Check className="w-4 h-4 mr-2" />
              Add Card
            </Button>
            <Button
              onClick={() => setShowAddCard(false)}
              variant="outline"
              className="flex-1 h-10"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Wallet Section */}
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-white">GlideWay Wallet</p>
            <p className="text-sm text-emerald-400">Current balance: $25.50</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
            Add Funds
          </Button>
        </div>
      </div>
    </div>
  );
}
