import { Printer, ShoppingBag, CheckCircle, Clock } from 'lucide-react';
import { Order } from '../types';

interface InvoiceViewProps {
  order: Order;
  onClose?: () => void;
  isModal?: boolean;
}

export default function InvoiceView({
  order,
  onClose,
  isModal = false
}: InvoiceViewProps) {
  
  const handlePrint = () => {
    window.print();
  };

  const itemSubtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const detectedShipping = Math.max(0, order.totalPrice - itemSubtotal);

  const invoiceContent = (
    <div 
      className="bg-white text-slate-800 border border-slate-200/80 p-6 sm:p-8 rounded-[28px] space-y-6 shadow-2xl shadow-slate-200/40 relative invoice-printable"
      id={`invoice-box-${order.id}`}
    >
      {/* Decorative seal / status watermarks */}
      <div className="absolute top-24 right-4 sm:right-8 opacity-[0.08] pointer-events-none uppercase font-sans border-4 border-blue-600 text-blue-600 font-black rounded-lg px-4 py-2 text-2xl sm:text-3xl rotate-12">
        {order.paymentStatus === 'Paid' ? 'PAID IN FULL' : 'COD PENDING'}
      </div>

      {/* Invoice Header details */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        
        {/* Brand identity details */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <span className="text-md font-extrabold tracking-tight text-slate-900 uppercase font-sans">
              CHINA<span className="text-blue-600">MATI</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wider">Imports & Smart Tech Ltd.</p>
          <p className="text-[10px] text-slate-500 font-sans mt-0.5">Gulshan-2, Dhaka – Bangladesh</p>
        </div>

        {/* Invoice labels */}
        <div className="text-left sm:text-right">
          <span className="inline-block bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-bold font-sans uppercase tracking-widest px-2.5 py-1 rounded-full mb-2">
            OFFICIAL RECEIPT
          </span>
          <h2 className="text-xl font-bold font-mono text-slate-950">#{order.invoiceId}</h2>
          <p className="text-[10px] text-slate-500 font-sans mt-1">
            Order Reference: <span className="text-slate-800 font-bold">#{order.id}</span>
          </p>
        </div>
      </div>

      {/* Bill To & Metadata info box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-100 pb-6 text-xs font-sans">
        {/* Client coordinates */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-1">CUSTOMER INFO</span>
          <p className="text-slate-900 text-sm font-extrabold font-sans">{order.userName}</p>
          <p className="text-slate-600 font-medium">Email: {order.userEmail}</p>
          <p className="text-slate-600 font-medium">Phone: {order.userPhone}</p>
          <p className="text-slate-600 font-medium">District: {order.userDistrict}, BD</p>
          <p className="text-slate-500 font-medium">Address: {order.userAddress}</p>
        </div>

        {/* Financial conditions */}
        <div className="space-y-1.5 text-left sm:text-right flex flex-col sm:items-end justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-1">DATE & STATUS</span>
            <p className="text-slate-600 font-medium">
              Issue Date: <span className="text-slate-800 font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
            </p>
            <p className="text-slate-600 font-medium">
              Shipping Carrier: <span className="text-slate-800 font-bold">Metro Express Courier</span>
            </p>
          </div>

          <div className="flex gap-2.5 mt-2">
            <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${
              order.paymentStatus === 'Paid' 
                ? 'bg-green-50 text-green-700 border-green-150' 
                : 'bg-amber-50 text-amber-700 border-amber-100'
            }`}>
              {order.paymentStatus === 'Paid' ? (
                <>
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>TRANSACTION PAID</span>
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3 text-amber-500 animate-pulse" />
                  <span>PAY ON DELIVERY</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Line Items Grid */}
      <div className="border-b border-slate-100 pb-6 text-xs font-sans">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-3">ITEMS ORDERED</span>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wide text-[9px] pb-2 font-bold">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">Unit Price (BDT)</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Sum total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-50 text-slate-700 font-sans">
                  <td className="py-3 pr-2 font-bold text-slate-900 max-w-[200px] truncate">{item.productName}</td>
                  <td className="py-3 text-center">৳{item.price.toLocaleString()}</td>
                  <td className="py-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-3 text-right text-blue-600 font-extrabold text-sm">৳{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculation summations */}
      <div className="flex justify-end font-sans">
        <div className="w-full sm:w-64 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Product Subtotal</span>
            <span className="text-slate-850 font-bold font-mono">৳{itemSubtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Delivery Charge</span>
            <span className="text-slate-850 font-bold font-mono">৳{detectedShipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Payment System Fee</span>
            <span className="text-slate-400 font-mono">৳0.00</span>
          </div>
          <div className="h-px bg-slate-150 my-2" />
          <div className="flex justify-between text-slate-900 text-sm font-extrabold">
            <span>GRAND TOTAL Due</span>
            <span className="text-blue-600 text-base font-extrabold">৳{order.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Smart Terms disclosure */}
      <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-450 font-sans leading-relaxed space-y-1 font-medium">
        <p className="text-slate-500 font-bold uppercase tracking-wider">Security and Return Declarations:</p>
        <p>1. Accounts created in background automatically use the email ID of this invoice record for credentials recovery.</p>
        <p>2. Keep this receipt copy safe for processing replacements/refund support within the next 7 days of package reception.</p>
        <p>3. This is a computer-rendered ledger record. No physically signed validation is mandatory.</p>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-[30px] shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
            <span className="text-[10px] text-blue-600 font-extrabold tracking-widest font-sans uppercase">OFFICIAL MERCHANT INVOICE RECEIPT</span>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 text-xs font-sans font-bold cursor-pointer"
              >
                [ Close ]
              </button>
            )}
          </div>

          {/* Scrollable content wrapping the physical invoice box */}
          <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
            {invoiceContent}
          </div>

          {/* STICKY footer action bar */}
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-150/80 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] flex-shrink-0">
            <div className="text-[10px] font-sans font-bold text-slate-450 uppercase flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>LEDGER # {order.invoiceId}</span>
            </div>
            
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black font-sans tracking-widest uppercase rounded-full cursor-pointer transition-all shadow-md shadow-blue-500/10 hover:scale-[1.01]"
              id="sticky-invoice-download"
            >
              <Printer className="h-4 w-4" />
              <span>Download & Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Stylesheet print override blocks */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice-box-${order.id}, #invoice-box-${order.id} * {
              visibility: visible;
            }
            #invoice-box-${order.id} {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              color: black !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              padding: 0 !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // Static non-modal inline block (for successful order confirmation screens)
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 gap-2 bg-white p-3 rounded-2xl border border-slate-200">
        <span className="text-[10px] font-sans font-bold text-slate-450 uppercase">OFFICIAL CUSTOMER COPY</span>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-105 text-slate-600 text-xs font-bold rounded-full border border-slate-200 cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5 text-blue-600" />
          <span>Print / Save PDF</span>
        </button>
      </div>
      {invoiceContent}
    </div>
  );
}
