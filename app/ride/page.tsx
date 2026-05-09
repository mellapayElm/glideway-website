'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MapPin, Navigation, Clock, DollarSign, MessageCircle, Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const socket = io('http://localhost:5000');

export default function RidePage() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideType, setRideType] = useState('Standard');
  const [distance, setDistance] = useState('3.2 mi');
  const [duration, setDuration] = useState('12 min');
  const [fare, setFare] = useState(12.50);
  const [rideStatus, setRideStatus] = useState('Ready to book');
  const [step, setStep] = useState<'search' | 'booking' | 'waiting' | 'accepted' | 'arrived' | 'started' | 'completed'>('search');
  
  const [driverInfo, setDriverInfo] = useState<any>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');
  const [rideId, setRideId] = useState('');

  const rideTypes = [
    { name: 'Standard', icon: '🚗', seats: 4, est: '12 min', price: 12.50 },
    { name: 'Comfort', icon: '🚙', seats: 4, est: '10 min', price: 15.75 },
    { name: 'Family', icon: '🚐', seats: 6, est: '14 min', price: 18.00 },
    { name: 'Premium', icon: '🚘', seats: 4, est: '8 min', price: 24.99 }
  ];

  useEffect(() => {
    socket.on('connect', () => {
      console.log('[v0] Rider connected:', socket.id);
    });

    socket.on('rideAccepted', (data: any) => {
      console.log('[v0] Ride accepted:', data);
      setDriverInfo(data.driver);
      setStep('accepted');
      setRideStatus('Driver accepted your ride');
    });

    socket.on('driverLocation', (location: any) => {
      console.log('[v0] Driver location:', location);
      setDriverInfo(prev => prev ? { ...prev, ...location } : location);
    });

    socket.on('driverArrived', () => {
      setStep('arrived');
      setRideStatus('Driver has arrived');
    });

    socket.on('tripStarted', () => {
      setStep('started');
      setRideStatus('Trip in progress');
    });

    socket.on('tripCompleted', () => {
      setStep('completed');
      setRideStatus('Trip completed');
    });

    socket.on('receiveChatMessage', (msg: any) => {
      setChatMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('connect');
      socket.off('rideAccepted');
      socket.off('driverLocation');
      socket.off('driverArrived');
      socket.off('tripStarted');
      socket.off('tripCompleted');
      socket.off('receiveChatMessage');
    };
  }, []);

  const handleBookRide = async () => {
    if (!pickup || !dropoff) {
      alert('Please enter pickup and dropoff locations');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/rides/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup,
          dropoff,
          rideType,
          fare,
          distance,
          duration
        })
      });

      const data = await response.json();
      if (data.success) {
        setRideId(data.rideId);
        setStep('waiting');
        setRideStatus('Looking for nearby drivers...');
      }
    } catch (error) {
      console.error('[v0] Error booking ride:', error);
    }
  };

  const sendMessage = () => {
    if (chatText.trim()) {
      socket.emit('sendChatMessage', {
        rideId,
        text: chatText,
        sender: 'rider',
        senderName: 'You'
      });
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'rider',
        senderName: 'You',
        text: chatText
      }]);
      setChatText('');
    }
  };

  // Booking Search View
  if (step === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white p-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Booking Form */}
          <Card className="bg-white border-green-200 shadow-lg h-fit">
            <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-200">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <MapPin className="w-5 h-5 text-green-500" />
                Book Your Ride
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">Enter your pickup and destination to get an instant fare estimate</p>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {/* Pickup */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Pickup Location</label>
                <div className="flex items-center gap-2 p-3 border border-green-300 rounded-lg bg-white">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <Input
                    type="text"
                    placeholder="Enter pickup address"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="border-0 focus:ring-0 text-gray-900 placeholder:text-gray-500 p-0"
                  />
                </div>
                <button className="text-xs text-green-600 hover:text-green-700 font-medium">📍 Use current location</button>
              </div>

              {/* Dropoff */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Destination</label>
                <div className="flex items-center gap-2 p-3 border border-red-300 rounded-lg bg-white">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <Input
                    type="text"
                    placeholder="Enter destination address"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    className="border-0 focus:ring-0 text-gray-900 placeholder:text-gray-500 p-0"
                  />
                </div>
              </div>

              {/* Ride Type Selection */}
              <div className="space-y-3 py-4 border-t border-green-200">
                <p className="text-sm font-medium text-gray-700">Choose your ride</p>
                <div className="grid grid-cols-2 gap-2">
                  {rideTypes.map((type) => (
                    <button
                      key={type.name}
                      onClick={() => {
                        setRideType(type.name);
                        setFare(type.price);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        rideType === type.name
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <p className="text-xs font-medium text-gray-900">{type.name}</p>
                      <p className="text-xs text-gray-500">{type.seats} seats</p>
                      <p className="text-xs text-green-600 font-medium">${type.price.toFixed(2)}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fare Breakdown */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Distance:</span>
                  <span className="text-gray-900 font-medium">{distance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Estimated time:</span>
                  <span className="text-gray-900 font-medium">{duration}</span>
                </div>
                <div className="border-t border-green-200 pt-2 flex justify-between">
                  <span className="text-gray-900 font-medium">Estimated Fare:</span>
                  <span className="text-lg font-bold text-green-600">${fare.toFixed(2)}</span>
                </div>
              </div>

              {/* Safety Info */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium">Your Safety Matters</p>
                  <p className="mt-1">✓ All drivers background checked • ✓ Real-time trip tracking • ✓ 24/7 support</p>
                </div>
              </div>

              <Button
                onClick={handleBookRide}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-base py-6"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Book Ride Now
              </Button>
            </CardContent>
          </Card>

          {/* Right: Map Display */}
          <div className="space-y-6">
            {/* Demo Map */}
            <Card className="bg-white border-green-200 shadow-lg overflow-hidden h-96">
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center relative">
                {/* Simple route visualization */}
                <div className="absolute inset-0 p-4">
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    {/* Route line */}
                    <polyline
                      points="100,50 150,120 200,180 300,300"
                      fill="none"
                      stroke="url(#routeGradient)"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                    {/* Pickup marker */}
                    <circle cx="100" cy="50" r="12" fill="#22c55e" />
                    <circle cx="100" cy="50" r="6" fill="white" />
                    
                    {/* Dropoff marker */}
                    <circle cx="300" cy="300" r="12" fill="#ef4444" />
                    <circle cx="300" cy="300" r="6" fill="white" />
                    
                    {/* Route info */}
                    <text x="200" y="380" textAnchor="middle" fontSize="14" fill="#1f2937" fontWeight="bold">
                      {distance} • {duration}
                    </text>
                  </svg>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
                  <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full shadow text-xs text-gray-700">
                    <MapPin className="w-3 h-3 text-green-500" /> Pickup
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full shadow text-xs text-gray-700">
                    <MapPin className="w-3 h-3 text-red-500" /> Dropoff
                  </div>
                </div>
              </div>
            </Card>

            {/* Nearby Drivers */}
            <Card className="bg-white border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-200">
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-green-500" />
                  Nearby Drivers Available
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                            {String.fromCharCode(64 + i)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Driver {i}</p>
                            <p className="text-xs text-gray-500">{3 + i} min away</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-gray-900">⭐ {(4.8 + Math.random() * 0.2).toFixed(1)}</p>
                          <p className="text-xs text-gray-500">{Math.floor(Math.random() * 500) + 100} trips</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Active Ride View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto p-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Map */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-green-500 shadow-2xl overflow-hidden h-96">
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-green-900 flex items-center justify-center relative">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="liveRoute" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points="100,50 150,120 200,180 300,300"
                    fill="none"
                    stroke="url(#liveRoute)"
                    strokeWidth="3"
                  />
                  <circle cx="200" cy="180" r="15" fill="#22c55e" opacity="0.8" />
                  <circle cx="200" cy="180" r="8" fill="white" />
                  <circle cx="100" cy="50" r="10" fill="#22c55e" />
                  <circle cx="300" cy="300" r="10" fill="#ef4444" />
                </svg>
              </div>
            </Card>
          </div>

          {/* Ride Status & Driver Info */}
          <div className="space-y-4">
            {/* Driver Card */}
            {driverInfo ? (
              <Card className="bg-gray-800 border-green-500">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-700">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
                      {driverInfo.name?.[0] || 'D'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{driverInfo.name}</p>
                      <p className="text-xs text-gray-400">⭐ {driverInfo.rating || '4.92'}</p>
                    </div>
                  </div>

                  <div className="text-white space-y-2 text-sm">
                    <p><span className="text-gray-400">Vehicle:</span> {driverInfo.car}</p>
                    <p><span className="text-gray-400">Plate:</span> {driverInfo.plate}</p>
                    <p><span className="text-gray-400">Color:</span> {driverInfo.color}</p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-700">
                    <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Status Card */}
            <Card className="bg-gray-800 border-green-500">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white text-lg">{rideStatus}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="text-white space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ride ID:</span>
                    <span className="font-mono">{rideId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400 font-medium">{step.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fare:</span>
                    <span className="text-lg font-bold text-green-400">${fare.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="bg-gray-800 border-green-500">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white text-sm">Chat with Driver</CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3 max-h-40 overflow-y-auto">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'rider' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2 rounded-lg max-w-xs text-sm ${
                      msg.sender === 'rider' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Message driver..."
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
              />
              <Button
                onClick={sendMessage}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
