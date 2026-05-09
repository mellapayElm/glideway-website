'use client';

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { MapPin, Navigation, AlertCircle, MessageCircle, Phone, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const socket = io('http://localhost:5000');

export default function DriverApp() {
  const [online, setOnline] = useState(false);
  const [ride, setRide] = useState<any>(null);
  const [status, setStatus] = useState('Offline');
  const [step, setStep] = useState<'waiting' | 'requested' | 'accepted' | 'arrived' | 'started' | 'completed'>('waiting');
  
  const [location, setLocation] = useState<{lat: number; lng: number; accuracy?: number}>({
    lat: 38.8339,
    lng: -104.8214
  });
  
  const [earnings, setEarnings] = useState(342.50);
  const [tripsToday, setTripsToday] = useState(8);
  const [rating, setRating] = useState(4.92);
  
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');
  
  const watchId = useRef<number | null>(null);
  const lastLocation = useRef<{lat: number; lng: number} | null>(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('[v0] Driver connected:', socket.id);
    });

    socket.on('newRideRequest', (rideData: any) => {
      console.log('[v0] New ride request:', rideData);
      setRide(rideData);
      setStep('requested');
      setStatus('New Ride Request!');
      
      // Play notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
      audio.play().catch(e => console.log('[v0] Audio play failed:', e));
    });

    socket.on('rideAccepted', (data: any) => {
      console.log('[v0] Ride accepted by driver:', data);
      setStep('accepted');
      setStatus('Accepted - Head to pickup');
    });

    socket.on('receiveChatMessage', (msg: any) => {
      console.log('[v0] Chat message from rider:', msg);
      setChatMessages(prev => [...prev, msg]);
    });

    // Start GPS tracking
    if (navigator.geolocation) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocation(newLoc);
          lastLocation.current = newLoc;
          
          // Emit location to server
          socket.emit('updateLocation', newLoc);
        },
        (error) => {
          console.log('[v0] Geolocation error:', error);
          // Demo mode - simulate movement
          const demoInterval = setInterval(() => {
            setLocation(prev => ({
              lat: prev.lat + (Math.random() - 0.5) * 0.001,
              lng: prev.lng + (Math.random() - 0.5) * 0.001
            }));
          }, 2000);
          return () => clearInterval(demoInterval);
        }
      );
    }

    return () => {
      socket.off('connect');
      socket.off('newRideRequest');
      socket.off('rideAccepted');
      socket.off('receiveChatMessage');
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  const toggleOnline = () => {
    setOnline(!online);
    setStatus(online ? 'Offline' : 'Online - Accepting rides');
    socket.emit('driverStatusChange', { online: !online });
  };

  const acceptRide = () => {
    if (ride) {
      socket.emit('acceptRide', { rideId: ride.rideId });
      setStep('accepted');
      setStatus('Heading to pickup...');
    }
  };

  const declineRide = () => {
    setRide(null);
    setStep('waiting');
    setStatus('Online - Accepting rides');
  };

  const arrivedAtPickup = () => {
    setStep('arrived');
    setStatus('Arrived at pickup - Waiting for rider');
    socket.emit('arrivedAtPickup', { rideId: ride?.rideId });
  };

  const startTrip = () => {
    setStep('started');
    setStatus('Trip in progress');
    socket.emit('startTrip', { rideId: ride?.rideId });
  };

  const completeTrip = () => {
    setStep('completed');
    setStatus('Trip completed');
    socket.emit('completeTrip', { rideId: ride?.rideId });
    setEarnings(earnings + (ride?.fare || 10));
    setTripsToday(tripsToday + 1);
    
    setTimeout(() => {
      setRide(null);
      setStep('waiting');
      setStatus('Online - Accepting rides');
      setChatMessages([]);
    }, 3000);
  };

  const sendMessage = () => {
    if (chatText.trim() && ride) {
      socket.emit('sendChatMessage', {
        rideId: ride.rideId,
        text: chatText,
        sender: 'driver',
        senderName: 'Driver'
      });
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'driver',
        senderName: 'Driver',
        text: chatText
      }]);
      setChatText('');
    }
  };

  // Ride Request Alert
  if (ride && step === 'requested') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex items-center justify-center">
        <div className="max-w-md w-full space-y-4">
          {/* Alert */}
          <Card className="bg-green-900 border-green-500 shadow-2xl">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-6xl animate-bounce">🚨</div>
              <h2 className="text-2xl font-bold text-white">New Ride Request!</h2>
              
              <div className="bg-green-800 rounded-lg p-4 space-y-3">
                <div className="text-white space-y-2">
                  <p className="text-sm text-green-100">From: {ride.pickup || 'Unknown'}</p>
                  <p className="text-sm text-green-100">To: {ride.dropoff || 'Unknown'}</p>
                  <p className="text-lg font-bold text-green-300">${ride.fare?.toFixed(2) || '10.00'}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={declineRide}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Decline
                </Button>
                <Button
                  onClick={acceptRide}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  Accept
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Driver Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-8 h-8 text-green-500" />
            Driver Dashboard
          </h1>
          <Button
            onClick={toggleOnline}
            className={`${online ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 hover:bg-gray-700'} text-white px-6 py-2 text-lg`}
          >
            {online ? '🟢 Online' : '⚫ Offline'}
          </Button>
        </div>

        {/* Status Badge */}
        <Card className="bg-blue-900 border-blue-500 mb-6">
          <CardContent className="p-4">
            <p className="text-white text-lg font-medium">{status}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Map and Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Map */}
            <Card className="bg-gray-800 border-green-500 shadow-lg overflow-hidden h-96">
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-green-900 flex items-center justify-center relative p-4">
                {/* Simple GPS visualization */}
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <radialGradient id="gpsRadar" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  
                  {/* Radar circles */}
                  <circle cx="200" cy="200" r="100" fill="url(#gpsRadar)" />
                  <circle cx="200" cy="200" r="100" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.5" />
                  <circle cx="200" cy="200" r="70" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
                  
                  {/* Current location */}
                  <circle cx="200" cy="200" r="12" fill="#22c55e" />
                  <circle cx="200" cy="200" r="6" fill="white" />
                  
                  {/* Nearby drivers */}
                  <circle cx="150" cy="120" r="8" fill="#3b82f6" opacity="0.7" />
                  <circle cx="280" cy="180" r="8" fill="#3b82f6" opacity="0.7" />
                  <circle cx="220" cy="320" r="8" fill="#3b82f6" opacity="0.7" />

                  {/* GPS info */}
                  <text x="200" y="380" textAnchor="middle" fontSize="12" fill="#93c5fd" fontFamily="monospace">
                    Lat: {location.lat.toFixed(4)} Lng: {location.lng.toFixed(4)}
                  </text>
                </svg>

                {/* GPS Status */}
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Live GPS
                </div>
              </div>
            </Card>

            {/* Current Ride Info */}
            {ride && step !== 'waiting' && (
              <Card className="bg-gray-800 border-green-500">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-white">Current Ride</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded p-3">
                      <p className="text-gray-400 text-xs mb-1">From</p>
                      <p className="text-white font-medium">{ride.pickup?.substring(0, 20)}...</p>
                    </div>
                    <div className="bg-gray-700 rounded p-3">
                      <p className="text-gray-400 text-xs mb-1">To</p>
                      <p className="text-white font-medium">{ride.dropoff?.substring(0, 20)}...</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {step === 'accepted' && (
                      <Button
                        onClick={arrivedAtPickup}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Arrived at Pickup
                      </Button>
                    )}
                    {step === 'arrived' && (
                      <Button
                        onClick={startTrip}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        Start Trip
                      </Button>
                    )}
                    {step === 'started' && (
                      <Button
                        onClick={completeTrip}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        Complete Trip
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Stats & Chat */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-3">
              <Card className="bg-gray-800 border-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">Today's Earnings</p>
                      <p className="text-2xl font-bold text-green-400">${earnings.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">Trips Today</p>
                      <p className="text-2xl font-bold text-blue-400">{tripsToday}</p>
                    </div>
                    <Navigation className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-yellow-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">Rating</p>
                      <p className="text-2xl font-bold text-yellow-400">⭐ {rating}</p>
                    </div>
                    <Award className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat */}
            {ride && step !== 'waiting' && (
              <Card className="bg-gray-800 border-green-500">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat with Rider
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3 max-h-40 overflow-y-auto">
                  {chatMessages.length === 0 && (
                    <p className="text-gray-500 text-xs text-center py-2">No messages yet</p>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'driver' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-2 rounded-lg max-w-xs text-sm ${
                        msg.sender === 'driver' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-100'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </CardContent>

                <div className="p-3 border-t border-gray-700 flex gap-2">
                  <Input
                    type="text"
                    placeholder="Message rider..."
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
              </Card>
            )}

            {/* Safety Info */}
            <Card className="bg-blue-900 border-blue-500">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Safety Center
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs">
                  🆘 SOS
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs">
                  📍 Share Trip
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
