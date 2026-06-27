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
      const searchParams = new URLSearchParams(window.location.search);

      // Handle SSLCommerz returns
      let sslPath = path;
      let sslSearch = searchParams;
      
      // Check if path is in hash (for SPA fallback)
      if (path === '/' && hash.startsWith('#')) {
        const hashPath = hash.substring(1);
        const hashQueryIndex = hashPath.indexOf('?');
        if (hashQueryIndex !== -1) {
          sslPath = hashPath.substring(0, hashQueryIndex);
          sslSearch = new URLSearchParams(hashPath.substring(hashQueryIndex + 1));
        } else {
          sslPath = hashPath;
        }
      }
      
      if (sslPath === '/payment-success' || sslPath === 'payment-success') {
        const tranId = sslSearch.get('tran_id');
        const pendingOrder = localStorage.getItem('pending_order');
        if (pendingOrder) {
          const orderData = JSON.parse(pendingOrder);
          if (orderData.tran_id === tranId) {
            // Complete the order
            const result = DB.placeOrder({
              ...orderData,
              paymentStatus: 'Paid'
            });
            handleOrderConfirmed(result.order, result.isNewUser);
            localStorage.removeItem('pending_order');
            // Clean URL
            window.history.replaceState(null, '', '/');
            return;
          }
        }
      }

      if (sslPath === '/payment-fail' || sslPath === 'payment-fail' || sslPath === '/payment-cancel' || sslPath === 'payment-cancel') {
        localStorage.removeItem('pending_order');
        window.history.replaceState(null, '', '/');
        alert(sslPath.includes('fail') ? 'Payment failed. Please try again.' : 'Payment cancelled.');
        return;
      }

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
    <div className="min-h-screen bg-[#f0f2f8] text-slate-900 flex flex-col font-sans">
      
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mx-auto px-4 sm:px-6 py-12"
              id="order-success-screen"
            >
              <div className="bg-white border border-slate-200/80 rounded-[36px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.1)] relative">
                {/* Top accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 w-full" />

                <div className="p-6 sm:p-10 space-y-7 text-center">
                  {/* Success icon */}
                  <div className="relative inline-flex">
                    <div className="h-20 w-20 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-3xl flex items-center justify-center shadow-md shadow-emerald-500/10 mx-auto">
                      <CheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>
                    {/* Pulse ring */}
                    <span className="absolute inset-0 rounded-3xl border-2 border-emerald-300 animate-ping opacity-30 pointer-events-none" />
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans">
                      Order Confirmed! 🎉
                    </h1>
                    <p className="inline-flex items-center gap-2 text-[11px] font-mono text-blue-600 uppercase tracking-widest bg-blue-50 py-1.5 px-4 rounded-full border border-blue-100 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                      ORDER ID: #{successOrder.id}
                    </p>

                    {isSuccessNewUser ? (
                      <div className="max-w-md mx-auto bg-gradient-to-br from-slate-50 to-blue-50/50 p-5 rounded-2xl border border-slate-200/80 mt-3 text-xs font-sans text-left space-y-1.5">
                        <span className="text-slate-800 font-bold flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                          <span>Automatic Profile Created!</span>
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          We've auto-registered you at <strong className="text-slate-800">{successOrder.userEmail}</strong>. You're already logged in — visit <em>My Dashboard</em> to set a password or track your shipment.
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm max-w-md mx-auto font-sans">
                        Your purchase is bound to your account. Your invoice is ready below.
                      </p>
                    )}
                  </div>

                  {/* Invoice */}
                  <div className="text-left border-t border-slate-100 pt-6">
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Official Invoice · Recipient Copy
                    </p>
                    <InvoiceView order={successOrder} />
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => navigateTo('dashboard')}
                      className="flex-1 py-3.5 px-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl text-xs font-bold tracking-wide uppercase transition-all cursor-pointer flex items-center justify-center gap-2 focus:outline-none hover:border-slate-300"
                    >
                      <span>My Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigateTo('home')}
                      className="flex-1 py-3.5 px-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl text-xs font-bold tracking-wide uppercase shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer focus:outline-none"
                    >
                      Continue Shopping
                    </button>
                  </div>
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

                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-3">
                          <ShoppingBag className="h-3 w-3 text-blue-500" />
                          <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-[0.15em]">Our Products</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans leading-tight">
                          Curated for
                          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> Smart Living</span>
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-sans">
                          Explore affordable, high-utility items for every lifestyle
                        </p>
                      </div>

                      {/* Filter pills */}
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { key: 'all', label: 'All Items' },
                          { key: 'gadgets', label: 'Utility Gadgets' },
                          { key: 'kitchen', label: 'Kitchen Gear' },
                          { key: 'home', label: 'Smart Home' },
                        ].map((cat) => (
                          <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key as any)}
                            className={`px-4 py-2 rounded-xl border text-[11px] font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer focus:outline-none ${
                              selectedCategory === cat.key
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                      {isInitialLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="bg-white rounded-[28px] overflow-hidden border border-slate-200/80 flex flex-col" style={{ height: '460px' }}>
                            <div className="animate-shimmer" style={{ paddingTop: '72%' }} />
                            <div className="p-5 flex-grow flex flex-col gap-3">
                              <div className="h-3 bg-slate-100 rounded-full w-2/3 animate-shimmer" />
                              <div className="h-5 bg-slate-100 rounded-full w-4/5 animate-shimmer" />
                              <div className="h-3 bg-slate-100 rounded-full w-full animate-shimmer" />
                              <div className="h-3 bg-slate-100 rounded-full w-3/4 animate-shimmer" />
                              <div className="mt-auto flex items-center justify-between">
                                <div className="h-7 bg-slate-100 rounded-full w-1/4 animate-shimmer" />
                                <div className="h-10 bg-slate-100 rounded-2xl w-1/3 animate-shimmer" />
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
                  {/* <DTCSpotlight onExplore={handleScrollToProducts} /> */}
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

      {/* GLOBAL FOOTER */}
      <footer className="relative bg-slate-950 border-t border-slate-800/80 overflow-hidden">
        {/* Subtle background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-blue-600/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-24 bg-violet-600/6 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

          {/* Top grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 mb-10 border-b border-slate-800/80">

            {/* Brand */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-extrabold text-white tracking-tight">
                    China<span className="text-blue-400">mati</span>
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-[0.15em] font-mono">Premium Imports</span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs font-sans">
                Bangladesh's premier direct importer of space-saving home items, quality kitchen tools, and daily smart electronics.
              </p>
              <button
                type="button"
                onClick={() => navigateTo('about')}
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold text-[11px] transition-colors cursor-pointer focus:outline-none group"
              >
                <span>About Us & Team</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Delivery */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-[0.15em] font-mono">Guaranteed Delivery</span>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-sm shadow-emerald-400/50" />
                  <span><strong className="text-white">Inside Dhaka:</strong> 2 Days (৳60 fee)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-amber-400 flex-shrink-0 shadow-sm shadow-amber-400/50" />
                  <span><strong className="text-white">Outside Dhaka:</strong> 3 Days (৳120 fee)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('about', { section: 'delivery' })}
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold text-[11px] transition-colors cursor-pointer focus:outline-none group"
              >
                <span>Logistics & Speed Info</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Policies */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-[0.15em] font-mono">Policies & Assurance</span>
              <ul className="space-y-2.5">
                {[
                  { label: 'Return & Refund (7-10 Days)', section: 'refunds' },
                  { label: 'Terms and Conditions', section: 'terms' },
                  { label: 'Privacy Policy', section: 'privacy' },
                ].map((item) => (
                  <li key={item.section}>
                    <button
                      type="button"
                      onClick={() => navigateTo('about', { section: item.section })}
                      className="text-slate-400 hover:text-white text-xs transition-colors cursor-pointer focus:outline-none text-left font-sans"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Merchant Info */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-[0.15em] font-mono">Merchant Details</span>
              <div className="space-y-2 text-xs text-slate-400 font-sans leading-relaxed">
                <p className="font-mono text-white text-[11px]">License No: 003591 ✓ Verified</p>
                <p><span className="text-slate-500">HQ:</span> House 32, Road 01, Aram Model Town, Mohammadpur, Dhaka</p>
                <p><span className="text-slate-500">Mail:</span> mychinamati@gmail.com</p>
                <p><span className="text-slate-500">Cell:</span> +880 1635483536</p>
              </div>
            </div>

          </div>

          {/* Payment banner */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 mb-8 flex items-center justify-center overflow-hidden border border-slate-200">
            <img
              src="https://res.cloudinary.com/dttbj6a0m/image/upload/v1781885350/Payment_Banner_Dec25-02_htoyqd.png"
              alt="SSLCommerz Secure Payment Partners"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-sans text-slate-500">
            <span>© 2026 chinamati.com · All Rights Reserved · Secured by SSLCommerz · Licence 003591</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="hover:text-slate-300 cursor-pointer transition-colors focus:outline-none"
              >
                Admin Access
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => navigateTo('home')}
                className="hover:text-slate-300 cursor-pointer transition-colors focus:outline-none"
              >
                Home
              </button>
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
