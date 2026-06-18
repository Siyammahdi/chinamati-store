import React, { useState } from 'react';
import { User, Order } from '../types';
import { Lock, FileText, Calendar, CheckSquare, Mail, Phone, MapPin, KeyRound, Sparkles, Edit3, Check, Save, ArrowUpRight } from 'lucide-react';
import { DB } from '../lib/db';
import InvoiceView from './InvoiceView';

interface UserDashboardProps {
  currentUser: User;
  onNavigateHome: () => void;
  onViewProduct?: (productId: string) => void;
  onProfileUpdated?: () => void;
}

export default function UserDashboard({
  currentUser,
  onNavigateHome,
  onViewProduct,
  onProfileUpdated
}: UserDashboardProps) {
  // DB query of user orders
  const orders = DB.getOrdersByUser(currentUser.uid).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // States for live profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileDistrict, setProfileDistrict] = useState(currentUser.district);
  const [profileAddress, setProfileAddress] = useState(currentUser.address);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // States for password setup
  const [setupPassword, setSetupPassword] = useState('');
  const [setupError, setSetupError] = useState('');
  const [setupSuccess, setSetupSuccess] = useState('');

  // States for password reset (with simulated verification)
  const [showResetFlow, setShowResetFlow] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Send SMS/Email pin, 2: Enter PIN, 3: Set New Password
  const [resetPinInput, setResetPinInput] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  
  const SIMULATED_PIN = '772211';

  // Active viewed invoice
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Handle profile details amendment
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileName.trim() || !profilePhone.trim() || !profileAddress.trim()) {
      return setProfileError('All profile fields are required.');
    }

    const updatedUser = {
      ...currentUser,
      name: profileName.trim(),
      phone: profilePhone.trim(),
      district: profileDistrict,
      address: profileAddress.trim()
    };

    DB.saveUser(updatedUser);
    DB.setActiveSession(updatedUser);

    setProfileSuccess('Your details have been updated successfully!');
    if (onProfileUpdated) {
      onProfileUpdated();
    }

    setTimeout(() => {
      setIsEditingProfile(false);
      setProfileSuccess('');
    }, 1200);
  };

  // Handle password setup (One time only)
  const handlePasswordSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');
    setSetupSuccess('');

    if (setupPassword.length < 6) {
      return setSetupError('Password must be at least 6 characters.');
    }

    DB.setPassword(currentUser.uid, setupPassword);
    setSetupSuccess('Password saved successfully! You can now log into your account using your email and password.');
    setSetupPassword('');
  };

  // Handle step 1: trigger verification SMS/Email simulator
  const handleTriggerResetVerification = () => {
    setResetError('');
    setResetStep(2); // take to pin verification step
  };

  // Handle step 2: verify PIN
  const handleVerifyResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (resetPinInput !== SIMULATED_PIN) {
      return setResetError('Invalid PIN. Use the demo verification PIN code provided.');
    }

    setResetStep(3); // go to password replacement screen
  };

  // Handle step 3: commit new reset password
  const handleCommitResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (resetNewPassword.length < 6) {
      return setResetError('Password must be at least 6 characters.');
    }

    DB.resetPassword(currentUser.uid, resetNewPassword);
    setResetSuccess('Your password has been changed successfully. You can use it next time.');
    setResetNewPassword('');
    setTimeout(() => {
      setShowResetFlow(false);
      setResetStep(1);
      setResetPinInput('');
      setResetSuccess('');
    }, 2000);
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styling: Record<string, string> = {
      Pending: 'bg-amber-50 text-amber-700 border-amber-200',
      Shipping: 'bg-blue-50 text-blue-700 border-blue-200',
      Delivered: 'bg-green-50 text-green-700 border-green-200',
      Cancelled: 'bg-red-50 text-red-700 border-red-200'
    };
    return styling[status] || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="user-dashboard-wrapper">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
            My Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-sans tracking-wide mt-1 uppercase font-semibold">
            Manage your personal profile, credentials and view legal invoices.
          </p>
        </div>
        <button
          onClick={onNavigateHome}
          className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-full text-xs transition-all cursor-pointer shadow-sm"
        >
          Return to Storefront
        </button>
      </div>

      {/* Main Grid: Left is Profile & Passwords; Right is History list and Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Profile info & password setup (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Profile particulars box */}
          <div className="bg-white border border-slate-100 p-6 rounded-[28px] space-y-5 shadow-2xl shadow-slate-200/45">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 font-sans uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <CheckSquare className="h-4 w-4 text-blue-600" />
                <span>Personal Information</span>
              </h3>
              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 transition-all cursor-pointer hover:underline animate-none"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Update Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setProfileName(currentUser.name);
                    setProfilePhone(currentUser.phone);
                    setProfileDistrict(currentUser.district);
                    setProfileAddress(currentUser.address);
                    setProfileError('');
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                >
                  [ Cancel ]
                </button>
              )}
            </div>

            {profileError && (
              <p className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-red-700 text-xs font-sans font-medium">
                {profileError}
              </p>
            )}
            {profileSuccess && (
              <p className="bg-green-50 border border-green-150 rounded-xl px-3 py-2 text-green-700 text-xs font-sans font-medium">
                {profileSuccess}
              </p>
            )}

            {!isEditingProfile ? (
              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <CheckSquare className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-sans font-bold">Full Name</span>
                    <span className="text-slate-900 font-extrabold font-sans">{currentUser.name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-sans font-bold">Registered Email</span>
                    <span className="text-slate-800 font-sans">{currentUser.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-sans font-bold">Mobile Phone</span>
                    <span className="text-slate-800 font-sans font-medium">{currentUser.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-sans font-bold">District & Address</span>
                    <span className="text-slate-800 font-sans font-semibold">{currentUser.district}</span>
                    <p className="text-xs text-slate-500 mt-0.5 leading-normal">{currentUser.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 font-sans">
                  <Calendar className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-bold">Joined Since</span>
                    <span className="text-xs font-bold text-slate-600 font-mono">
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 focus:border-blue-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Registered Email (System Lock)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-450 rounded-xl py-3 px-3 cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Mobile Coordinates
                  </label>
                  <input
                    type="text"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 focus:border-blue-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Shipping District
                  </label>
                  <select
                    value={profileDistrict}
                    onChange={(e) => setProfileDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 focus:border-blue-500 outline-none transition-all font-bold cursor-pointer"
                  >
                    <option value="Dhaka">Dhaka (৳60 delivery charge)</option>
                    <option value="Chittagong">Chittagong (৳120 delivery charge)</option>
                    <option value="Rajshahi">Rajshahi (৳120 delivery charge)</option>
                    <option value="Sylhet">Sylhet (৳120 delivery charge)</option>
                    <option value="Khulna">Khulna (৳120 delivery charge)</option>
                    <option value="Barisal">Barisal (৳120 delivery charge)</option>
                    <option value="Rangpur">Rangpur (৳120 delivery charge)</option>
                    <option value="Mymensingh">Mymensingh (৳120 delivery charge)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Detailed Delivery Address
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-805 rounded-xl py-2 px-3 focus:border-blue-500 outline-none transition-all font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Profile Updates</span>
                </button>
              </form>
            )}
          </div>

          {/* PASSWORD FLOW (First-time custom password vs reset password) */}
          <div className="bg-white border border-slate-100 p-6 rounded-[28px] space-y-4 shadow-2xl shadow-slate-200/45">
            
            {/* FIRST TIME PASSWORD SETUP: Hidden if hasSetPassword === true */}
            {!currentUser.hasSetPassword ? (
              <div className="space-y-4" id="first-time-pass-setup-container">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl font-sans">
                  <h4 className="text-blue-600 text-xs font-bold font-sans tracking-wider uppercase flex items-center gap-1.5 mb-1">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>Background Account Created</span>
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    At Chinamati, we registered your profile in the background so you didn't have to fill credentials. Set up a secure system password now so you can login dynamically next time!
                  </p>
                </div>

                <form onSubmit={handlePasswordSetup} className="space-y-3 font-sans">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Enter New Account password
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters..."
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                      className="flex-grow bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      Save Password
                    </button>
                  </div>
                  {setupError && <p className="text-red-600 text-xs font-medium font-sans">{setupError}</p>}
                  {setupSuccess && <p className="text-green-600 text-xs font-medium font-sans">{setupSuccess}</p>}
                </form>
              </div>
            ) : (
              /* IF PASSWORD IS ALREADY IN PLACE: PASSWORD RESET MECHANISM WITH SIMULATED VERIFICATION */
              <div className="space-y-4 font-sans" id="reset-password-flow-container">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4 text-blue-600" />
                  <span>Account Credentials</span>
                </h3>

                <div className="flex items-center justify-between transition-all">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Lock className="h-3.5 w-3.5 text-blue-600" />
                    <span>Password status: <strong className="text-blue-600 uppercase font-sans font-extrabold">ACTIVE / SET</strong></span>
                  </div>
                  {!showResetFlow && (
                    <button
                      onClick={() => {
                        setShowResetFlow(true);
                        setResetStep(1);
                      }}
                      className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-full text-xs font-bold cursor-pointer transition-all"
                    >
                      Reset Password
                    </button>
                  )}
                </div>

                {/* Simulated Verification flow stages */}
                {showResetFlow && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-[9px] text-blue-600 font-bold tracking-wider uppercase">Safe Recovery Process</span>
                      <button 
                        onClick={() => setShowResetFlow(false)} 
                        className="text-slate-400 hover:text-slate-750 text-[10px] font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Step 1: Request SMS dispatch simulation */}
                    {resetStep === 1 && (
                      <div className="space-y-3">
                        <p className="text-[11px] text-slate-600 leading-normal">
                          For security, we must dispatch a simulated verification PIN code to your email (<strong>{currentUser.email}</strong>) and mobile coordinates before setting a new password.
                        </p>
                        <button
                          type="button"
                          onClick={handleTriggerResetVerification}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-lg transition-all cursor-pointer shadow-sm"
                        >
                          Dispatched Verification PIN Code
                        </button>
                      </div>
                    )}

                    {/* Step 2: Input SMS validation PIN */}
                    {resetStep === 2 && (
                      <form onSubmit={handleVerifyResetPin} className="space-y-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 mb-2 shadow-sm">
                          <p className="text-[10px] text-blue-600 font-bold tracking-wide uppercase">
                            SIMULATED MESSAGE OUTLET:
                          </p>
                          <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                            Your password reset PIN code is: <strong className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded tracking-widest font-extrabold">{SIMULATED_PIN}</strong>
                          </p>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">
                            Enter the 6-Digit Verification PIN Code:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="e.g. 772211"
                              value={resetPinInput}
                              onChange={(e) => setResetPinInput(e.target.value)}
                              className="flex-grow bg-white border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs focus:border-blue-500 outline-none transition-all placeholder:text-slate-450"
                            />
                            <button
                              type="submit"
                              className="px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
                            >
                              Verify Code
                            </button>
                          </div>
                          {resetError && <p className="text-red-600 text-xs font-semibold mt-1">{resetError}</p>}
                        </div>
                      </form>
                    )}

                    {/* Step 3: Enter the ultimate new password */}
                    {resetStep === 3 && (
                      <form onSubmit={handleCommitResetPassword} className="space-y-3">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase">
                          Enter New Replacement Password:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            required
                            placeholder="At least 6 characters..."
                            value={resetNewPassword}
                            onChange={(e) => setResetNewPassword(e.target.value)}
                            className="flex-grow bg-white border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs focus:border-blue-500 outline-none transition-all placeholder:text-slate-450"
                          />
                          <button
                            type="submit"
                            className="px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
                          >
                            Update Password
                          </button>
                        </div>
                        {resetError && <p className="text-red-700 text-xs font-semibold mt-1">{resetError}</p>}
                        {resetSuccess && <p className="text-green-700 text-xs font-semibold mt-1">{resetSuccess}</p>}
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Order History & Interactive Invoice stage (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* History ledger container */}
          <div className="bg-white border border-slate-100 p-6 rounded-[28px] shadow-2xl shadow-slate-200/45">
            <h3 className="text-xs font-bold text-slate-900 font-sans uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5 mb-5">
              <FileText className="h-4 w-4 text-blue-600" />
              <span>Purchase Order History</span>
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-3">
                <FileText className="h-10 w-10 mx-auto text-slate-200" />
                <p className="text-sm font-medium font-sans">You haven't placed any purchases yet.</p>
                <button
                  onClick={onNavigateHome}
                  className="mt-3 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase rounded-full hover:bg-blue-700 transition-all cursor-pointer shadow-md shadow-blue-500/10"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const firstItem = ord.items[0];
                  const linkedProduct = firstItem ? DB.getProductById(firstItem.productId) : null;

                  return (
                    <div
                      key={ord.id}
                      className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-200 transition-all shadow-sm hover:bg-slate-50"
                    >
                      {/* Sum items and identifiers with product thumbnail */}
                      <div className="flex gap-3.5 items-start font-sans">
                        {linkedProduct && (
                          <img
                            src={linkedProduct.imageUrl}
                            alt={linkedProduct.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-cover rounded-xl border border-slate-150 flex-shrink-0 bg-white shadow-sm"
                          />
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-950">Order ID: #{ord.id}</span>
                            <span className={`text-[9px] font-bold font-sans px-2 py-0.5 rounded-full border ${getStatusBadge(ord.status)}`}>
                              {ord.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-slate-500">
                            Ordered: <span className="text-slate-800 font-semibold">{new Date(ord.createdAt).toLocaleDateString()}</span>
                          </p>

                          <p className="text-[11px] text-slate-600 font-semibold">
                            Paid Total: <span className="text-blue-600 font-extrabold text-xs">৳{ord.totalPrice.toLocaleString()}</span>
                          </p>

                          {/* LINKED SPECIFIC PRODUCT ELEMENT */}
                          {linkedProduct && onViewProduct ? (
                            <button
                              type="button"
                              onClick={() => onViewProduct(linkedProduct.id)}
                              className="mt-1 text-[10px] font-extrabold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 cursor-pointer bg-blue-50 px-2 py-1 rounded-lg"
                              title="Click to view product specifications page"
                            >
                              <span>Item: {firstItem.productName}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-blue-500" />
                            </button>
                          ) : (
                            <p className="text-[11px] text-slate-500 font-semibold">
                              Item: {firstItem?.productName || 'Gadget Item'}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* View Invoice trigger */}
                      <button
                        id={`btn-view-invoice-${ord.id}`}
                        onClick={() => setSelectedOrderForInvoice(ord)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm flex-shrink-0"
                      >
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                        <span>View Invoice</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Invoice detail display drawer */}
          {selectedOrderForInvoice && (
            <InvoiceView 
              order={selectedOrderForInvoice} 
              isModal={true} 
              onClose={() => setSelectedOrderForInvoice(null)} 
            />
          )}

        </div>

      </div>
    </div>
  );
}
