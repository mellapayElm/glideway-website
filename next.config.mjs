:root {
  --bg: #f8fafc;
  --text: #0f172a;
  --muted: #64748b;
  --line: #e2e8f0;
  --panel: #ffffff;
  --dark: #0b1220;
  --dark-2: #16233f;
  --gold: #f4c542;
  --gold-2: #ffd96d;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
a { color: inherit; text-decoration: none; }
.container { width: min(1180px, calc(100% - 32px)); margin: 0 auto; }

.site-header {
  position: sticky; top: 0; z-index: 20;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}
.nav-row { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 16px 0; }
.brand-wrap { display: flex; align-items: center; gap: 12px; }
.brand-mark {
  width: 44px; height: 44px; border-radius: 16px;
  display: grid; place-items: center; font-weight: 800; color: #111827;
  background: linear-gradient(135deg, var(--gold-2), var(--gold));
  box-shadow: 0 10px 20px rgba(244, 197, 66, 0.2);
}
.brand-mark-large { width: 48px; height: 48px; }
.brand-name { font-size: 1.1rem; font-weight: 700; }
.brand-sub { color: var(--muted); font-size: 0.8rem; }
.nav-links, .nav-actions, .hero-actions { display: flex; align-items: center; gap: 12px; }
.nav-links a { color: #475569; font-size: 0.94rem; }
.btn {
  border-radius: 16px; padding: 12px 18px; display: inline-flex; align-items: center; justify-content: center;
  font-weight: 600; border: 1px solid transparent; transition: 0.2s ease;
}
.btn:hover { transform: translateY(-1px); }
.btn-outline { border-color: var(--line); background: white; }
.btn-dark { background: #111827; color: white; }
.btn-gold { background: var(--gold); color: #111827; }
.btn-ghost { border-color: rgba(255,255,255,0.18); color: white; background: rgba(255,255,255,0.06); }
.btn.full { width: 100%; }

.hero {
  color: white;
  background: radial-gradient(circle at top, var(--dark-2), var(--dark) 55%, #060b14);
}
.hero-grid { display: grid; grid-template-columns: 1.08fr 0.92fr; gap: 40px; align-items: center; padding: 72px 0 90px; }
.pill {
  display: inline-flex; align-items: center; padding: 9px 14px; border-radius: 999px;
  font-size: 0.88rem; color: #e5e7eb; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
}
.pill.light { color: #334155; background: white; border-color: var(--line); }
.hero h1 { margin: 20px 0 0; font-size: clamp(3rem, 6vw, 5rem); line-height: 0.98; }
.hero h1 span { color: var(--gold); }
.hero-tagline { margin: 22px 0 10px; font-size: 1.8rem; font-weight: 600; }
.hero-copy { max-width: 720px; font-size: 1.08rem; color: #e2e8f0; line-height: 1.75; }
.hero-copy.muted { color: #cbd5e1; }
.stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 36px; }
.stat-card {
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); border-radius: 24px; padding: 18px;
}
.stat-label { color: #cbd5e1; font-size: 0.92rem; }
.stat-value { font-size: 1.7rem; font-weight: 700; margin-top: 10px; }

.phone-shell { max-width: 335px; margin: 0 auto; background: #020617; border: 1px solid rgba(255,255,255,0.08); border-radius: 36px; padding: 12px; box-shadow: 0 30px 70px rgba(0,0,0,0.35); }
.phone-screen {
  min-height: 640px; border-radius: 28px; padding: 16px; background: radial-gradient(circle at top, #182847, #0b1220 55%, #060b14); color: white;
}
.phone-top { display: flex; justify-content: space-between; font-size: 0.8rem; color: #cbd5e1; }
.live-chip { background: rgba(16,185,129,0.16); color: #86efac; padding: 6px 10px; border-radius: 999px; }
.phone-brand { display: flex; align-items: center; gap: 12px; margin-top: 20px; }
.phone-brand-title { font-size: 1.2rem; font-weight: 700; }
.phone-brand-sub { color: #cbd5e1; font-size: 0.9rem; }
.card { border-radius: 24px; }
.dark-card { margin-top: 22px; padding: 18px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }
.card-kicker { font-size: 0.85rem; color: #94a3b8; }
.card-kicker.dark { color: rgba(17,24,39,0.8); }
.location-box {
  margin-top: 12px; padding: 14px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
}
.fare-box {
  margin-top: 16px; padding: 16px; border-radius: 18px; background: var(--gold); color: #111827; display: flex; justify-content: space-between; align-items: end;
}
.fare-price { font-size: 1.8rem; font-weight: 700; }
.quick-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px; }
.quick-card { text-align: center; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); padding: 14px 10px; }
.driver-card {
  margin-top: 18px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); padding: 18px; display: flex; justify-content: space-between; align-items: center;
}
.driver-name { margin-top: 6px; font-weight: 700; }
.driver-meta { font-size: 0.82rem; color: #cbd5e1; }
.driver-eta { font-weight: 700; }

.section { padding: 56px 0; }
.section-white { background: white; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.white-card { background: white; border: 1px solid var(--line); box-shadow: 0 8px 24px rgba(15,23,42,0.04); }
.big-card { padding: 28px; }
.section h2, .section-white h2, .mission-section h2, .cta-section h2 { margin: 0 0 12px; font-size: clamp(2rem, 4vw, 2.8rem); line-height: 1.1; }
.section h3, .section-white h3, .mission-section h3 { margin: 16px 0 8px; }
.section-text { color: var(--muted); line-height: 1.75; }
.input-grid, .toggle-grid, .feature-mini-grid { display: grid; gap: 14px; }
.input-grid { grid-template-columns: 1fr 1fr; margin-top: 18px; }
label { display: block; margin-bottom: 8px; font-size: 0.92rem; font-weight: 600; }
input {
  width: 100%; padding: 13px 14px; border-radius: 16px; border: 1px solid var(--line); background: white; font: inherit;
}
.ride-list { display: grid; gap: 12px; margin-top: 18px; }
.ride-item {
  display: flex; justify-content: space-between; gap: 18px; align-items: flex-start; border-radius: 18px; border: 1px solid var(--line); padding: 16px;
}
.ride-item.active { background: #111827; color: white; border-color: #111827; }
.ride-name { font-weight: 700; }
.ride-desc, .ride-eta { color: var(--muted); font-size: 0.92rem; }
.ride-item.active .ride-desc, .ride-item.active .ride-eta { color: #cbd5e1; }
.ride-price { font-weight: 700; }
.toggle-grid { grid-template-columns: 1fr 1fr; margin-top: 18px; }
.toggle-card {
  border: 1px solid var(--line); border-radius: 18px; padding: 16px; display: flex; justify-content: space-between; align-items: center; gap: 16px;
}
.toggle-title { font-weight: 700; }
.toggle-desc { color: var(--muted); font-size: 0.9rem; }
.toggle-on {
  width: 48px; height: 28px; border-radius: 999px; background: #111827; position: relative; flex: 0 0 auto;
}
.toggle-on::after {
  content: ''; width: 20px; height: 20px; border-radius: 50%; background: white; position: absolute; right: 4px; top: 4px;
}
.total-box {
  margin-top: 18px; border-radius: 24px; background: #111827; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 20px;
}
.total-price { font-size: 2rem; font-weight: 700; margin-top: 4px; }
.gold-badge { background: var(--gold); color: #111827; padding: 8px 12px; border-radius: 999px; font-weight: 700; }

.map-box {
  position: relative; margin-top: 20px; height: 260px; overflow: hidden; border-radius: 28px; border: 1px solid var(--line);
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}
.map-box::before, .map-box::after {
  content: ''; position: absolute; border-radius: 999px; background: #cbd5e1;
}
.map-box::before { width: 85%; height: 14px; left: 7%; top: 46%; transform: rotate(-17deg); }
.map-box::after { width: 72%; height: 12px; left: 15%; top: 28%; transform: rotate(11deg); background: #e2e8f0; }
.map-label {
  position: absolute; padding: 12px; border-radius: 18px; border: 1px solid var(--line); background: rgba(255,255,255,0.92); box-shadow: 0 12px 20px rgba(15,23,42,0.06);
}
.map-label small { display: block; color: var(--muted); margin-bottom: 4px; }
.top-left { left: 20px; top: 20px; }
.bottom-right { right: 20px; bottom: 20px; }
.car-pin {
  position: absolute; left: 46%; top: 45%; width: 42px; height: 42px; border-radius: 50%; background: var(--gold); color: #111827; display: grid; place-items: center; font-weight: 800; box-shadow: 0 12px 24px rgba(244,197,66,0.3);
}
.feature-mini-grid { grid-template-columns: 1fr 1fr; margin-top: 18px; }
.mini-card { border: 1px solid var(--line); border-radius: 18px; padding: 16px; display: grid; gap: 8px; }
.mini-card span { color: var(--muted); font-size: 0.92rem; line-height: 1.55; }

.section-intro { max-width: 720px; }
.pillars-grid, .three-grid { display: grid; gap: 18px; }
.pillars-grid { grid-template-columns: repeat(4, 1fr); margin-top: 28px; }
.pillar-card, .info-card, .support-card, .about-card { padding: 22px; }
.icon-box {
  width: 48px; height: 48px; border-radius: 16px; display: grid; place-items: center; background: #f1f5f9; font-weight: 800; color: #334155;
}
.pillar-card p, .info-card ul, .support-card p { color: var(--muted); line-height: 1.7; }
.three-grid { grid-template-columns: repeat(3, 1fr); margin-top: 28px; }
.info-card ul, .dark-panel ul { padding-left: 18px; margin: 12px 0 0; }
.info-card li, .dark-panel li { margin-top: 8px; }
.about-grid { align-items: start; }
.about-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.about-card { font-weight: 700; }

.mission-section {
  padding: 56px 0; background: #0b1220; color: white;
}
.dark-panel {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 24px; color: white;
}
.dark-panel p, .dark-panel li { color: #cbd5e1; }
.auth-grid { align-items: start; }
.auth-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f1f5f9; border-radius: 18px; padding: 6px; margin-top: 18px; }
.auth-tab { text-align: center; padding: 10px 12px; border-radius: 14px; font-weight: 700; color: #475569; }
.auth-tab.active { background: white; color: #111827; border: 1px solid var(--line); }
.form-stack { display: grid; gap: 16px; margin-top: 18px; }
.support-stack { display: grid; gap: 16px; }

.cta-section { padding: 56px 0; background: white; }
.cta-box {
  display: flex; justify-content: space-between; align-items: center; gap: 24px; padding: 30px; border-radius: 32px; color: white;
  background: radial-gradient(circle at top, var(--dark-2), var(--dark) 55%, #060b14);
  border: 1px solid rgba(255,255,255,0.08);
}
.cta-box p { color: #cbd5e1; max-width: 760px; line-height: 1.75; }
.site-footer { border-top: 1px solid var(--line); background: #f8fafc; padding: 40px 0; }
.footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; color: var(--muted); }
.footer-brand { color: #0f172a; }
.footer-grid h4 { margin: 0 0 10px; color: #0f172a; }
.footer-grid p { margin: 8px 0; }

@media (max-width: 980px) {
  .nav-links, .nav-actions { display: none; }
  .hero-grid, .two-col, .three-grid, .pillars-grid, .footer-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .cta-box { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 640px) {
  .input-grid, .toggle-grid, .feature-mini-grid, .about-cards, .stats-grid { grid-template-columns: 1fr; }
  .hero-grid { padding: 52px 0 64px; }
  .big-card, .cta-box { padding: 22px; }
  .section, .section-white, .mission-section, .cta-section { padding: 42px 0; }
}
