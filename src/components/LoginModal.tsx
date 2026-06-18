import React, { useState } from 'react';
import { X, Lock, Mail, Sparkles, KeySquare } from 'lucide-react';
import { DB } from '../lib/db';
import { User } from '../types';
import { motion } from 'motion/react';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function LoginModal({
  onClose,
  onLoginSuccess
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      return setError('Please fill in all credentials fields.');
    }

    const result = DB.login(email, password);
    if (!result.success || !result.user) {
      return setError(result.error || 'Authentication failed.');
    }

    setSuccess('Signed in successfully! Teleporting to dashboard...');
    setTimeout(() => {
      onLoginSuccess(result.user!);
    }, 1200);
  };

  // Automated Autofill triggers (Addresses: "and for now for tasking keep a button for example account credential fillup in the login page.")
  const fillCredentials = (role: 'admin' | 'customer') => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@chinamati.com');
      setPassword('adminpassword123');
    } else {
      // Find first user with custom password
      const users = DB.getUsers();
      const customer = users.find(u => !u.isAdmin && u.hasSetPassword);
      if (customer) {
        setEmail(customer.email);
        setPassword(customer.password || '');
      } else {
        // Fallback or auto-generate a helper customer so they can inspect immediately
        setEmail('customer@gmail.com');
        setPassword('customer123');
        // Let's seed this helper customer into local storage too so it works instantly!
        const demoUser: User = {
          uid: 'user-demo-id',
          name: 'Demo Grade Customer',
          email: 'customer@gmail.com',
          phone: '01899112233',
          district: 'Dhaka',
          address: 'Demo Street, Dhaka 1212',
          hasSetPassword: true,
          password: 'customer123',
          createdAt: new Date().toISOString(),
          isAdmin: false
        };
        DB.saveUser(demoUser);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        className="relative w-full max-w-sm bg-white border border-slate-100 rounded-[30px] shadow-2xl overflow-hidden"
        id="login-dialog-panel"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header visual branding */}
        <div className="bg-slate-50 px-6 pt-8 pb-5 border-b border-slate-100 text-center relative">
          <div className="h-10 w-10 bg-blue-50 rounded-xl mx-auto flex items-center justify-center border border-blue-100 mb-3">
            <Lock className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900 block uppercase font-sans">
            Access Portal
          </h2>
          <p className="text-xs text-slate-500 font-sans tracking-wide mt-1">
            Access secure user levels and Admin system.
          </p>
        </div>

        {/* Autofill credential panels */}
        <div className="px-6 pt-5 pb-1 space-y-2">
          <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest block">Task Fillers Shortcut:</span>
          
          <div className="grid grid-cols-2 gap-2">
            
            {/* Admin trigger */}
            <button
              onClick={() => fillCredentials('admin')}
              id="autofill-admin-btn"
              type="button"
              className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold font-sans tracking-wide rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all uppercase"
            >
              <KeySquare className="h-3.5 w-3.5 text-blue-600" />
              <span>Admin Fill</span>
            </button>

            {/* Customer trigger */}
            <button
              onClick={() => fillCredentials('customer')}
              id="autofill-customer-btn"
              type="button"
              className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold font-sans tracking-wide rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all uppercase"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              <span>Client Fill</span>
            </button>

          </div>
        </div>

        {/* Input Credentials Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-red-700 text-xs font-sans">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-100 px-4 py-3 rounded-xl text-green-700 text-xs font-sans flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-ping" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1.5">
                Registered Email ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-blue-500/60" />
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1.5">
                Secret Access Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-blue-500/60" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            id="btn-login-submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-widest uppercase rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10"
          >
            <span>Authorize login</span>
          </button>
        </form>

      </motion.div>
    </motion.div>
  );
}
