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
  const sessionUser = DB.getActiveSession();
  const [name, setName] = useState(sessionUser ? sessionUser.name : '');
  const [email, setEmail] = useState(sessionUser ? sessionUser.email : '');
  const [phone, setPhone] = useState(sessionUser ? sessionUser.phone : '');
  const [district, setDistrict] = useState(sessionUser ? (sessionUser.district || 'Dhaka') : 'Dhaka');
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>(
    sessionUser && sessionUser.district && sessionUser.district.toLowerCase() !== 'dhaka' && sessionUser.district.toLowerCase() !== 'inside dhaka' 
      ? 'outside' 
      : 'inside'
  );
  const [address, setAddress] = useState(sessionUser ? sessionUser.address : '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'sslcommerz'>('cod');
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Form submission errors
  const [error, setError] = useState('');

  const navigateFromModal = (sec: string) => {
    onClose();
    window.history.pushState(null, '', `/about/${sec}`);
    window.dispatchEvent(new Event('popstate'));
  };

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
    
    if (!agreedToPolicies) {
      return setError('You must read and agree to the Terms & Conditions, Privacy Policy, and Return & Refund Policy before placing an order.');
    }

    if (paymentMethod === 'sslcommerz') {
      // Call backend to initialize SSLCommerz session
      setIsProcessingPayment(true);
      setError('');

      const tran_id = `TRAN_${Date.now()}`;
      
      fetch(`${import.meta.env.VITE_API_URL}/api/ssl-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total_amount: grandTotal,
          currency: 'BDT',
          tran_id: tran_id,
          cus_name: name,
          cus_email: email,
          cus_add1: address,
          cus_city: deliveryArea === 'inside' ? 'Dhaka' : district,
          cus_postcode: '1000',
          cus_country: 'Bangladesh',
          cus_phone: phone,
          product_name: product.name,
          product_category: product.category || 'General',
          product_profile: 'general'
        }),
      })
      .then(res => {
        if (!res.ok) throw new Error('Backend not available');
        return res.json();
      })
      .then(data => {
        if (data.url) {
          // Save order details to localStorage before redirecting
          // so we can complete it when the user returns
          localStorage.setItem('pending_order', JSON.stringify({
            name,
            email,
            phone,
            district: deliveryArea === 'inside' ? 'Inside Dhaka' : district,
            address,
            productId: product.id,
            quantity,
            paymentMethod,
            tran_id
          }));
          window.location.href = data.url;
        } else {
          setError(data.message || 'Failed to initiate payment session.');
          setIsProcessingPayment(false);
        }
      })
      .catch(err => {
        console.error('SSL Request Error:', err);
        
        // Fallback to simulated payment for testing when backend is not available
        if (confirm('Backend server not available. Use simulated payment for testing?')) {
          // Simulate SSLCommerz redirect
          localStorage.setItem('pending_order', JSON.stringify({
            name,
            email,
            phone,
            district: deliveryArea === 'inside' ? 'Inside Dhaka' : district,
            address,
            productId: product.id,
            quantity,
            paymentMethod,
            tran_id
          }));
          
          // Simulate successful payment after 2 seconds
          setTimeout(() => {
            const pendingOrder = localStorage.getItem('pending_order');
            if (pendingOrder) {
              const orderData = JSON.parse(pendingOrder);
              localStorage.removeItem('pending_order');
              // Redirect to success URL with tran_id
              window.location.href = `${window.location.origin}/payment-success?tran_id=${orderData.tran_id}`;
            }
          }, 2000);
        } else {
          setError('Backend server not available. Please try again later or use Cash on Delivery.');
          setIsProcessingPayment(false);
        }
      });
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
    >
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
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-sans">
              <span>Estimated Delivery Time:</span>
              <span className="font-semibold text-slate-705">
                {deliveryArea === 'inside' ? '2 Days (Inside Dhaka)' : '3 Days (Outside Dhaka)'}
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
                <span className="text-[9px] text-slate-400 font-medium">Fast secured banking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Policy Agreement Checkbox */}
        <div className="border-t border-slate-150/60 pt-4 mt-3 mb-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToPolicies}
              onChange={(e) => setAgreedToPolicies(e.target.checked)}
              className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              style={{ accentColor: '#2563eb' }}
            />
            <span className="text-[10px] sm:text-[11px] text-slate-500 leading-normal font-sans">
              I have read and agree to the{' '}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigateFromModal('terms');
                }}
                className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
              >
                Terms & Conditions
              </span>
              ,{' '}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigateFromModal('privacy');
                }}
                className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
              >
                Privacy Policy
              </span>
              , and{' '}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigateFromModal('refunds');
                }}
                className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
              >
                Return & Refund Policy
              </span>
              .
            </span>
          </label>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            id="btn-complete-checkout"
            disabled={isProcessingPayment}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-widest uppercase rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 disabled:opacity-50"
          >
            {isProcessingPayment ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>PROCESSING...</span>
              </span>
            ) : (
              <>
                <span>CONFIRM ORDER (৳{grandTotal.toLocaleString()})</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="text-center text-[9px] text-slate-400 font-sans tracking-wide mt-2.5 uppercase font-medium">
            🔒 Secured by SSLCommerz and Local 24h Background Enrollment.
          </p>
        </div>

      </form>
     </motion.div>
    </motion.div>
  );
}
