import { ArrowRight, ShieldCheck, Check, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onScrollToProducts: () => void;
  onViewProduct?: (productId: string) => void;
}

export default function Hero({ onScrollToProducts, onViewProduct }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-[#090a0f] text-white py-20 pb-28 pt-24 border-b border-white/[0.04] min-h-[85vh] flex flex-col justify-center">
      
      {/* Soft and Sophisticated Studio Keyframes */}
      <style>{`
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shadow-breath {
          0%, 100% { transform: scale(1); opacity: 0.2; filter: blur(20px); }
          50% { transform: scale(1.1); opacity: 0.35; filter: blur(28px); }
        }
        @keyframes subtle-glow {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Elegant Ambient Studio Backdrops */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft center-right spotlight */}
        <div 
          className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/[0.03] rounded-full blur-[140px] mix-blend-screen"
        />
        {/* Soft secondary warm ambient fill light */}
        <div 
          className="absolute top-1/3 left-[40%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-slate-400/[0.02] rounded-full blur-[120px] mix-blend-screen"
        />
        {/* Ultra-subtle linear grid with gradient fade */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
          style={{ maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 80%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 80%, transparent 100%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Pure form luxury copy & minimal cues */}
          <motion.div 
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-8 text-left"
          >
            
            {/* Minimalist Tech Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] text-slate-300 rounded-full text-[10px] font-medium tracking-widest uppercase border border-white/[0.05] select-none">
              <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-slate-400 text-[9px]">DESIGN MEETS COMFORT — 2026 EDITION</span>
            </div>

            {/* Aspirational Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
                Pure form.<br />
                <span className="bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-transparent italic font-black">
                  Perfect function.
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg font-sans">
                A powerful, compact, wireless food processor. Chopping ingredients is now faster and easier with just a single key click. Great for garlic, ginger, pepper, onion, vegetables, and small meats.
              </p>
            </div>

            {/* Direct primary checkout CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <button
                onClick={() => onViewProduct?.('prod-iw9f8')}
                className="group px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_4px_24px_rgba(255,255,255,0.08)] font-mono"
              >
                <span>View Electronic Scale</span>
                <ArrowRight className="h-4.5 w-4.5 text-slate-950 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={onScrollToProducts}
                className="px-8 py-4 bg-transparent hover:bg-white/[0.02] text-slate-300 border border-white/[0.1] hover:border-white/[0.18] font-bold text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center font-mono"
              >
                <span>Explore Catalog</span>
              </button>
            </div>

            {/* Highly refined minimal inline trust indicators */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.04] max-w-xl">
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">WARRANTY</p>
                <p className="text-xs font-bold text-slate-300 mt-1">7-Day Return</p>
              </div>
              <div className="border-l border-white/[0.04] pl-4">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">DELIVERY</p>
                <p className="text-xs font-bold text-slate-300 mt-1">Free inside Dhaka</p>
              </div>
              <div className="border-l border-white/[0.04] pl-4">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">PAYMENT</p>
                <p className="text-xs font-bold text-slate-300 mt-1">Cash on Delivery</p>
              </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: Soft studio display with elegant shadow & depth */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex flex-col items-center justify-center py-8 min-h-[440px] sm:min-h-[500px] select-none"
          >
            
            {/* The primary shadow emitter beneath the product */}
            <div 
              className="absolute bottom-12 w-48 h-8 bg-black/80 rounded-full blur-xl pointer-events-none"
              style={{ 
                animation: 'shadow-breath 5s infinite ease-in-out',
                opacity: 0.35 
              }} 
            />

            {/* Very soft glowing pedestal reflection */}
            <div 
              className="absolute bottom-16 w-36 h-[2px] bg-white/[0.08] blur-xs rounded-full pointer-events-none"
            />

            {/* THE FLAGSHIP GADGET */}
            <div 
              onClick={() => onViewProduct?.('prod-iw9f8')}
              className="relative z-20 cursor-pointer group transition-all duration-500"
              style={{ animation: 'float-subtle 5s infinite ease-in-out' }}
              title="Click to view garlic chopper details"
            >
              {/* Product main shadow overlay */}
              <div className="relative">
                {/* Master studio backdrop glow - extremely soft */}
                <div 
                  className="absolute inset-[-40px] bg-gradient-to-tr from-sky-400/[0.02] to-slate-100/[0.05] rounded-full blur-[60px] pointer-events-none group-hover:opacity-100 transition-opacity" 
                  style={{ animation: 'subtle-glow 6s infinite ease-in-out' }}
                />

                {/* Main Product Image with subtle 3D lighting feel */}
                <img
                  src="https://res.cloudinary.com/dttbj6a0m/image/upload/v1778881324/file_00000000f77471faac1106016103d10b_rvbw8r.png"
                  alt="USB Rechargeable Electric Garlic Chopper"
                  referrerPolicy="no-referrer"
                  className="w-40 sm:w-48 h-auto rounded-2xl object-contain relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                {/* Absolute minimal spec tag badge - clean glassmorphism */}
                <div className="absolute top-2 -right-12 z-25 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/[0.06] shadow-xl text-left hidden sm:block">
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block font-bold">POWER SYSTEM</span>
                  <p className="text-[10px] font-bold text-white font-sans mt-0.5">Removeable Battery</p>
                </div>

                <div className="absolute bottom-12 -left-16 z-25 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/[0.06] shadow-xl text-left hidden sm:block">
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block font-bold">SPECIFICATION</span>
                  <p className="text-[10px] font-bold text-white font-sans mt-0.5">50kg Maximum</p>
                </div>
              </div>
            </div>

            {/* Refined minimalist floating metadata label under bottle */}
            <div className="absolute bottom-0 text-center mt-6">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                Portable Electronic Scale
              </span>
              <span className="text-xs font-bold text-slate-300 mt-1 block">
                ৳350 <span className="text-[10px] text-slate-500 line-through font-normal ml-1.5">৳550</span>
              </span>
            </div>

          </motion.div>

        </div>
      </div>

    </div>
  );
}
