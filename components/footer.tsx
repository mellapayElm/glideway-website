"use client"

import Link from "next/link"
import { Instagram, Twitter, Linkedin, Facebook, Mail, Phone, MapPin } from "lucide-react"
import { GlidewayIconMark } from "@/components/glideway-logo"

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Book a Ride", href: "#booking" },
  { label: "Ride Types", href: "#ride-types" },
  { label: "Live Tracking", href: "#live-tracking" },
  { label: "Features", href: "#features" },
  { label: "Drive with Us", href: "#drivers" },
  { label: "Support", href: "#contact" },
]

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Three-column grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Col 1 — Wordmark + tagline + socials */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity w-fit">
              <GlidewayIconMark className="w-9 h-9" />
              <div className="flex flex-col leading-none">
                <span className="text-[17px] font-bold tracking-tight text-foreground">
                  Glideway<span className="text-[#22C55E]">Ride</span>
                </span>
                <span className="text-[9px] text-muted-foreground tracking-widest uppercase mt-0.5">
                  Ride Smoothly, Glide Easily
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium transportation built around comfort, safety, efficiency, and trust — available in 100+ cities, 24/7.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <a href="mailto:support@glidewayride.com" className="text-sm text-foreground hover:text-primary transition-colors">
                    support@glidewayride.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                  <a href="tel:+18001234567" className="text-sm text-foreground hover:text-primary transition-colors">
                    +1 (800) 123-4567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Headquarters</p>
                  <p className="text-sm text-foreground">123 Ride Street, Los Angeles, CA 90001</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GlidewayRide. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
