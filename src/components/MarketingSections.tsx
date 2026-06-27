import React from 'react';
import { ShieldCheck, Truck, Award, Handshake, ArrowRight, Star, Heart, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function TrustPillars() {
  const pillars = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-100',
      accentColor: 'from-blue-500/10 to-transparent',
      title: '100% Direct Import',
      description: 'We source straight from verified manufacturers. No middleman markup — only premium standard-grade items at factory prices.',
    },
    {
      icon: <Truck className="h-6 w-6" />,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50 border-amber-100',
      accentColor: 'from-amber-500/10 to-transparent',
      title: 'Super-Speed Logistics',
      description: '2-day delivery inside Dhaka, 3-day delivery across Bangladesh with real-time digital parcel tracking on every order.',
    },
    {
      icon: <Award className="h-6 w-6" />,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-100',
      accentColor: 'from-emerald-500/10 to-transparent',
      title: '7-Day Easy Returns',
      description: 'Peace of mind guaranteed. Any product not matching specifications or showing physical fault is replaced within 7 days.',
    },
    {
      icon: <Handshake className="h-6 w-6" />,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50 border-violet-100',
      accentColor: 'from-violet-500/10 to-transparent',
      title: 'Cash On Delivery BD-Wide',
      description: 'Zero upfront risk. Unpack, verify, and pay right at your doorstep — anywhere across all 64 districts of Bangladesh.',
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-white to-slate-50/80 border-y border-slate-200/80 overflow-hidden">
      {/* Subtle top decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-[0.18em]">
              CHINAMATI ASSURANCE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-sans leading-tight">
            Why Thousands of Smart
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Buyers Trust Us
            </span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed max-w-xl mx-auto font-sans">
            As direct importers, we manage every step — from factory floor testing to your doorstep handoff.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative group bg-white border border-slate-200/80 rounded-[24px] p-7 overflow-hidden hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300"
            >
              {/* Corner accent glow */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${p.accentColor} rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl border ${p.iconBg} ${p.iconColor} mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {p.icon}
              </div>

              {/* Content */}
              <h3 className="text-sm font-bold text-slate-900 font-sans tracking-tight mb-2">
                {p.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed font-sans">
                {p.description}
              </p>

              {/* Bottom check mark */}
              <div className="mt-5 pt-4 border-t border-slate-100/80 flex items-center gap-1.5">
                <CheckCircle className={`h-3.5 w-3.5 ${p.iconColor} flex-shrink-0`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Guaranteed</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats row */}
        <div className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
          {[
            { value: '10,000+', label: 'Orders Delivered' },
            { value: '4.8 / 5', label: 'Customer Rating' },
            { value: '64 / 64', label: 'Districts Covered' },
          ].map((s, i) => (
            <div key={i} className="space-y-1">
              <p className="text-xl sm:text-2xl font-black text-slate-900 font-sans tracking-tight">{s.value}</p>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export function DTCSpotlight({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="dtc-spotlight-section">
      <div className="relative bg-slate-950 rounded-[40px] overflow-hidden border border-slate-800/80">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-12 lg:p-16 items-center relative z-10">

          {/* Main Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-[0.15em]">
                DTC — Direct to Consumer Revolution
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight font-sans">
              Aspirational Worth.
              <br />
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-200 bg-clip-text text-transparent">
                Direct Factory Prices.
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-sans">
              Standard retail outlets add up to 60% markup through multi-tier distribution channels, trade brokers, and showroom rents. We eliminate every layer of cost waste — delivering industrial-grade materials at entry-level prices.
            </p>

            <div className="grid grid-cols-3 gap-4 border-t border-white/[0.07] pt-6 max-w-lg">
              {[
                { label: 'PRODUCT GRADES', value: 'A+ Materials', color: 'text-white' },
                { label: 'LOCAL SAVINGS', value: 'Up to 45%', color: 'text-emerald-400' },
                { label: 'RATED FEEDBACK', value: '4.8★ Avg', color: 'text-amber-300' },
              ].map((s, i) => (
                <div key={i} className={i > 0 ? 'border-l border-white/[0.07] pl-4' : ''}>
                  <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{s.label}</p>
                  <p className={`text-base sm:text-lg font-extrabold mt-0.5 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <button
              onClick={onExplore}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs tracking-widest uppercase rounded-2xl transition-all cursor-pointer focus:outline-none font-mono shadow-lg"
            >
              <span>Browse Direct Catalogues</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Feature Cards */}
          <div className="lg:col-span-5 space-y-4">
            {[
              {
                icon: <Star className="h-5 w-5 text-amber-300 fill-amber-300" />,
                title: 'Rigorous Quality Validation',
                desc: 'Every batch undergoes multiple cycle trials for lithium battery retention and physical stress before leaving global assembly.',
              },
              {
                icon: <Heart className="h-5 w-5 text-red-400 fill-red-400" />,
                title: '10,000+ Happy Families',
                desc: 'From home chefs in Chattogram to developers in Dhaka — helping Bangladesh simplify modern household management.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-5 backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-200"
              >
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl flex-shrink-0">
                    {card.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white font-sans">{card.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans">{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
