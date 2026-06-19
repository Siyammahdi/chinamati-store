import { ShoppingBag, User, LogOut, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { User as UserType } from '../types';
import { DB } from '../lib/db';

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
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
      {/* Top Banner Alert */}
      <div className="bg-blue-600 text-center py-2 px-4 text-xs font-semibold tracking-wide text-white flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
        <span>Premium Daily Items with Express Same-Day Delivery across 64 Districts!</span>
        <span className="hidden md:inline bg-white/20 px-2 py-0.5 rounded text-[10px]">CASH ON DELIVERY</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
            id="brand-logo"
          >
            <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
                <ShoppingBag className="h-4.5 w-4.5 text-blue-600" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors font-sans">
                Chinamati
              </span>
            </div>
          </div>

          {/* Quick Categories Navigation (Faux) */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 font-medium">
            <span 
              onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById('category-gadgets')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="hover:text-blue-600 cursor-pointer transition-colors hover:scale-102"
            >
              Gadgets
            </span>
            <span 
              onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById('category-kitchen')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="hover:text-blue-600 cursor-pointer transition-colors hover:scale-102"
            >
              Kitchen
            </span>
            <span 
              onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById('category-home')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              className="hover:text-blue-600 cursor-pointer transition-colors hover:scale-102"
            >
              Smart Home
            </span>
            <span 
              onClick={() => onNavigate('about')}
              className={`hover:text-blue-600 cursor-pointer transition-colors hover:scale-102 ${activePage === 'about' ? 'text-blue-600 font-bold bg-blue-50/50 px-2 py-1 rounded-lg' : ''}`}
            >
              About Us
            </span>
            <span className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3 w-3 text-blue-600" />
              <span>BD Wide Shipping</span>
            </div>
          </nav>

          {/* User Profile / Admin Quick Options */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.isAdmin ? (
                  <button
                    id="nav-admin-dashboard"
                    onClick={() => onNavigate('admin')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold font-mono tracking-wider transition-all cursor-pointer ${
                      activePage === 'admin' 
                        ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                        : 'border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600'
                    }`}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>ADMIN PANEL</span>
                  </button>
                ) : (
                  <button
                    id="nav-user-dashboard"
                    onClick={() => onNavigate('dashboard')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                      activePage === 'dashboard' 
                        ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                        : 'border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600'
                    }`}
                  >
                    <User className="h-3.5 w-3.5 text-blue-600" />
                    <span className="max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
                  </button>
                )}

                <button
                  id="header-logout-btn"
                  onClick={onLogout}
                  title="Logout"
                  className="bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 border border-slate-200 p-2 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold border border-slate-200 rounded-full hover:bg-slate-50 text-slate-700 cursor-pointer transition-all"
              >
                <User className="h-3.5 w-3.5 text-blue-600" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
