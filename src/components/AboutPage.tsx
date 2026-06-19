import React, { useState, useEffect } from 'react';
import { 
  Building, 
  RefreshCw, 
  Truck, 
  ShieldCheck, 
  Lock, 
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  Coins,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type AboutSection = 'about' | 'refunds' | 'delivery' | 'terms' | 'privacy';

interface AboutPageProps {
  onBack: () => void;
  activeSection?: AboutSection;
  onSectionChange?: (section: AboutSection) => void;
}

export default function AboutPage({ onBack, activeSection = 'about', onSectionChange }: AboutPageProps) {
  // Translate delivery tab selection into about tab to maintain a crisp 4-page hierarchy
  const initialTab = activeSection === 'delivery' ? 'about' : activeSection;
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    if (activeSection) {
      setActiveTab(activeSection === 'delivery' ? 'about' : activeSection);
    }
  }, [activeSection]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onSectionChange) {
      onSectionChange(tab as AboutSection);
    }
    // Scroll to top of the page nicely when switching views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-left" id="about-us-page">
      
      {/* Top action header */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all hover:shadow-xs cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-blue-600" />
          <span>Back to Storefront</span>
        </button>
        <span className="text-xs font-mono font-medium text-slate-400">Policy & Information Desk</span>
      </div>

      {/* Main Spacious Title Block */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Chinamati Policies Hub
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl mt-2 leading-relaxed">
          Please select a tab below to read our detailed policies, delivery guarantees, refund procedures, and user confidentiality protocols.
        </p>
      </div>

      {/* Large Wide Horizontal Tab Bar — Not a restricted sidebar or small window */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-12">
        
        {/* TAB 1: ABOUT & SHIPPING */}
        <button
          onClick={() => handleTabChange('about')}
          className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-32 cursor-pointer ${
            activeTab === 'about'
              ? 'bg-slate-950 text-white border-slate-955 shadow-md shadow-slate-950/20'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-xl ${activeTab === 'about' ? 'bg-white/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <Building className="h-5 w-5" />
            </div>
            <ChevronRight className={`h-4 w-4 ${activeTab === 'about' ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight uppercase">About & Shipping</h3>
            <p className={`text-[10px] mt-1 ${activeTab === 'about' ? 'text-slate-400' : 'text-slate-500'}`}>
              Corporate origin & transit timelines
            </p>
          </div>
        </button>

        {/* TAB 2: REFUNDS & RETURNS */}
        <button
          onClick={() => handleTabChange('refunds')}
          className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-32 cursor-pointer ${
            activeTab === 'refunds'
              ? 'bg-white text-slate-900 border-slate-900 shadow-xl shadow-slate-100'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-xl ${activeTab === 'refunds' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
              <RefreshCw className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight uppercase">Refunds & Returns</h3>
            <p className="text-[10px] text-slate-500 mt-1">
              7-day replacement & cash settlements
            </p>
          </div>
        </button>

        {/* TAB 3: TERMS & CONDITIONS */}
        <button
          onClick={() => handleTabChange('terms')}
          className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-32 cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-xl ${activeTab === 'terms' ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
              <FileText className="h-5 w-5" />
            </div>
            <ChevronRight className={`h-4 w-4 ${activeTab === 'terms' ? 'text-blue-200' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight uppercase">Terms & Conditions</h3>
            <p className={`text-[10px] mt-1 ${activeTab === 'terms' ? 'text-blue-100' : 'text-slate-500'}`}>
              Agreement parameters & ordering security
            </p>
          </div>
        </button>

        {/* TAB 4: PRIVACY POLICY */}
        <button
          onClick={() => handleTabChange('privacy')}
          className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-32 cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/15'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-xl ${activeTab === 'privacy' ? 'bg-white/10 text-white' : 'bg-violet-50 text-violet-600'}`}>
              <Lock className="h-5 w-5" />
            </div>
            <ChevronRight className={`h-4 w-4 ${activeTab === 'privacy' ? 'text-violet-200' : 'text-slate-400'}`} />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight uppercase">Privacy Policy</h3>
            <p className={`text-[10px] mt-1 ${activeTab === 'privacy' ? 'text-violet-100' : 'text-slate-500'}`}>
              Ad confidentiality & personal security
            </p>
          </div>
        </button>

      </div>

      {/* Main Single Page Viewport Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* VIEW: ABOUT & SHIPPING */}
          {activeTab === 'about' && (
            <motion.div
              key="about-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold block mb-1">Corporate Mission</span>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">About Chinamati</h2>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">Sourcing premium domestic utility gadgets with uncompromised quality.</p>
                </div>

                <div className="text-slate-700 text-sm leading-relaxed space-y-4">
                  <p>
                    Welcome to <strong>Chinamati</strong>. We are a dedicated importer specializing in sourcing and hosting elite kitchen utility tools, smart gadgets, and domestic home hardware essentials designed to enhance the quality of your household routine.
                  </p>
                  <p>
                    Our supply philosophy focuses on direct factory integration. In simple terms: we bypass conventional rows of high-markup wholesale middle agents to deliver exceptional standards directly to households in Bangladesh.
                  </p>
                  <p>
                    Each individual unit in our catalog undergoes rigorous checking and operation inspections at our central Dhaka distribution hub. We secure your satisfaction through structured manual validations.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase block mb-4">Nationwide Delivery Timelines</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                      <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest block font-mono">INSIDE DHAKA</span>
                      <p className="text-xl font-extrabold text-slate-900 mt-1">2 Working Days</p>
                      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                        Shipping cost is <strong>৳60</strong>. Fast doorstep courier hand-delivery with active cellular coordination.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                      <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest block font-mono">OUTSIDE DHAKA</span>
                      <p className="text-xl font-extrabold text-slate-900 mt-1">3 Working Days</p>
                      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                        Shipping cost is <strong>৳120</strong>. Delivered reliably with high-grade protective packaging to all standard towns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar stats/office content */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-50 border border-slate-150 p-6 rounded-2xl space-y-5">
                  <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-200/80 pb-2">
                    Corporate Office
                  </h4>
                  <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                    <div className="flex gap-3 items-start">
                      <MapPin className="h-4.5 w-4.5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">Dispatch Headquarters</span>
                        <span className="text-slate-500">House 32, Road 01, Aram Model Town, Mohammadpur, Dhaka - 1207</span>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <Phone className="h-4.5 w-4.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">Priority Call Hotline</span>
                        <span className="text-slate-700 font-mono font-semibold">+880 1635483536</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Sat to Thu (10:00 AM - 7:00 PM)</span>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <Mail className="h-4.5 w-4.5 text-violet-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">Management Desk</span>
                        <span className="text-slate-600 font-medium">mychinamati@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: REFUNDS */}
          {activeTab === 'refunds' && (
            <motion.div
              key="refunds-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs max-w-4xl mx-auto space-y-8"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-1">Risk-Free Assurances</span>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Return & Refund Policy</h2>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">No complicated loops. Transparent and straightforward timelines.</p>
              </div>

              <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
                <div className="bg-emerald-50/30 border border-emerald-100 p-5 rounded-2xl flex items-start gap-4">
                  <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200 flex-shrink-0 text-emerald-700">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-tight">7-Day Free Replacement Policy</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      If your customer package has physical factory structural damages, electric system errors, or model mismatch, you can request an instant return or validation check within 7 calendar days of physical package delivery.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-tight">Refund Clearing Duration (7 to 10 Days)</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Once we fetch your returned item and complete the quality validation review, the financial settlement back to your active mobile banking pocket or charge card requires <strong>7 to 10 working days</strong>. This buffer represents necessary timeline adjustments to clear bank transaction settlements and confirm accessory collections.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase block tracking-wider">Item State Prerequisites:</span>
                  <ul className="text-xs text-slate-500 space-y-1.5 pl-4 list-disc">
                    <li>The outer product retail box and all included accessories must remain clean and intact.</li>
                    <li>Items showing scratches, user usage impact, liquid exposure, or internal hardware tampering do not qualify.</li>
                    <li>Receipt invoices or order references must be supplied along with the claim.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: TERMS */}
          {activeTab === 'terms' && (
            <motion.div
              key="terms-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs max-w-4xl mx-auto space-y-8"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold block mb-1">Standard Agreements</span>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Terms & Conditions</h2>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">Simple legal frames governing order compliance on our store.</p>
              </div>

              <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase">1. Ordering Compliance & Physical Handover</h3>
                  <p className="text-xs text-slate-500">
                    When submitting an order through Chinamati, you confirm that your input shipment credentials (full cell number, name, shipping area, physical address) are fully verified and accurate. We take zero charge for delivery delays caused by faulty contact inputs.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase">2. Storage Caching of Accounts</h3>
                  <p className="text-xs text-slate-500">
                    To make viewing tracking histories, receipt compilations, and historical invoices easier for users, the service utilizes local encrypted database registers. Password privacy remains your sole liability.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase">3. Force Majeure & Shipping Slots</h3>
                  <p className="text-xs text-slate-500">
                    While we guarantee shipping handovers within 2-3 working days, public strikes, storms, localized floods, or unexpected system issues may result in courier timeline shifts. Chinamati actively resolves transit difficulties to protect client satisfaction.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: PRIVACY */}
          {activeTab === 'privacy' && (
            <motion.div
              key="privacy-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs max-w-4xl mx-auto space-y-8"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-600 font-bold block mb-1">Absolute Protection</span>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Privacy Policy</h2>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">Your phone number, address, and email are strictly restricted from marketing platforms.</p>
              </div>

              <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                <p className="text-xs leading-relaxed text-slate-500">
                  We maintain bulletproof respect for customer data security and process information in complete compliance with privacy laws:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
                    <h4 className="font-bold text-xs text-slate-950 uppercase tracking-tight">Sourced Details</h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      We collect name, email address, physical shipping address, and telephone number. This detail is used exclusively to compile tax invoice sheets, verify orders, and write labels.
                    </p>
                  </div>

                  <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50">
                    <h4 className="font-bold text-xs text-slate-950 uppercase tracking-tight">Courier Sharing Only</h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      To complete delivery handovers, your shipping details are shared only with our transport dispatchers (RedX, steadyfast, or pathao). No third party has access to your cell records.
                    </p>
                  </div>
                </div>

                <div className="bg-red-50/30 border border-red-150 p-5 rounded-2xl flex gap-3.5 items-start text-xs text-red-900">
                  <ShieldAlert className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wide text-slate-900 block">Strict Protection Guarantee:</span>
                    <p className="text-xs text-slate-700 mt-1">
                      Chinamati will never sell, lease, exchange, distribute, or rent your database records, password credentials, call numbers, or order volumes to external digital advertising pipelines or bulk agency companies. Your browsing and checkout behaviors remain completely private and hidden.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
