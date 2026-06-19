import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailsPage from './components/ProductDetailsPage';
import OrderModal from './components/OrderModal';
import InvoiceView from './components/InvoiceView';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import AboutPage, { AboutSection } from './components/AboutPage';
import { TrustPillars, DTCSpotlight } from './components/MarketingSections';
import { DB } from './lib/db';
import { Product, User, Order } from './types';
import { Filter, ShoppingBag, CheckCircle, ArrowRight, Home, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Page routing state: 'home' | 'product-details' | 'dashboard' | 'admin'
  const [activePage, setActivePage] = useState<string>('home');
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  // Active Session
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modal overlays
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [activeAboutSection, setActiveAboutSection] = useState<AboutSection>('about');

  // Post-order success screen state
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);
  const [isSuccessNewUser, setIsSuccessNewUser] = useState<boolean>(false);

  // Home Storefront Catalog filtering
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gadgets' | 'kitchen' | 'home'>('all');

  // Website-wide initial skeleton hydration state
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // A simple state version key to force re-evaluation of data queries in components
  const [dbVersion, setDbVersion] = useState<number>(0);

  // Load active memory session on start
  useEffect(() => {
    DB.init();
    const sessionUser = DB.getActiveSession();
    if (sessionUser) {
      setCurrentUser(sessionUser);
    }
    // Simulate initial loading cycle to show glorious skeletons
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // Set up backward-compatible path & hash URL dynamic router
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      // Determine page, subset parameters
      let targetPage = 'home';
      let targetProductId: string | null = null;
      let targetSpecsSec: AboutSection = 'about';

      // Parse current route (either from path, or fallback hash path)
      const routerPath = (path === '/' && hash.startsWith('#')) ? hash.substring(1) : path;

      if (routerPath === '/about' || routerPath === 'about') {
        targetPage = 'about';
        targetSpecsSec = 'about';
      } else if (routerPath === '/about/terms' || routerPath === 'about/terms') {
        targetPage = 'about';
        targetSpecsSec = 'terms';
      } else if (routerPath === '/about/privacy' || routerPath === 'about/privacy') {
        targetPage = 'about';
        targetSpecsSec = 'privacy';
      } else if (routerPath === '/about/refunds' || routerPath === 'about/refunds') {
        targetPage = 'about';
        targetSpecsSec = 'refunds';
      } else if (routerPath === '/about/delivery' || routerPath === 'about/delivery') {
        targetPage = 'about';
        targetSpecsSec = 'delivery';
      } else if (routerPath === '/dashboard' || routerPath === 'dashboard') {
        targetPage = 'dashboard';
      } else if (routerPath === '/admin' || routerPath === 'admin') {
        targetPage = 'admin';
      } else if (routerPath.startsWith('/product/') || routerPath.startsWith('product/')) {
        targetPage = 'product-details';
        const segments = routerPath.split('/');
        targetProductId = segments[segments.length - 1] || null;
      }

      setActivePage(targetPage);
      setActiveProductId(targetProductId);
      if (targetPage === 'about') {
        setActiveAboutSection(targetSpecsSec);
      }
    };

    // Run router on initial mount
    handleUrlRouting();

    // Listen to live browser history/back navigation
    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);

    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
    };
  }, []);

  // Automatic Supabase state background initial synchronization on application load
  useEffect(() => {
    const syncOnStartup = async () => {
      try {
        const { isSupabaseConfigured, pullFromSupabase } = await import('./lib/supabase');
        if (isSupabaseConfigured()) {
          const result = await pullFromSupabase();
          if (result.success) {
            // Force active state rerender across all components
            setDbVersion(prev => prev + 1);
            // Refresh credentials of active user session in case local details changed on the server
            const updatedSession = DB.getActiveSession();
            if (updatedSession) {
              setCurrentUser(updatedSession);
            }
          }
        }
      } catch (err) {
        console.error('Initial Supabase syncload failed:', err);
      }
    };
    syncOnStartup();
  }, []);

  // Sync session logout
  const handleLogout = () => {
    DB.clearActiveSession();
    setCurrentUser(null);
    navigateTo('home');
  };

  // Sync login completion & automatic routing
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    if (user.isAdmin) {
      navigateTo('admin');
    } else {
      navigateTo('dashboard');
    }
  };

  // Navigation controller supporting live path rewriting representing distinct pages
  const navigateTo = (page: string, extra?: any) => {
    // Clear temporary order alerts
    setSuccessOrder(null);
    setIsInitialLoading(true);
    setActivePage(page);

    // Simulate page hydration loader
    const pageTimer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 550);

    // Proactively pull updates in background whenever the user transitions between primary pages
    const runAsyncFetch = async () => {
      try {
        const { isSupabaseConfigured, pullFromSupabase } = await import('./lib/supabase');
        if (isSupabaseConfigured()) {
          const result = await pullFromSupabase();
          if (result.success) {
            setDbVersion(prev => prev + 1);
            const freshSession = DB.getActiveSession();
            if (freshSession) {
              setCurrentUser(freshSession);
            }
          }
        }
      } catch (e) {
        console.warn('Silent page transition pull error:', e);
      }
    };
    runAsyncFetch();

    let pathName = '/';
    if (page === 'product-details' && extra) {
      setActiveProductId(extra.productId);
      pathName = `/product/${extra.productId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveProductId(null);
      if (page === 'about') {
        const sec = extra?.section || 'about';
        setActiveAboutSection(sec);
        pathName = sec === 'about' ? '/about' : `/about/${sec}`;
      } else if (page === 'dashboard') {
        pathName = '/dashboard';
      } else if (page === 'admin') {
        pathName = '/admin';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    try {
      // Set history pushState so url transitions match real routing
      window.history.pushState(null, '', pathName);
    } catch (e) {
      // Fallback for sandboxed frames that block pushState
      window.location.hash = pathName;
    }
  };

  // Trigger quick order flow
  const handleTriggerCheckout = (prod: Product, quantity: number = 1) => {
    setCheckoutProduct(prod);
    setCheckoutQuantity(quantity);
  };

  // Handles post-payment instant invoicing and background login
  const handleOrderConfirmed = (order: Order, isNewUser: boolean) => {
    setCheckoutProduct(null);
    setSuccessOrder(order);
    setIsSuccessNewUser(isNewUser);

    // Read generated background session auto-login
    const newSession = DB.getActiveSession();
    if (newSession) {
      setCurrentUser(newSession);
    }

    // Increment db version trigger to update lists across dashboards & grids
    setDbVersion(prev => prev + 1);
  };

  // Handle scrolling storefront index down
  const handleScrollToProducts = () => {
    document.getElementById('store-catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtering products list
  const allProducts = DB.getProducts();
  const displayedProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500/10 selection:text-blue-600">
      
      {/* Prime Floating Header */}
      <Header
        activePage={activePage}
        onNavigate={navigateTo}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLoginModal={() => setShowLoginModal(true)}
      />

      {/* RENDER BODY STAGES */}
      <main className="flex-grow overflow-x-hidden">
        <AnimatePresence mode="wait">
          {successOrder ? (
            <motion.div
              key="order-success"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mx-auto px-4 sm:px-6 py-10"
              id="order-success-screen"
            >
              <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[32px] space-y-6 text-center shadow-2xl shadow-slate-200/50 relative overflow-hidden animate-none">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600" />
                
                {/* Success Badge */}
                <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center border border-blue-100 mb-4 animate-none">
                  <CheckCircle className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                    Thank You For Your Order!
                  </h1>
                  <p className="text-xs font-mono text-blue-600 uppercase tracking-widest bg-blue-50 py-1 px-3.5 inline-block rounded-full border border-blue-100 font-bold">
                    ORDER REFERENCE ID: #{successOrder.id}
                  </p>
                  
                  {/* Background enrollment disclosure */}
                  {isSuccessNewUser ? (
                    <div className="max-w-md mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-205/60 mt-4 text-xs font-sans text-left space-y-1.5 shadow-sm">
                      <span className="text-slate-800 font-bold flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                        <span>Automatic Profile Created!</span>
                      </span>
                      <p className="text-slate-600 leading-normal">
                        We have auto-registered you at <strong>{successOrder.userEmail}</strong>! You are already logged in. Head over to <em>My Dashboard</em> at any time to configure a login password or check shipment updates.
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto font-sans">
                      We've bound this purchase record to your active user account. Standard receipt delivery has been compiled below.
                    </p>
                  )}
                </div>

                {/* Printable invoice layout */}
                <div className="text-left border-t border-slate-100 pt-6 mt-6">
                  <h3 className="text-xs font-bold text-slate-400 font-sans uppercase tracking-wider mb-4">
                    Official Smart Invoice Recipient Copy
                  </h3>
                  <InvoiceView order={successOrder} />
                </div>

                {/* Action routing triggers */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => navigateTo('dashboard')}
                    className="flex-grow py-3.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-full text-xs font-bold tracking-wide uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="font-sans">Go To My User Panel</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigateTo('home')}
                    className="flex-grow py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide uppercase rounded-full shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* 1. STOREFRONT INDEX HOME */}
              {activePage === 'home' && (
                <div id="page-homescreen">
                  {/* Hero Stage */}
                  <Hero 
                    onScrollToProducts={handleScrollToProducts} 
                    onViewProduct={(id) => navigateTo('product-details', { productId: id })}
                  />

                  

                  {/* Main Goods storefront shelf */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="store-catalog-grid">
                    
                    {/* Category Filter Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-200 pb-6">
                      <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 font-sans italic">
                          <Filter className="h-5 w-5 text-blue-600" />
                          <span>Curated Catalog Catalogues</span>
                        </h2>
                        <p className="text-xs text-slate-500 font-sans tracking-wide mt-1 uppercase font-semibold">
                          Choose filter category to explore affordable high-utility items
                        </p>
                      </div>

                      {/* Filter controllers */}
                      <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className={`px-4.5 py-2 rounded-full border text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                            selectedCategory === 'all'
                              ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          All items
                        </button>
                        <button
                          onClick={() => setSelectedCategory('gadgets')}
                          className={`px-4.5 py-2 rounded-full border text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                            selectedCategory === 'gadgets'
                              ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Utility Gadgets
                        </button>
                        <button
                          onClick={() => setSelectedCategory('kitchen')}
                          className={`px-4.5 py-2 rounded-full border text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                            selectedCategory === 'kitchen'
                              ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Kitchen Gear
                        </button>
                        <button
                          onClick={() => setSelectedCategory('home')}
                          className={`px-4.5 py-2 rounded-full border text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                            selectedCategory === 'home'
                              ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Smart Home
                        </button>
                      </div>
                    </div>

                    {/* Products Shelf Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {isInitialLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="bg-white border border-slate-100/80 rounded-[28px] overflow-hidden shadow-sm animate-pulse flex flex-col h-[460px]">
                            <div className="h-[260px] bg-slate-100 w-full" />
                            <div className="p-6 flex-grow flex flex-col justify-between">
                              <div className="space-y-3">
                                <span className="h-3.5 bg-slate-100 rounded-full w-2/3 block" />
                                <span className="h-2.5 bg-slate-100 rounded-full w-4/5 block" />
                                <span className="h-2.5 bg-slate-100 rounded-full w-1/2 block" />
                              </div>
                              <div className="flex items-center justify-between mt-auto">
                                <span className="h-5 bg-slate-100 rounded-full w-1/4 block" />
                                <span className="h-10 bg-slate-100 rounded-xl w-1/3 block" />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        displayedProducts.map(prod => (
                          <ProductCard
                            key={prod.id}
                            product={prod}
                            onOrderNow={(p) => handleTriggerCheckout(p, 1)}
                            onViewDetails={(id) => navigateTo('product-details', { productId: id })}
                          />
                        ))
                      )}
                    </div>

                  </section>

                  {/* Trust Pillars Guarantee Section */}
                  <TrustPillars />

                  {/* DTC Factory Price Spotlight Campaign */}
                  <DTCSpotlight onExplore={handleScrollToProducts} />
                </div>
              )}

              {/* 2. PRODUCT DETAILS PAGE */}
              {activePage === 'product-details' && activeProductId && (
                <div id="page-details">
                  {isInitialLoading ? (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-12">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Media Skeleton */}
                        <div className="space-y-4">
                          <div className="h-[400px] bg-slate-100 rounded-[30px] w-full" />
                          <div className="grid grid-cols-4 gap-3">
                            {Array.from({ length: 4 }).map((_, idx) => (
                              <div key={idx} className="h-18 bg-slate-100 rounded-xl" />
                            ))}
                          </div>
                        </div>
                        {/* Content Skeleton */}
                        <div className="space-y-6 py-4">
                          <span className="h-4 bg-slate-100 rounded-full w-1/4 block" />
                          <span className="h-8 bg-slate-150 rounded-full w-2/3 block" />
                          <span className="h-3 bg-slate-100 rounded-full w-full block" />
                          <span className="h-3 bg-slate-100 rounded-full w-5/6 block" />
                          <span className="h-10 bg-slate-100 rounded-full w-1/3 my-6 block" />
                          <span className="h-14 bg-slate-150 rounded-[22px] w-full mt-8 block" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    (() => {
                      const productObj = DB.getProductById(activeProductId);
                      return productObj ? (
                        <ProductDetailsPage
                          product={productObj}
                          onBack={() => navigateTo('home')}
                          onOrderNow={handleTriggerCheckout}
                        />
                      ) : (
                        <div className="text-center py-20 text-slate-400 font-mono">
                          <span>Error: Target Product could not be resolved in shop database.</span>
                        </div>
                      );
                    })()
                  )}
                </div>
              )}

              {/* 3. USER/CUSTOMER DASHBOARD */}
              {activePage === 'dashboard' && currentUser && (
                <div id="page-user-dashboard">
                  {isInitialLoading ? (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
                      <div className="h-24 bg-slate-200/60 rounded-[28px] w-full" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-32 bg-slate-100 rounded-[24px]" />
                        <div className="h-32 bg-slate-100 rounded-[24px]" />
                        <div className="h-32 bg-slate-100 rounded-[24px]" />
                      </div>
                      <div className="h-64 bg-slate-100 rounded-[28px] w-full" />
                    </div>
                  ) : (
                    <UserDashboard
                      currentUser={currentUser}
                      onNavigateHome={() => navigateTo('home')}
                      onViewProduct={(productId) => navigateTo('product-details', { productId })}
                      onProfileUpdated={() => setCurrentUser(DB.getActiveSession())}
                    />
                  )}
                </div>
              )}

              {/* 4. CONFIDENTIAL ADMINISTRATIVE CONSOLE */}
              {activePage === 'admin' && currentUser?.isAdmin && (
                <div id="page-admin-dashboard">
                  {isInitialLoading ? (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
                      <div className="h-16 bg-slate-250/20 rounded-[20px] w-full" />
                      <div className="h-[400px] bg-slate-100 rounded-[24px]" />
                    </div>
                  ) : (
                    <AdminDashboard
                      currentUser={currentUser}
                      onNavigateHome={() => navigateTo('home')}
                      dbVersion={dbVersion}
                    />
                  )}
                </div>
              )}

              {/* 5. DEDICATED ABOUT US CORPORATE PROFILE PAGE */}
              {activePage === 'about' && (
                <div id="page-about-corporate">
                  {isInitialLoading ? (
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-12">
                      <div className="h-32 bg-slate-100 rounded-[28px] w-full" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="h-[180px] bg-slate-100 rounded-[28px]" />
                        <div className="h-[180px] bg-slate-100 rounded-[28px]" />
                      </div>
                    </div>
                  ) : (
                    <AboutPage 
                      onBack={() => navigateTo('home')} 
                      activeSection={activeAboutSection}
                      onSectionChange={(sec) => setActiveAboutSection(sec)}
                    />
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* GLOBAL FOOTER BRAND */}
      <footer className="bg-slate-950 border-t border-slate-850 py-12 mt-12 text-slate-400 text-xs font-sans text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-slate-800/80 pb-8 mb-8">
            
            {/* Column 1: Identity & About */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-md font-bold tracking-tight text-white uppercase font-sans">
                  CHINA<span className="text-slate-400 font-light">MATI</span>
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Bangladesh's premier direct importer of space-saving home items, quality kitchen tools, and daily smart electronics.
              </p>
              <button 
                type="button"
                onClick={() => navigateTo('about')}
                className="text-blue-400 hover:text-blue-300 font-bold transition-colors text-[11px] underline block text-left cursor-pointer"
              >
                About Us & Executive Board →
              </button>
            </div>

            {/* Column 2: Guaranteed Delivery Times */}
            <div className="space-y-3">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">GUARANTEED DELIVERY</span>
              <div className="space-y-1.5 text-slate-400 text-[11px]">
                <p className="flex items-center gap-2 text-slate-300">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                  <span><strong>Inside Dhaka:</strong> 2 Days (৳60 fee)</span>
                </p>
                <p className="flex items-center gap-2 text-slate-300">
                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
                  <span><strong>Outside Dhaka:</strong> 3 Days (৳120 fee)</span>
                </p>
              </div>
              <button 
                type="button"
                onClick={() => navigateTo('about', { section: 'delivery' })}
                className="text-blue-400 hover:text-blue-300 font-bold transition-colors text-[11px] underline block text-left cursor-pointer"
              >
                Logistics & Speed Info →
              </button>
            </div>

            {/* Column 3: Customer Policies */}
            <div className="space-y-3">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">POLICIES & ASSURANCE</span>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('about', { section: 'refunds' })}
                    className="hover:text-white transition-colors cursor-pointer text-left block"
                  >
                    Return & Refund Policy (7-10 Days)
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('about', { section: 'terms' })}
                    className="hover:text-white transition-colors cursor-pointer text-left block"
                  >
                    Terms and Conditions
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => navigateTo('about', { section: 'privacy' })}
                    className="hover:text-white transition-colors cursor-pointer text-left block"
                  >
                    Privacy Policy Statements
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Authorized Merchant Details */}
            <div className="space-y-3 text-left md:text-right">
              <span className="text-white font-bold block uppercase tracking-wider text-[11px]">MERCHANT CREDENTIALS</span>
              <div className="space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
                <span className="font-mono block text-white">License No: 003591 (Verified)</span>
                <p><strong>HQ:</strong> House 32, Road 01, Aram Model Town, Mohammadpur, Dhaka</p>
                <p><strong>Reg:</strong> Taltola College Para (07)</p>
                <p><strong>Mail:</strong> mychinamati@gmail.com</p>
                <p><strong>Cell:</strong> +880 1635483536</p>
                <p className="text-slate-500">© 2026 chinamati.com. All Rights Reserved.</p>
              </div>
            </div>

          </div>

          {/* SSLCommerz Payment Gateway Branding Banner */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 mb-8 flex items-center justify-center shadow-sm overflow-hidden border border-slate-200/80">
            <img 
              src="https://res.cloudinary.com/dttbj6a0m/image/upload/v1781885350/Payment_Banner_Dec25-02_htoyqd.png" 
              alt="SSLCommerz Secure Payment Partners" 
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-sans">
            <span>Secured SSLCommerz Sandbox Transactions Shield • Licence 003591</span>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => setShowLoginModal(true)}>Confidential Admin Terminal Access</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigateTo('home')}>Home storefront</span>
            </div>
          </div>
        </div>
      </footer>

      {/* --- OVERLAY MODALS --- */}

      {/* 1. SECURE LOGIN MODAL PANEL */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 2. CHECKOUT ORDER DIALOG MODAL */}
      {checkoutProduct && (
        <OrderModal
          product={checkoutProduct}
          quantity={checkoutQuantity}
          onClose={() => setCheckoutProduct(null)}
          onOrderCompleted={handleOrderConfirmed}
        />
      )}



    </div>
  );
}
