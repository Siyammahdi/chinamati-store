import { useState, useEffect } from 'react';
import { ShoppingBag, User, LogOut, ShieldAlert, Sparkles, MapPin, Menu, X, ChevronRight, Zap } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  activePage: string;
  onNavigate: (page: string, extra?: any) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  onOpenLoginModal: () => void;
}

export default function Header({
  activePage,
  onNavigate,
  currentUser,
  onLogout,
  onOpenLoginModal
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Gadgets', page: 'home', section: 'gadgets' },
    { label: 'Kitchen', page: 'home', section: 'kitchen' },
    { label: 'Smart Home', page: 'home', section: 'home' },
    { label: 'About', page: 'about' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setMobileOpen(false);
    if (item.section) {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById(`category-${item.section}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      onNavigate(item.page);
    }
  };

  return (
    <>
      {/* ── Announcement Banner ── */}
      <div className="relative z-50 overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
        {/* Subtle shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite]" style={{ backgroundSize: '200% 100%' }} />
        <div className="relative flex items-center justify-center gap-3 py-2.5 px-4 text-white">
          <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse flex-shrink-0" />
          <p className="text-[11px] sm:text-xs font-semibold tracking-wide text-center">
            Free Delivery inside Dhaka — Cash On Delivery Nationwide across all 64 Districts!
          </p>
          <span className="hidden sm:flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-white/30 flex-shrink-0">
            <Zap className="h-2.5 w-2.5 fill-yellow-300 text-yellow-300" />
            EXPRESS
          </span>
        </div>
      </div>

      {/* ── Main Header ── */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_2px_32px_rgba(0,0,0,0.08)] border-b border-slate-200/80'
            : 'bg-white/80 backdrop-blur-md border-b border-slate-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group focus:outline-none"
              id="brand-logo"
            >
              <div className="relative h-10 w-10 flex-shrink-0">
                <div className="h-full w-full rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 flex items-center justify-center group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                {/* Live dot */}
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[18px] font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-200 font-sans">
                  China<span className="text-blue-600">mati</span>
                </span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Premium Imports</span>
              </div>
            </button>

            {/* ── Desktop Nav ── */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none group ${
                    activePage === item.page && !item.section
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                  {activePage === item.page && !item.section && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}

              <span className="mx-2 h-5 w-px bg-slate-200" />

              <div className="flex items-center gap-1.5 text-xs text-slate-500 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                <span className="font-semibold">BD Wide Shipping</span>
              </div>
            </nav>

            {/* ── Right: User Controls ── */}
            <div className="flex items-center gap-2.5">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  {currentUser.isAdmin ? (
                    <button
                      id="nav-admin-dashboard"
                      onClick={() => onNavigate('admin')}
                      className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold tracking-wide transition-all cursor-pointer focus:outline-none ${
                        activePage === 'admin'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Admin Panel</span>
                    </button>
                  ) : (
                    <button
                      id="nav-user-dashboard"
                      onClick={() => onNavigate('dashboard')}
                      className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activePage === 'dashboard'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[9px] font-black">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                    </button>
                  )}
                  <button
                    id="header-logout-btn"
                    onClick={onLogout}
                    title="Logout"
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 transition-all cursor-pointer focus:outline-none"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  id="header-login-btn"
                  onClick={onOpenLoginModal}
                  className="hidden sm:flex items-center gap-2 px-5 py-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer focus:outline-none"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pb-6 pt-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left focus:outline-none ${
                  activePage === item.page && !item.section
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 mt-3 space-y-2">
              {currentUser ? (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); onNavigate(currentUser.isAdmin ? 'admin' : 'dashboard'); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold transition-all focus:outline-none"
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{currentUser.isAdmin ? 'Admin Panel' : `My Dashboard`}</span>
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 text-sm font-semibold transition-all focus:outline-none"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); onOpenLoginModal(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all focus:outline-none"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
