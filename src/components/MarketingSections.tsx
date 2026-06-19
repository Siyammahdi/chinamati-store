import React from 'react';
import { ShieldCheck, Truck, Sparkles, Award, Star, ArrowRight, Handshake, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export function TrustPillars() {
  const pillars = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
      title: "100% Direct Import",
      description: "We source straight from verified manufacturers. No middleman markup, ensuring premium standard grade catalog items."
    },
    {
      icon: <Truck className="h-6 w-6 text-amber-500" />,
      title: "Super-Speed Logistics",
      description: "Guaranteed 2-day delivery inside Dhaka and 3-day delivery across outer Bangladesh zones with real-time digital parcel tracking."
    },
    {
      icon: <Award className="h-6 w-6 text-emerald-500" />,
      title: "7-Day Easy Returns",
      description: "Peace of mind guaranteed. If a product does not match specifications or shows physical fault, our team replaces it under 7 days."
    },
    {
      icon: <Handshake className="h-6 w-6 text-indigo-500" />,
      title: "Cash On Delivery All Over BD",
      description: "Zero upfront risk. Unpack, verify your newly delivered hardware, and pay right at your doorstep anywhere in Bangladesh."
    }
  ];

  return (
    <section className="bg-white border-y border-slate-100" id="trust-pillars-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-mono font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            CHINAMATI ASSURANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-3 font-sans italic">
            Why Hundreds of Smart Buyers Trust Us
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
            As direct importers, we manage the entire lifecycle from factory floor testing to last-mile courier handoff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl space-y-4 hover:border-slate-200 hover:bg-white transition-all duration-300"
            >
              <div className="p-3 bg-white rounded-2xl w-fit border border-slate-100 shadow-sm">
                {p.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 font-sans tracking-tight">
                  {p.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed font-sans">
                  {p.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DTCSpotlight({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="dtc-spotlight-section">
      <div className="bg-slate-950 rounded-[40px] overflow-hidden relative border border-slate-800">
        {/* Subtle decorative radial light background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-blue-500/10 via-transparent to-transparent pointer-events-none select-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none select-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-12 lg:p-16 items-center">
          
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] text-amber-300 rounded-full text-[10px] font-medium tracking-widest uppercase border border-white/[0.08] select-none">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>DTC (Direct to Consumer) Revolution</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
                Aspirational Worth.<br />
                <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-200 bg-clip-text text-transparent">
                  Direct Factory Prices.
                </span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-sans font-medium">
                Standard retail outlets add up to a 60% markup through multi-tier distribution channels, trade brokers, and offline showroom rents. Our business model eliminates every layer of cost waste. By serving you directly, you receive industrial-grade materials at entry level prices.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-6 max-w-lg">
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">PRODUCT GRADES</p>
                <p className="text-base sm:text-lg font-extrabold text-white mt-0.5">A+ Materials</p>
              </div>
              <div className="border-l border-white/[0.08] pl-4">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">LOCAL SAVINGS</p>
                <p className="text-base sm:text-lg font-extrabold text-emerald-400 mt-0.5">Up to 45%</p>
              </div>
              <div className="border-l border-white/[0.08] pl-4">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">CERTIFIED FEEDBACK</p>
                <p className="text-base sm:text-lg font-extrabold text-white mt-0.5">4.8★ Avg</p>
              </div>
            </div>

            {/* Call to action */}
            <div className="pt-2">
              <button
                onClick={onExplore}
                className="group px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer flex items-center gap-2 font-mono"
              >
                <span>Browse Direct Catalogues</span>
                <ArrowRight className="h-4 w-4 text-slate-950 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Graphical/Illustrative side (Feature badges) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl w-fit">
                  <Star className="h-5 w-5 text-amber-300 fill-amber-300" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-sans">Rigorous Quality Validation</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans">
                    Every batch undergoes multiple cycle trials for lithium battery retention and high physical stress before leaving global assembly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl w-fit">
                  <Heart className="h-5 w-5 text-red-400 fill-red-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-sans">10k+ Happy Families</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans">
                    From home chefs in Chattogram to developers in Dhaka, we are helping Bangladesh simplify modern household management.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
