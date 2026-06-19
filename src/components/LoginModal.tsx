import React, { useState } from 'react';
import { X, Lock, Mail, Sparkles, KeySquare, User as UserIcon, Phone, MapPin, CheckCircle2 } from 'lucide-react';
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
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Common credentials state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration exclusive state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      return setError('Please fill in all credential fields.');
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!name.trim()) return setError('Please enter your full name.');
    if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email address.');
    if (!phone.trim() || phone.length < 11) return setError('Please enter a valid mobile number (min 11 digits).');
    if (!address.trim()) return setError('Please enter your complete delivery/shipping address.');
    if (password.length < 6) return setError('Password must be at least 6 characters long.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    // Duplicate check
    const existingUser = DB.getUserByEmail(email);
    if (existingUser) {
      return setError('An account matches this email ID already. Please sign in instead.');
    }

    // Creating user
    const newUser: User = {
      uid: 'user-' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      district: district,
      address: address.trim(),
      hasSetPassword: true,
      password: password,
      createdAt: new Date().toISOString(),
      isAdmin: false
    };

    try {
      await DB.saveUser(newUser);
      DB.setActiveSession(newUser);
      
      setSuccess('Account created successfully! Auto logging in...');
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Failed to save new custom user. Please try again.');
    }
  };

  // Automated Autofill triggers for seamless sandbox interactions
  const fillCredentials = (role: 'admin' | 'customer') => {
    setError('');
    setIsRegisterMode(false);
    if (role === 'admin') {
      setEmail('admin@chinamati.com');
      setPassword('adminpassword123');
    } else {
      const users = DB.getUsers();
      const customer = users.find(u => !u.isAdmin && u.hasSetPassword);
      if (customer) {
        setEmail(customer.email);
        setPassword(customer.password || '');
      } else {
        setEmail('customer@gmail.com');
        setPassword('customer123');
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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
        className={`relative w-full ${isRegisterMode ? 'max-w-md' : 'max-w-sm'} bg-white border border-slate-100 rounded-[30px] shadow-2xl overflow-hidden transition-all duration-300`}
        id="login-dialog-panel"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Layout */}
        <div className="bg-slate-50 px-6 pt-8 pb-5 border-b border-slate-100 text-center relative">
          <div className="h-10 w-10 bg-blue-50 rounded-xl mx-auto flex items-center justify-center border border-blue-100 mb-3">
            {isRegisterMode ? (
              <UserIcon className="h-5 w-5 text-blue-600" />
            ) : (
              <Lock className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900 block uppercase font-sans">
            {isRegisterMode ? 'Create Account' : 'Access Portal'}
          </h2>
          <p className="text-xs text-slate-500 font-sans tracking-wide mt-1">
            {isRegisterMode 
              ? 'Complete registration to trace delivery and view history.' 
              : 'Access secure user levels and Admin system.'}
          </p>
        </div>

        {/* Register / Sign In Navigation Toggles */}
        <div className="px-6 pt-5 flex border-b border-slate-100">
          <button
            onClick={() => {
              setIsRegisterMode(false);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 pb-3 text-xs font-bold font-sans uppercase tracking-wider border-b-2 transition-all ${
              !isRegisterMode 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsRegisterMode(true);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 pb-3 text-xs font-bold font-sans uppercase tracking-wider border-b-2 transition-all ${
              isRegisterMode 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Shortcut Quick Fills — Only show in login mode to prevent cluttering registration */}
        {!isRegisterMode && (
          <div className="px-6 pt-4 pb-1 space-y-2">
            <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest block">Task Fillers Shortcut:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillCredentials('admin')}
                id="autofill-admin-btn"
                type="button"
                className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold font-sans tracking-wide rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all uppercase"
              >
                <KeySquare className="h-3.5 w-3.5 text-blue-600" />
                <span>Admin Fill</span>
              </button>

              <button
                onClick={() => fillCredentials('customer')}
                id="autofill-customer-btn"
                type="button"
                className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold font-sans tracking-wide rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all uppercase"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Client Fill</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Feedback Notifications */}
        <div className="px-6 pt-4">
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
        </div>

        {/* Forms Panel */}
        {isRegisterMode ? (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 max-h-[460px] overflow-y-auto">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-blue-500/60" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tasnim Alam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:border-blue-500 outline-none transition-all focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1">
                  Email ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-blue-500/60" />
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:border-blue-500 outline-none transition-all focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-blue-500/60" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:border-blue-500 outline-none transition-all focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-xs focus:border-blue-500 outline-none transition-all focus:bg-white cursor-pointer"
                >
                  <option value="Dhaka">Dhaka (Inside)</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                  <option value="Outside Dhaka">Other (Outside)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1">
                  Complete Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-blue-500/60" />
                  <input
                    type="text"
                    required
                    placeholder="Street No., House, Area location details"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:border-blue-500 outline-none transition-all focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1">
                  Password (min 6 char)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-blue-500/60" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:border-blue-500 outline-none transition-all focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-blue-500/60" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:border-blue-500 outline-none transition-all focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-widest uppercase rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
            >
              <CheckCircle2 className="h-4 w-4 text-white" />
              <span>Register & Sign In</span>
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
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
        )}

      </motion.div>
    </motion.div>
  );
}
