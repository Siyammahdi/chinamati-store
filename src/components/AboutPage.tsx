import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowLeft, 
  ShieldCheck, 
  RefreshCw, 
  Truck, 
  UserCheck, 
  Lock, 
  FileText 
} from 'lucide-react';

export type AboutSection = 'about' | 'refunds' | 'delivery' | 'terms' | 'privacy';

interface AboutPageProps {
  onBack: () => void;
  activeSection?: AboutSection;
  onSectionChange?: (section: AboutSection) => void;
}

export default function AboutPage({ onBack, activeSection = 'about', onSectionChange }: AboutPageProps) {
  const [activeTab, setActiveTab] = useState<AboutSection>(activeSection);

  // Sync state if prop changes (e.g. user clicks another policy link in the footer)
  useEffect(() => {
    setActiveTab(activeSection);
  }, [activeSection]);

  const handleTabChange = (tab: AboutSection) => {
    setActiveTab(tab);
    if (onSectionChange) {
      onSectionChange(tab);
    }
  };

  const tabs = [
    { id: 'about', label: 'About Us & Company', icon: Building, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'refunds', label: 'Return & Refund Policy', icon: RefreshCw, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'delivery', label: 'Delivery Guarantee', icon: Truck, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'terms', label: 'Terms & Conditions', icon: ShieldCheck, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { id: 'privacy', label: 'Privacy Statements', icon: Lock, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-left" id="about-us-page">
      {/* Top action navigation */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all hover:shadow-sm cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-blue-600" />
          <span>Back to Storefront</span>
        </button>

        <div className="text-xs text-slate-400 font-mono">
          Last revised: June 2026 • Verified ID: SEC_940B2
        </div>
      </div>

      {/* Main Title & Brand Identity */}
      <div className="mb-10 text-center sm:text-left">
        <span className="text-[10px] font-bold text-blue-600 font-mono uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Legal & Corporate Directory
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
          CHINA<span className="text-blue-600 font-medium">MATI</span> COMPLIANCE CENTRE
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
          Access verified administrative protocols, delivery target policies, structural refund timelines, and official corporate directories.
        </p>
      </div>

      {/* Two Column Desktop Layout (Responsive Tabs Rail + Rendered Content Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Selector */}
        <div className="lg:col-span-4 space-y-2 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 mb-3 font-mono">
            Platform Categories
          </span>
          <div className="flex flex-col gap-1.5">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full py-3.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-between border cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                      : 'bg-white text-slate-600 border-slate-100 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-150/30'}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span>{tab.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    Active
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200/60 px-2 space-y-2.5">
            <h5 className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Registered Office HQ</h5>
            <p className="text-slate-605 text-[11px] leading-relaxed">
              Chinamati Tower, Kemal Ataturk Avenue, Banani, Dhaka-1213.<br/>
              Hotline: <strong>+880 1712-345678</strong>
            </p>
          </div>
        </div>

        {/* Tab content viewer panel */}
        <div className="lg:col-span-8 bg-white border border-slate-100/90 rounded-[28px] p-6 sm:p-10 shadow-sm min-h-[480px] flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* 1. ABOUT US & MANAGEMENT BOARD */}
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
                id="profile-section-about"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase">About Us & Corporate Board</h2>
                    <p className="text-[11px] text-slate-400">Direct importer and verified merchant credentials</p>
                  </div>
                </div>

                <div className="prose prose-sm text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4">
                  <p>
                    Welcome to <strong>Chinamati Premium Imports (Bangladesh)</strong>. We operate as an independent consumer catalog specializing in space-saving domestic items, intelligent kitchen apparatus, and modern electronic accessories.
                  </p>
                  <p>
                    By bypassing the typical layering of sub-agents and wholesale middlemen, we establish absolute quality guarantees. We interact directly with certified manufacturers to transport performance-tested, authentic hardware variants directly to domestic consumers.
                  </p>
                </div>

                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Official Executive Leadership
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl text-center shadow-sm space-y-2">
                      <div className="mx-auto h-9 w-9 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <Users className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">Md. Khoshrujjaman Dave</h5>
                        <p className="text-[9px] text-slate-505 font-mono uppercase mt-0.5 font-bold">Chief Executive Officer</p>
                      </div>
                    </div>

                    <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl text-center shadow-sm space-y-2">
                      <div className="mx-auto h-9 w-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                        <Users className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">Adnan Rahman</h5>
                        <p className="text-[9px] text-slate-550 font-mono uppercase mt-0.5 font-bold">Chief Operating Officer</p>
                      </div>
                    </div>

                    <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl text-center shadow-sm space-y-2">
                      <div className="mx-auto h-9 w-9 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                        <Users className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">Wasif Ahmed</h5>
                        <p className="text-[9px] text-slate-500 font-mono uppercase mt-0.5 font-bold">Chief Technology Officer</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-[11px] text-slate-500 space-y-1">
                  <span className="font-bold text-slate-700 block">Support coordinates:</span>
                  <p>Inquiries: direct support line <strong>+880 1712-345678</strong> (Sat-Thu, 10 AM to 7 PM)</p>
                  <p>Corporate Contact Address email: <strong>support@chinamati.com.bd</strong></p>
                </div>
              </motion.div>
            )}

            {/* 2. RETURN & REFUND POLICY */}
            {activeTab === 'refunds' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
                id="profile-section-refunds"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase">Return & Refund Policy</h2>
                    <p className="text-[11px] text-slate-400">Standard legal swap structures & processing cycles</p>
                  </div>
                </div>

                <div className="bg-amber-50/20 border border-amber-100/60 p-5 rounded-2xl">
                  <h4 className="text-xs font-bold text-amber-800 mb-1.5 uppercase font-sans">Official Guarantee Period</h4>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                    We offer a secure, no-hassle return protocol. If you receive a product with factory structural errors, hardware failure, or package discrepancy: you are entitled to assert a return or exchange claim within 7 calendar days of receipt.
                  </p>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
                    Refund Processing Times
                  </span>
                  <div className="border border-slate-100 bg-slate-50 p-5 rounded-xl space-y-3">
                    <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                      Standard validation, clearance, and direct back-account transfer completion will take strictly <span className="text-blue-600 font-bold underline">7 to 10 working days</span>.
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      This formal timeframe is required for logistics return verification, QA physical hardware damage evaluation, and central bank/gateway (SSLCommerz integration) financial settlement clearances.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-550 leading-relaxed pl-4 border-l-2 border-slate-200">
                  <span className="font-bold text-slate-700">Crucial return criteria:</span>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>The product box and dynamic physical tags must stay preserved in original shape.</li>
                    <li>The package must not have suffered any artificial structural collision or internal liquid spills.</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* 3. LOGISTICS & DELIVERY TIMELINES */}
            {activeTab === 'delivery' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
                id="profile-section-delivery"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase">Logistics & Delivery Speed Guarantee</h2>
                    <p className="text-[11px] text-slate-400">Guaranteed nationwide shipment durations</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To keep dynamic tracking simple and transparent, we utilize highly optimized courier partnerships. Below are our strict official delivery targets verified for Bangladesh:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-emerald-100 bg-emerald-50/10 p-5 rounded-2xl hover:border-emerald-200 transition-all">
                    <span className="text-[9px] font-bold text-emerald-600 font-mono uppercase tracking-wider block mb-1">METRO DHAKA</span>
                    <h4 className="text-sm font-extrabold text-slate-900 font-sans">Inside Dhaka District</h4>
                    <p className="text-emerald-600 font-black text-2xl font-mono mt-1">5 Working Days</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed mt-2">
                      Consolidated shipping rate of <strong>৳60</strong>. Complete tracking alerts provided directly via contact mobile notifications.
                    </p>
                  </div>

                  <div className="border border-blue-100 bg-blue-50/10 p-5 rounded-2xl hover:border-blue-200 transition-all">
                    <span className="text-[9px] font-bold text-blue-600 font-mono uppercase tracking-wider block mb-1">OUTSIDE DHAKA DISTRICTS</span>
                    <h4 className="text-sm font-extrabold text-slate-900 font-sans">Outside Dhaka Reach</h4>
                    <p className="text-indigo-600 font-black text-2xl font-mono mt-1">10 Working Days</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed mt-2">
                      Consolidated shipping rate of <strong>৳120</strong>. Delivered straight to doorstep across all 63 non-metropolitan districts.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-[11px] text-slate-500">
                  <strong>Standard Package Quality Assurance:</strong> Every gadget is packed in thick bubble bags and sturdy custom master boxes to prevent transport pressure and environmental dampness.
                </div>
              </motion.div>
            )}

            {/* 4. TERMS & CONDITIONS */}
            {activeTab === 'terms' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
                id="profile-section-terms"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase">Terms and Conditions</h2>
                    <p className="text-[11px] text-slate-400">Official customer shopping legal binding agreements</p>
                  </div>
                </div>

                <div className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  <p>
                    Please review these operational policies with absolute vigilance before registering orders on the Chinamati portal:
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">1. Structure of Checkout Actions</h4>
                    <p className="text-[11px] sm:text-xs">
                      When finalizing checkouts (using Cash on Delivery or credit payment gateways), you are legally declaring that the shipping details entered (name, phone details, active physical street references) are entirely true and authenticated.
                    </p>

                    <h4 className="text-xs font-bold text-slate-900">2. Customer Session Logging</h4>
                    <p className="text-[11px] sm:text-xs">
                      To provide automatic convenience, our app utilizes localized guest databases. Placed orders are logged in web storage and backed up seamlessly to Supabase databases. Your session identity is maintained strictly for transaction processing and invoice lookup operations.
                    </p>

                    <h4 className="text-xs font-bold text-slate-900">3. Delivery Logistics Compliance</h4>
                    <p className="text-[11px] sm:text-xs">
                      Due to complex transit requirements, we ask you to stay responsive to courier tracking calls. Inside Dhaka shipments will arrive in 5 days, and outside Dhaka shipments will arrive in 10 days. Deliveries might occasionally experience minimal latency only under force majeure (strikes, structural blockades, heavy floods).
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. PRIVACY STATEMENT */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
                id="profile-section-privacy"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase">Privacy & Data Protections</h2>
                    <p className="text-[11px] text-slate-400">Strict database confidentiality protections</p>
                  </div>
                </div>

                <div className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  <p>
                    We guarantee absolute confidentiality on all user-submitted credentials inside the Chinamati digital cluster:
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">1. Collected Credentials</h4>
                    <p className="text-[11px] sm:text-xs">
                      We securely parse client records (e.g. Email addresses, cell numbers, localized districts) only to initialize checkout packaging, prepare physical custom tax invoices, and maintain dashboard profile synchronization.
                    </p>

                    <h4 className="text-xs font-bold text-slate-900">2. Anti-Distribution Clause</h4>
                    <p className="text-[11px] sm:text-xs">
                      No customer account data, purchasing logs, or mobile identities will ever be leased, distributed, or exposed to third-party tracking conglomerates or advertising services under any circumstances.
                    </p>

                    <h4 className="text-xs font-bold text-slate-900">3. Browser Sandbox Integrity</h4>
                    <p className="text-[11px] sm:text-xs">
                      Local configuration elements are recorded in browser localStorage variables solely to manage active user logins.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Secure bottom segment footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Security Status: SSL SECURED 256-BIT</span>
            <span>Corporate Registra ID: GS-DH-26B</span>
          </div>

        </div>

      </div>
    </div>
  );
}
