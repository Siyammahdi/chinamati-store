import { ArrowRight, ShieldCheck, Truck, Star, Zap, Package, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onScrollToProducts: () => void;
  onViewProduct?: (productId: string) => void;
}

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '4.8★', label: 'Avg Rating' },
  { value: '64', label: 'Districts Served' },
];

const badges = [
  { icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />, text: '7-Day Returns' },
  { icon: <Truck className="h-3.5 w-3.5 text-sky-400" />, text: 'Free Dhaka Delivery' },
  { icon: <Package className="h-3.5 w-3.5 text-violet-400" />, text: 'Cash on Delivery' },
];

export default function Hero({ onScrollToProducts, onViewProduct }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#07090f] min-h-[92vh] flex flex-col justify-center">

      {/* ── Layered Background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Primary radial glow — blue */}
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[120px]" />
        {/* Secondary glow — violet */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[100px]" />
        {/* Accent glow — cyan */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/6 rounded-full blur-[80px]" />

        {/* Ultra-fine dot grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
          }}
        />

        {/* Top-edge thin gradient line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ── LEFT: Copy & CTAs ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-8 text-left"
          >
            {/* Category pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.18em]">
                DESIGN MEETS COMFORT — 2026 EDITION
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-white font-sans">
                Smart Picks
                <br />
                <span
                  className="bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent animate-gradient-x"
                  style={{ backgroundSize: '200% auto' }}
                >
                  Lowest Prices.
                </span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-md font-sans font-normal mt-4">
                Bangladesh's premier direct importer of space-saving home items, quality kitchen tools, and daily smart electronics — straight from factory to your doorstep.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onViewProduct?.('prod-iw9f8')}
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-slate-900 font-bold text-xs tracking-widest uppercase rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_4px_30px_rgba(255,255,255,0.12)] hover:shadow-[0_6px_40px_rgba(255,255,255,0.18)] cursor-pointer focus:outline-none font-mono"
              >
                <span className="relative z-10">View Featured Product</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={onScrollToProducts}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.1] hover:border-white/[0.2] font-bold text-xs tracking-widest uppercase rounded-2xl transition-all cursor-pointer focus:outline-none font-mono backdrop-blur-sm"
              >
                <span>Browse All Items</span>
                <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-y-0.5" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm"
                >
                  {b.icon}
                  <span className="text-[11px] font-semibold text-slate-400 font-sans">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.06] max-w-sm">
              {stats.map((s, i) => (
                <div key={i} className={i > 0 ? 'pl-4 border-l border-white/[0.06]' : ''}>
                  <p className="text-xl font-black text-white tracking-tight font-sans">{s.value}</p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Product Showcase ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[480px] sm:min-h-[520px] select-none"
          >
            {/* Ambient background glow behind product */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] animate-subtle-glow" />
            </div>

            {/* Ground shadow */}
            <div
              className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-52 h-6 bg-black/60 rounded-full blur-xl animate-shadow-breath"
            />

            {/* Floating spec badges */}
            <div className="absolute top-[15%] -right-4 sm:right-4 z-20 hidden sm:block">
              <div className="glass-dark px-4 py-3 rounded-2xl border border-white/[0.08] shadow-2xl backdrop-blur-xl">
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-wider font-bold">POWER</p>
                <p className="text-xs font-bold text-white mt-0.5 font-sans">USB Rechargeable</p>
              </div>
            </div>

            <div className="absolute bottom-[22%] -left-4 sm:left-2 z-20 hidden sm:block">
              <div className="glass-dark px-4 py-3 rounded-2xl border border-white/[0.08] shadow-2xl backdrop-blur-xl">
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-wider font-bold">CAPACITY</p>
                <p className="text-xs font-bold text-white mt-0.5 font-sans">50 kg Maximum</p>
              </div>
            </div>

            {/* Price tag badge */}
            <div className="absolute top-[12%] left-[8%] z-20">
              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 rounded-full shadow-lg shadow-emerald-500/30">
                <Zap className="h-3.5 w-3.5 text-white fill-white" />
                <span className="text-xs font-black text-white font-sans">Only ৳350</span>
                <span className="text-[10px] text-emerald-200 line-through font-normal">৳550</span>
              </div>
            </div>

            {/* Rating badge */}
            <div className="absolute bottom-[18%] right-[5%] sm:right-8 z-20">
              <div className="glass-dark px-3.5 py-2.5 rounded-2xl border border-white/[0.08] backdrop-blur-xl shadow-xl flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">4.8</span>
              </div>
            </div>

            {/* Main product image — floating */}
            <div
              onClick={() => onViewProduct?.('prod-iw9f8')}
              className="relative z-10 cursor-pointer animate-float"
              title="Click to view product details"
            >
              <img
                src="https://res.cloudinary.com/dttbj6a0m/image/upload/v1778881324/file_00000000f77471faac1106016103d10b_rvbw8r.png"
                alt="Portable Electronic Scale"
                referrerPolicy="no-referrer"
                className="w-72 sm:w-80 h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:scale-[1.04] transition-transform duration-700 ease-out"
              />
            </div>

            {/* Product label below */}
            <div className="relative z-10 text-center mt-6 space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Featured Product</p>
              <p className="text-sm font-bold text-slate-300 font-sans">Portable Electronic Scale</p>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Bottom edge scroll indicator */}
      <button
        onClick={onScrollToProducts}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer focus:outline-none group"
      >
        <span className="text-[9px] font-mono tracking-widest uppercase font-bold">Scroll to Shop</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </button>

    </section>
  );
}
