import { X, CreditCard, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';
import React, { useState } from 'react';
import { Product, Order } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/districts';
import { DB } from '../lib/db';
import { motion, AnimatePresence } from 'motion/react';

interface OrderModalProps {
  product: Product;
  quantity: number;
  onClose: () => void;
  onOrderCompleted: (order: Order, isNewUser: boolean) => void;
}

export default function OrderModal({
  product,
  quantity,
  onClose,
  onOrderCompleted
}: OrderModalProps) {
  // Checkout Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'sslcommerz'>('cod');
  
  // Simulated sslcommerz workflow states
  const [showSSLGateway, setShowSSLGateway] = useState(false);
  const [selectedSSLProvider, setSelectedSSLProvider] = useState<'bkash' | 'nagad' | 'visa'>('bkash');
  const [sslPhone, setSslPhone] = useState('');
  const [sslPin, setSslPin] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Form submission errors
  const [error, setError] = useState('');

  const subtotal = product.price * quantity;
  const deliveryCharge = deliveryArea === 'inside' ? 60 : 120;
  const grandTotal = subtotal + deliveryCharge;

  // Handle main submission
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter your full name.');
    if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email address.');
    if (!phone.trim() || phone.length < 11) return setError('Please enter a valid mobile number.');
    if (!address.trim()) return setError('Please enter your complete delivery address.');

    if (paymentMethod === 'sslcommerz') {
      // Prompt simulated SSLCommerz gateway!
      setSslPhone(phone);
      setShowSSLGateway(true);
    } else {
      processFinalOrder();
    }
  };

  // Auto creates background user, logs in, creates order
  const processFinalOrder = () => {
    try {
      const result = DB.placeOrder({
        name,
        email,
        phone,
        district: deliveryArea === 'inside' ? 'Inside Dhaka' : district,
        address,
        productId: product.id,
        quantity,
        paymentMethod
      });

      onOrderCompleted(result.order, result.isNewUser);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while placing your order.');
    }
  };

  // Simulate SSLCommerz transaction
  const handleSSLPaymentSimulation = () => {
    setIsProcessingPayment(true);
    setError('');

    // Short realistic loader delay
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowSSLGateway(false);
      processFinalOrder();
    }, 1800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
    >
      <AnimatePresence mode="wait">
        {!showSSLGateway ? (
          <motion.div 
            key="checkout-details-form"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="relative w-full max-w-lg bg-white border border-slate-100 rounded-[30px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            id="checkout-modal-container"
          >
          {/* Close trigger */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors z-10 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Form Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
              Instant Checkout
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Zero login required. Fill details & complete your order instantly.
            </p>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow custom-scrollbar">
            
            {/* Purchase Item Snippet with subtotal & shipping details */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3.5 shadow-sm">
              <div className="flex gap-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 object-cover rounded-xl border border-slate-100 bg-white flex-shrink-0"
                />
                <div className="flex-grow flex flex-col justify-center">
                  <h4 className="text-slate-900 text-xs font-bold line-clamp-1 font-sans">{product.name}</h4>
                  <p className="text-slate-500 text-[11px] font-sans mt-0.5">
                    Unit Price: ৳{product.price.toLocaleString()} • Qty: {quantity}
                  </p>
                </div>
              </div>

              {/* Subtotal & Delivery calculations */}
              <div className="border-t border-slate-205/60 pt-3 space-y-1.5 text-xs text-slate-600 font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Cart Subtotal:</span>
                  <span className="font-bold text-slate-800">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-505">
                    Delivery Charge ({deliveryArea === 'inside' ? 'Inside Dhaka' : district}):
                  </span>
                  <span className="font-bold text-slate-850">
                    ৳{deliveryCharge}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Estimated Delivery Time:</span>
                  <span className="font-semibold text-slate-700">
                    {deliveryArea === 'inside' ? '5 Days (Inside Dhaka)' : '10 Days (Outside Dhaka)'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-dashed border-slate-200/80 pt-2 bg-blue-50/20 -mx-4 px-4 py-1.5 rounded-b-xl">
                  <span className="text-slate-900 font-bold">Total Amount Due:</span>
                  <span className="font-black text-blue-600 text-sm">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-red-750 text-xs font-sans font-medium">
                {error}
              </div>
            )}

            {/* Buyer Contact details */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adnan Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 text-slate-800 rounded-xl py-3 px-4 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1.5">
                  Email Address (Used for Background Profile Recovery)
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. adnan@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 text-slate-800 rounded-xl py-3 px-4 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 text-slate-800 rounded-xl py-3 px-4 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                  />
                </div>

                {/* Segmented Delivery Select Option */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1.5">
                    Delivery Area Destination
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-1 border border-slate-205 rounded-xl h-[46px] items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryArea('inside');
                        setDistrict('Dhaka');
                      }}
                      className={`h-full text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        deliveryArea === 'inside'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span>Inside Dhaka</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryArea('outside');
                        if (district === 'Dhaka') {
                          setDistrict('Chittagong');
                        }
                      }}
                      className={`h-full text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        deliveryArea === 'outside'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span>Outside Dhaka</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* District Selector (Animated reveal) */}
              <AnimatePresence initial={false}>
                {deliveryArea === 'outside' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1.5">
                      District (Bangladesh)
                    </label>
                    <select
                      id="checkout-district-select"
                      value={district === 'Dhaka' ? 'Chittagong' : district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-205 text-slate-800 rounded-xl py-3 px-3.5 text-sm focus:border-blue-500 outline-none transition-all cursor-pointer focus:bg-white"
                    >
                      {BANGLADESH_DISTRICTS.filter(d => d !== 'Dhaka').map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-1.5">
                  Complete Delivery Address
                </label>
                <textarea
                  required
                  placeholder="House #, Road #, Sector details..."
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 text-slate-800 rounded-xl py-3 px-4 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none focus:bg-white"
                />
              </div>
            </div>

            {/* Payment Systems Switcher */}
            <div className="border-t border-slate-100 pt-4 mt-2">
              <label className="block text-[10px] font-bold text-slate-400 font-sans uppercase tracking-wide mb-2.5">
                Choose Payment Option
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`border rounded-2xl p-4 flex flex-col justify-between h-20 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-blue-50/50 border-blue-500 text-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-350 hover:text-slate-700'
                  }`}
                >
                  <Wallet className="h-4.5 w-4.5" />
                  <div>
                    <h5 className="text-xs font-bold font-sans">CASH ON DELIVERY</h5>
                    <span className="text-[9px] text-slate-400 font-medium">Pay on Hand receipt</span>
                  </div>
                </div>

                {/* SSLCommerz */}
                <div
                  onClick={() => setPaymentMethod('sslcommerz')}
                  className={`border rounded-2xl p-4 flex flex-col justify-between h-20 cursor-pointer transition-all ${
                    paymentMethod === 'sslcommerz'
                      ? 'bg-blue-50/50 border-blue-500 text-blue-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-350 hover:text-slate-700'
                  }`}
                >
                  <CreditCard className="h-4.5 w-4.5" />
                  <div>
                    <h5 className="text-xs font-bold font-sans">SSLCOMMERZ GATEWAY</h5>
                    <span className="text-[9px] text-slate-400 font-medium">Fast simulated banking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-complete-checkout"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-widest uppercase rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
              >
                <span>CONFIRM ORDER (৳{grandTotal.toLocaleString()})</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-center text-[9px] text-slate-400 font-sans tracking-wide mt-2.5 uppercase font-medium">
                🔒 Secured by SSLCommerz and Local 24h Background Enrollment.
              </p>
            </div>

          </form>
         </motion.div>
        ) : (
          /* --- SIMULATED SSLCOMMERZ GATEWAY INTERFACE --- */
          <motion.div 
            key="ssl-sandbox-gateway"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="relative w-full max-w-sm bg-white border border-slate-100 rounded-[30px] shadow-2xl overflow-hidden text-left"
            id="ssl-gateway-simulator"
          >
          {/* Header */}
          <div className="bg-slate-50 p-5 border-b border-slate-150 text-center relative">
            <span className="absolute top-2 left-3 text-[9px] text-blue-600 font-bold tracking-wider">SSLCOMMERZ SANDBOX</span>
            <X 
              className="absolute top-4 right-4 h-4 w-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-0.5 cursor-pointer"
              onClick={() => setShowSSLGateway(false)} 
            />
            <div className="mt-2 text-slate-900 font-extrabold text-sm tracking-widest flex items-center justify-center gap-1.5">
              <span>SSL</span><span className="text-pink-600 font-sans">Commerz</span>
            </div>
            <p className="text-slate-500 text-xs font-sans mt-1">Transaction Total: <span className="text-blue-600 font-bold">৳{grandTotal.toLocaleString()}</span></p>
          </div>

          <div className="p-6 space-y-4">
            
            {/* Payment Method Providers Selector */}
            <div className="space-y-2 font-sans">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Select Mobile / Card Wallet
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSSLProvider('bkash')}
                  className={`py-3 px-2 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    selectedSSLProvider === 'bkash' 
                      ? 'bg-pink-50 border-pink-250 text-pink-600 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider font-bold">bKash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSSLProvider('nagad')}
                  className={`py-3 px-2 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    selectedSSLProvider === 'nagad' 
                      ? 'bg-orange-50 border-orange-250 text-orange-600 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider font-bold">Nagad</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSSLProvider('visa')}
                  className={`py-3 px-2 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    selectedSSLProvider === 'visa' 
                      ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider font-bold">Card / Visa</span>
                </button>
              </div>
            </div>

            {/* Provider Forms */}
            {selectedSSLProvider === 'bkash' || selectedSSLProvider === 'nagad' ? (
              <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 font-sans uppercase tracking-wider mb-1">
                    Your {selectedSSLProvider === 'bkash' ? 'bKash' : 'Nagad'} Wallet ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01712345678"
                    value={sslPhone}
                    onChange={(e) => setSslPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 font-sans uppercase tracking-wider mb-1">
                    Enter Secret PIN (Simulated Safety)
                  </label>
                  <input
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    value={sslPin}
                    onChange={(e) => setSslPin(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 font-sans uppercase tracking-wider mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 font-sans uppercase tracking-wider mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 font-sans uppercase tracking-wider mb-1">
                      CVV / CVN
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={3}
                      className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Simulate Terms summary details */}
            <div className="text-[10px] text-slate-500 space-y-1.5 bg-blue-50/40 p-3.5 rounded-xl border border-blue-100 font-sans">
              <span className="text-slate-850 block font-bold mb-1">Sandbox Simulation Guidelines:</span>
              <p>1. Ensure your Wallet number has 11 digits</p>
              <p>2. Enter any 4-digit token or card credentials</p>
              <p>3. Clicking confirm will instantly credit the transaction total as a 'PAID' order record</p>
            </div>

            {/* Simulation controls */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                id="btn-simulate-sslcommitted"
                disabled={isProcessingPayment}
                onClick={handleSSLPaymentSimulation}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>VERIFYING WITH MERCHANT...</span>
                  </span>
                ) : (
                  <span>SIMULATE CREDIT PAYMENT ৳{grandTotal.toLocaleString()}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowSSLGateway(false)}
                className="w-full py-2.5 bg-white text-slate-500 hover:text-slate-800 border border-slate-200 rounded-2xl text-[10px] font-bold font-sans tracking-wider uppercase transition-all cursor-pointer shadow-sm"
              >
                Cancel & Change Method
              </button>
            </div>

          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
