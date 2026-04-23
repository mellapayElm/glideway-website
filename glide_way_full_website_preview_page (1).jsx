import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  CarTaxiFront,
  ShieldCheck,
  Clock3,
  Route,
  Phone,
  MessageSquare,
  CreditCard,
  Navigation,
  MapPin,
  Users,
  Briefcase,
  Building2,
  CheckCircle2,
  Globe,
  Star,
  ChevronRight,
  Bell,
  Car,
  Wallet,
  LogIn,
  UserPlus,
  Menu,
  BadgeCheck,
  FileCheck,
  DollarSign,
  Download,
} from "lucide-react";

const rideTypes = [
  { name: "Economy", eta: "3 min", price: 14.5, desc: "Affordable everyday rides" },
  { name: "Comfort", eta: "5 min", price: 19.75, desc: "Extra space and premium comfort" },
  { name: "XL", eta: "6 min", price: 27.9, desc: "For groups and airport luggage" },
  { name: "Priority", eta: "2 min", price: 23.5, desc: "Fastest pickup available" },
];

const features = [
  { title: "Comfort", text: "Smooth rides designed for peace and a premium travel experience.", icon: CarTaxiFront },
  { title: "Safety", text: "Calm, controlled travel with verified drivers and protected communication.", icon: ShieldCheck },
  { title: "Efficiency", text: "Quick pickup, smart dispatch, and no-delay route optimization.", icon: Clock3 },
  { title: "Trust", text: "Reliable service, transparent pricing, and professional support.", icon: CheckCircle2 },
];

const liveFeed = [
  "Ride #GW-1042 matched with driver Daniel M.",
  "Payment authorized for $23.50.",
  "Driver arriving in 3 minutes.",
  "Refund queue: 1 open review.",
];

function PhonePreview() {
  return (
    <div className="mx-auto w-full max-w-[330px] rounded-[36px] border border-white/10 bg-slate-950 p-3 shadow-2xl shadow-black/30">
      <div className="min-h-[640px] rounded-[28px] bg-[radial-gradient(circle_at_top,_#182847,_#0b1220_55%,_#060b14)] p-4 text-white">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>9:41</span>
          <Badge className="rounded-full bg-emerald-500/20 text-emerald-300 border-0">Live trip</Badge>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 font-bold text-slate-950">G</div>
          <div>
            <p className="text-xl font-semibold">GlideWay</p>
            <p className="text-sm text-slate-300">Ride Smoothly, Glide Easily</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="text-sm text-slate-300">Live ride</p>
          <div className="mt-3 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Airport Terminal A</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">Downtown Marriott Hotel</div>
          </div>
          <div className="mt-4 rounded-2xl bg-amber-400 p-4 text-slate-950">
            <p className="text-sm">Priority ride</p>
            <div className="mt-1 flex items-end justify-between">
              <p className="text-2xl font-semibold">$23.50</p>
              <p className="text-sm">Driver en route</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"><ShieldCheck className="mx-auto h-4 w-4 text-amber-400" /><p className="mt-2 text-xs text-slate-300">Safe</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"><Phone className="mx-auto h-4 w-4 text-amber-400" /><p className="mt-2 text-xs text-slate-300">Call</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"><MessageSquare className="mx-auto h-4 w-4 text-amber-400" /><p className="mt-2 text-xs text-slate-300">Chat</p></div>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-300">Driver arriving</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar><AvatarFallback>DM</AvatarFallback></Avatar>
              <div>
                <p className="font-medium">Daniel M.</p>
                <p className="text-xs text-slate-300">Toyota Camry • RDX-204</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">3 min</p>
              <p className="text-xs text-slate-300">ETA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GlideWayFullWebsitePreviewPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pickup, setPickup] = useState("Airport Terminal A");
  const [dropoff, setDropoff] = useState("Downtown Marriott Hotel");
  const [selectedRide, setSelectedRide] = useState(0);
  const [businessRide, setBusinessRide] = useState(false);
  const [saveCard, setSaveCard] = useState(true);
  const ride = rideTypes[selectedRide];
  const total = useMemo(() => (ride.price + (businessRide ? 4.25 : 0)).toFixed(2), [ride, businessRide]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 font-bold text-slate-950 shadow-sm">G</div>
            <div>
              <p className="text-lg font-semibold">GlideWay</p>
              <p className="text-xs text-slate-500">www.glidewayride.com</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#home" className="text-sm text-slate-600 hover:text-slate-900">Home</a>
            <a href="#book" className="text-sm text-slate-600 hover:text-slate-900">Book</a>
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900">Features</a>
            <a href="#driver" className="text-sm text-slate-600 hover:text-slate-900">Drive with Us</a>
            <a href="#admin" className="text-sm text-slate-600 hover:text-slate-900">Admin</a>
            <a href="#auth" className="text-sm text-slate-600 hover:text-slate-900">Login / Register</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button variant="outline" className="rounded-2xl"><LogIn className="mr-2 h-4 w-4" />Login</Button>
            <Button className="rounded-2xl bg-slate-900 hover:bg-slate-800"><UserPlus className="mr-2 h-4 w-4" />Register</Button>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden"><Menu className="h-6 w-6" /></button>
        </div>
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm">
              <a href="#home">Home</a>
              <a href="#book">Book</a>
              <a href="#features">Features</a>
              <a href="#driver">Drive with Us</a>
              <a href="#admin">Admin</a>
              <a href="#auth">Login / Register</a>
            </div>
          </div>
        )}
      </header>

      <section id="home" className="bg-[radial-gradient(circle_at_top,_#16233f,_#0b1220_55%,_#060b14)] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="rounded-full border-white/10 bg-white/10 px-4 py-2 text-slate-100">Premium Ride Platform</Badge>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">Glide<span className="text-amber-400">Way</span></h1>
            <p className="mt-5 text-2xl font-medium">Ride Smoothly, Glide Easily</p>
            <p className="mt-3 max-w-2xl text-lg text-slate-200">Move with peace. Ride with purpose. Smooth rides. Trusted journeys. Where every ride flows.</p>
            <p className="mt-6 max-w-2xl text-slate-300">A complete ride platform with booking, driver onboarding, live trip support, admin operations, compliance visibility, and payment workflows.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-2xl bg-amber-400 px-6 text-slate-950 hover:bg-amber-300">Book a Ride</Button>
              <Button variant="outline" className="rounded-2xl border-white/20 bg-white/5 px-6 text-white hover:bg-white/10">Drive with GlideWay</Button>
              <Button variant="outline" className="rounded-2xl border-white/20 bg-white/5 px-6 text-white hover:bg-white/10"><Download className="mr-2 h-4 w-4" />Download App</Button>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[["Average pickup", "4 min"],["Driver rating", "4.9/5"],["Support", "24/7"],["Business rides", "Available"]].map(([label, value]) => (
                <div key={String(label)} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-sm text-slate-300">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <PhonePreview />
          </motion.div>
        </div>
      </section>

      <section id="book" className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Book your ride in seconds</CardTitle>
              <CardDescription>Easy booking with live estimate, premium ride choices, and secure checkout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Pickup location</Label>
                  <div className="relative"><MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><Input value={pickup} onChange={(e) => setPickup(e.target.value)} className="rounded-2xl pl-9" /></div>
                </div>
                <div className="space-y-2">
                  <Label>Drop-off location</Label>
                  <div className="relative"><Navigation className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><Input value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="rounded-2xl pl-9" /></div>
                </div>
              </div>
              <div className="grid gap-3">
                {rideTypes.map((item, idx) => (
                  <button key={item.name} onClick={() => setSelectedRide(idx)} className={`rounded-2xl border p-4 text-left transition ${selectedRide === idx ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div><p className="font-semibold">{item.name}</p><p className={`mt-1 text-sm ${selectedRide === idx ? "text-slate-300" : "text-slate-500"}`}>{item.desc}</p></div>
                      <div className="text-right"><p className="font-semibold">${item.price.toFixed(2)}</p><p className={`text-xs ${selectedRide === idx ? "text-slate-300" : "text-slate-500"}`}>{item.eta}</p></div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-4"><div><p className="font-medium">Business ride</p><p className="text-sm text-slate-500">Priority support and receipts</p></div><Switch checked={businessRide} onCheckedChange={setBusinessRide} /></div></div>
                <div className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-4"><div><p className="font-medium">Save payment method</p><p className="text-sm text-slate-500">Secure future checkout</p></div><Switch checked={saveCard} onCheckedChange={setSaveCard} /></div></div>
              </div>
              <div className="rounded-3xl bg-slate-900 p-5 text-white">
                <div className="flex items-center justify-between gap-4"><div><p className="text-sm text-slate-300">Estimated total</p><p className="mt-1 text-3xl font-semibold">${total}</p></div><Badge className="rounded-full border-0 bg-amber-400 text-slate-950">{ride.eta} away</Badge></div>
                <Button className="mt-4 w-full rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300">Confirm Booking</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Live GPS and communication</CardTitle>
              <CardDescription>Customer and driver access with GPS, chat, calling, and ride alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="relative h-[260px] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 260" fill="none"><path d="M40 205C100 182 120 140 190 128C268 115 318 170 390 142C470 112 502 75 560 48" stroke="#cbd5e1" strokeWidth="14" strokeLinecap="round" /><path d="M100 40C145 86 175 108 255 102C330 96 388 72 452 80C498 86 532 111 558 160" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" /></svg>
                <div className="absolute left-8 top-8 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm"><p className="text-xs text-slate-500">Pickup point</p><p className="font-semibold">Airport Terminal A</p></div>
                <div className="absolute right-8 bottom-8 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm"><p className="text-xs text-slate-500">Destination</p><p className="font-semibold">Downtown Marriott</p></div>
                <div className="absolute left-[42%] top-[44%] flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-lg"><Car className="h-5 w-5" /></div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center gap-3"><Phone className="h-5 w-5 text-slate-700" /><div><p className="font-medium">In-app call</p><p className="text-sm text-slate-500">Private communication without sharing personal numbers</p></div></div></div>
                <div className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-slate-700" /><div><p className="font-medium">In-app chat</p><p className="text-sm text-slate-500">Quick coordination for pickup, arrival, and delays</p></div></div></div>
                <div className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center gap-3"><Route className="h-5 w-5 text-slate-700" /><div><p className="font-medium">Driver navigation</p><p className="text-sm text-slate-500">Traffic-aware route guidance for faster, smoother trips</p></div></div></div>
                <div className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center gap-3"><Bell className="h-5 w-5 text-slate-700" /><div><p className="font-medium">Live ride alerts</p><p className="text-sm text-slate-500">Accepted, arriving, started, and completed notifications</p></div></div></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="features" className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="rounded-full bg-slate-100 text-slate-700">Why GlideWay</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Built around comfort, safety, efficiency, and trust</h2>
            <p className="mt-3 text-slate-600">A premium website and app experience created to make every ride smooth, calm, and dependable.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((item) => {
              const Icon = item.icon;
              return <Card key={item.title} className="rounded-3xl border-slate-200 shadow-sm"><CardContent className="p-6"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"><Icon className="h-5 w-5 text-slate-700" /></div><h3 className="mt-4 text-xl font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></CardContent></Card>;
            })}
          </div>
        </div>
      </section>

      <section id="driver" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Drive with GlideWay</CardTitle>
                <CardDescription>Professional onboarding with documents, safety checks, and admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-4"><FileCheck className="h-5 w-5 text-slate-700" /><p className="mt-3 font-medium">License & ID</p><p className="mt-1 text-sm text-slate-500">Upload driver license and identity documents securely.</p></div>
                  <div className="rounded-2xl border border-slate-200 p-4"><Car className="h-5 w-5 text-slate-700" /><p className="mt-3 font-medium">Vehicle details</p><p className="mt-1 text-sm text-slate-500">Insurance, registration, vehicle type, and safety checks.</p></div>
                  <div className="rounded-2xl border border-slate-200 p-4"><ShieldCheck className="h-5 w-5 text-slate-700" /><p className="mt-3 font-medium">Background review</p><p className="mt-1 text-sm text-slate-500">Compliance review, driving history, and activation workflow.</p></div>
                  <div className="rounded-2xl border border-slate-200 p-4"><DollarSign className="h-5 w-5 text-slate-700" /><p className="mt-3 font-medium">Payout onboarding</p><p className="mt-1 text-sm text-slate-500">Tax-ready payout flow and approved driver activation.</p></div>
                </div>
                <Button className="mt-5 rounded-2xl bg-slate-900 hover:bg-slate-800">Start Driver Application</Button>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Driver dashboard preview</CardTitle>
                <CardDescription>Accept rides, navigate, communicate, and track earnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-slate-900 p-5 text-white"><p className="text-sm text-slate-300">Driver status</p><p className="mt-1 text-2xl font-semibold">Online and accepting rides</p><div className="mt-4 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-white/10 p-3"><p className="text-xs text-slate-300">Today</p><p className="text-lg font-semibold">$246</p></div><div className="rounded-2xl bg-white/10 p-3"><p className="text-xs text-slate-300">Trips</p><p className="text-lg font-semibold">14</p></div><div className="rounded-2xl bg-white/10 p-3"><p className="text-xs text-slate-300">Rating</p><p className="text-lg font-semibold">4.96</p></div></div></div>
                <div className="rounded-2xl border border-slate-200 p-4"><p className="font-medium">Incoming request</p><p className="mt-1 text-sm text-slate-500">Airport Terminal A → Downtown Marriott • $18.50</p><div className="mt-4 flex gap-3"><Button className="rounded-2xl bg-slate-900 hover:bg-slate-800">Accept</Button><Button variant="outline" className="rounded-2xl">Decline</Button></div></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="admin" className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl"><Badge className="rounded-full bg-slate-100 text-slate-700">Super Admin</Badge><h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Live operations, compliance, accounting, and management</h2><p className="mt-3 text-slate-600">A professional control center for driver approvals, ride operations, payments, refunds, and business reporting.</p></div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Card className="rounded-3xl border-slate-200 shadow-sm"><CardHeader><CardTitle>Live event feed</CardTitle><CardDescription>Realtime operations overview</CardDescription></CardHeader><CardContent className="space-y-3">{liveFeed.map((item, idx) => <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{item}</div>)}</CardContent></Card>
            <Card className="rounded-3xl border-slate-200 shadow-sm"><CardHeader><CardTitle>Admin modules</CardTitle><CardDescription>Compliance and business oversight</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 p-4"><BadgeCheck className="h-5 w-5 text-slate-700" /><p className="mt-3 font-medium">Driver approvals</p><p className="mt-1 text-sm text-slate-500">Review documents, verify photos, approve or reject.</p></div><div className="rounded-2xl border border-slate-200 p-4"><ShieldCheck className="h-5 w-5 text-slate-700" /><p className="mt-3 font-medium">Compliance</p><p className="mt-1 text-sm text-slate-500">Insurance, registration, expirations, and safety flags.</p></div><div className="rounded-2xl border border-slate-200 p-4"><Wallet className="h-5 w-5 text-slate-700" /><p className="mt-3 font-medium">Accounting</p><p className="mt-1 text-sm text-slate-500">Revenue, refunds, processor fees, payouts, and reporting.</p></div><div className="rounded-2xl border border-slate-200 p-4"><Building2 className="h-5 w-5 text-slate-700" /><p className="mt-3 font-medium">Management</p><p className="mt-1 text-sm text-slate-500">Fleet status, support cases, ride volume, and operations.</p></div></CardContent></Card>
          </div>
        </div>
      </section>

      <section id="auth" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <CardHeader><CardTitle>Login and registration</CardTitle><CardDescription>Professional access for riders, drivers, and business users</CardDescription></CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-2xl"><TabsTrigger value="login">Login</TabsTrigger><TabsTrigger value="register">Register</TabsTrigger></TabsList>
                  <TabsContent value="login" className="mt-5 space-y-4"><div className="space-y-2"><Label>Email or phone</Label><Input placeholder="Enter your email or phone" className="rounded-2xl" /></div><div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="Enter your password" className="rounded-2xl" /></div><Button className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800">Login</Button></TabsContent>
                  <TabsContent value="register" className="mt-5 space-y-4"><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>First name</Label><Input className="rounded-2xl" /></div><div className="space-y-2"><Label>Last name</Label><Input className="rounded-2xl" /></div></div><div className="space-y-2"><Label>Email</Label><Input className="rounded-2xl" /></div><div className="space-y-2"><Label>Phone number</Label><Input className="rounded-2xl" /></div><div className="space-y-2"><Label>Password</Label><Input type="password" className="rounded-2xl" /></div><Button className="w-full rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300">Create Account</Button></TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <div className="grid gap-4"><Card className="rounded-3xl border-slate-200"><CardContent className="p-6"><div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"><ShieldCheck className="h-5 w-5 text-slate-700" /></div><div><h3 className="text-lg font-semibold">Secure customer access</h3><p className="mt-2 text-sm text-slate-600">Protected login, saved payment methods, trip history, and live support.</p></div></div></CardContent></Card><Card className="rounded-3xl border-slate-200"><CardContent className="p-6"><div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"><Briefcase className="h-5 w-5 text-slate-700" /></div><div><h3 className="text-lg font-semibold">Business rides</h3><p className="mt-2 text-sm text-slate-600">Corporate bookings, invoicing, account management, and reporting.</p></div></div></CardContent></Card><Card className="rounded-3xl border-slate-200"><CardContent className="p-6"><div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"><CreditCard className="h-5 w-5 text-slate-700" /></div><div><h3 className="text-lg font-semibold">Payments and receipts</h3><p className="mt-2 text-sm text-slate-600">Secure card checkout, digital receipts, and refund workflows.</p></div></div></CardContent></Card></div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6 lg:px-8">
          <div><p className="text-lg font-semibold text-slate-900">GlideWay</p><p className="mt-2 text-sm text-slate-600">Ride Smoothly, Glide Easily</p><p className="mt-2 text-sm text-slate-500">www.glidewayride.com</p></div>
          <div><p className="font-medium text-slate-900">Quick Links</p><div className="mt-3 space-y-2 text-sm text-slate-500"><p>Book a Ride</p><p>Drive with Us</p><p>Business Rides</p><p>Safety</p></div></div>
          <div><p className="font-medium text-slate-900">Contact</p><div className="mt-3 space-y-2 text-sm text-slate-500"><p>support@glidewayride.com</p><p>help@glidewayride.com</p><p>24/7 ride support</p></div></div>
        </div>
      </footer>
    </div>
  );
}
