import React, { useState, useEffect } from 'react';
import { User, Order, Product, Category } from '../types';
import { DB } from '../lib/db';
import { 
  ShieldAlert, ShoppingBag, ClipboardList, Users, Settings, 
  Search, Plus, Trash2, Edit, FileText, MapPin, Tag, Star,
  Database, CloudLightning, RefreshCw, Upload, Download, Copy, Check
} from 'lucide-react';
import { isSupabaseConfigured, pullFromSupabase, pushToSupabase } from '../lib/supabase';
import InvoiceView from './InvoiceView';

interface AdminDashboardProps {
  currentUser: User;
  onNavigateHome: () => void;
  dbVersion?: number;
}

export default function AdminDashboard({
  currentUser,
  onNavigateHome,
  dbVersion
}: AdminDashboardProps) {
  // Navigation tabs of administrative panel
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers' | 'profile' | 'supabase'>('orders');

  // Supabase live settings
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Administrative action tracking states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Master collections from Local store
  const [orders, setOrders] = useState<Order[]>(() => DB.getOrders());
  const [products, setProducts] = useState<Product[]>(() => DB.getProducts());
  const [users, setUsers] = useState<User[]>(() => DB.getUsers().filter(u => !u.isAdmin));

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Product formulation states (For create/edit)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pCategory, setPCategory] = useState<Category>('gadgets');
  const [pPrice, setPPrice] = useState(250);
  const [pStock, setPStock] = useState(50);
  const [pImgUrl, setPImgUrl] = useState('');
  const [pSpecs, setPSpecs] = useState<string>('Connector: USB\nPower: Electric\nBody: ABS Plastic');

  // View invoice state
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  // Quick Stats
  const totalCompletedSales = orders
    .filter(o => o.status === 'Delivered' || (o.status as string) === 'Delivered font-bold')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // --- ACTIONS ---
  const reloadData = () => {
    setOrders(DB.getOrders());
    setProducts(DB.getProducts());
    setUsers(DB.getUsers().filter(u => !u.isAdmin));
  };

  // Watch for external reactive synchronization versions (like background start-up / navigation updates)
  useEffect(() => {
    reloadData();
  }, [dbVersion]);

  const handleSupabasePull = async () => {
    setSyncLoading(true);
    setSyncStatus(null);
    const result = await pullFromSupabase();
    setSyncStatus(result);
    setSyncLoading(false);
    if (result.success) {
      reloadData();
    }
  };

  const handleSupabasePush = async () => {
    setSyncLoading(true);
    setSyncStatus(null);
    const result = await pushToSupabase();
    setSyncStatus(result);
    setSyncLoading(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // 1. UPDATE ORDER STATUS
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const order = DB.getOrderById(orderId);
    if (order) {
      const updatedOrder: Order = {
        ...order,
        status: newStatus,
        paymentStatus: newStatus === 'Delivered' ? 'Paid' : order.paymentStatus
      };
      setActionLoading(true);
      setActionError(null);
      const res = await DB.saveOrder(updatedOrder);
      setActionLoading(false);
      if (res && !res.success) {
        setActionError(`Failed to update order status in Supabase: ${res.error?.message || 'Access Denied / Foreign Key restriction.'}`);
      } else {
        reloadData();
        if (activeInvoiceOrder && activeInvoiceOrder.id === orderId) {
          setActiveInvoiceOrder(updatedOrder);
        }
      }
    }
  };

  // 1b. DELETE ORDER
  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Are you absolute sure you want to delete this order? This action cannot be undone.')) {
      setActionLoading(true);
      setActionError(null);
      const res = await DB.deleteOrder(orderId);
      setActionLoading(false);
      if (res && !res.success) {
        setActionError(`Failed to delete order from Supabase: ${res.error?.message || 'Access Denied.'}`);
      } else {
        reloadData();
        if (activeInvoiceOrder && activeInvoiceOrder.id === orderId) {
          setActiveInvoiceOrder(null);
        }
      }
    }
  };

  // 2. CREATE / UPDATE PRODUCTS
  const startCreateProduct = () => {
    setEditingProduct(null);
    setPId('prod-' + Math.random().toString(36).substr(2, 5));
    setPName('');
    setPDesc('');
    setPCategory('gadgets');
    setPPrice(250);
    setPStock(50);
    setPImgUrl('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80');
    setPSpecs('Warranty: 7 Days Replacements\nQuality: Certified\nPower Source: Batteries');
    setShowProductForm(true);
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPId(prod.id);
    setPName(prod.name);
    setPDesc(prod.description);
    setPCategory(prod.category);
    setPPrice(prod.price);
    setPStock(prod.stock);
    setPImgUrl(prod.imageUrl);
    setPSpecs(prod.specs.join('\n'));
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return alert('Product name is required.');
    if (pPrice <= 0) return alert('Invalid price.');

    const newSpecsArray = pSpecs.split('\n').filter(line => line.trim() !== '');

    const updatedProduct: Product = {
      id: pId,
      name: pName,
      description: pDesc,
      price: pPrice,
      imageUrl: pImgUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
      rating: editingProduct ? editingProduct.rating : (4.0 + Math.random() * 1.0), // Seed a realistic mock rating
      reviewsCount: editingProduct ? editingProduct.reviewsCount : Math.floor(20 + Math.random() * 180),
      specs: newSpecsArray,
      category: pCategory,
      stock: pStock
    };

    setSavingProduct(true);
    setActionError(null);
    const res = await DB.saveProduct(updatedProduct);
    setSavingProduct(false);

    if (res && !res.success) {
      setActionError(`Failed to save product in Supabase: ${res.error?.message || 'Access Denied.'}`);
      alert(`Supabase Sync Warning:\n\n${res.error?.message || 'Row Level Security policy blocked this update.'}\n\nPlease run the SQL Schema update script or disable RLS in your Supabase products table settings!`);
    } else {
      setShowProductForm(false);
      setEditingProduct(null);
      reloadData();
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you absolute sure you want to delete this product?')) {
      setActionLoading(true);
      setActionError(null);
      const res = await DB.deleteProduct(productId);
      setActionLoading(false);
      if (res && !res.success) {
        setActionError(`Failed to delete product from Supabase: ${res.error?.message || 'Access Denied.'}`);
      } else {
        reloadData();
      }
    }
  };

  // 3. DELETE CUSTOMER PROFILE
  const handleDeleteCustomer = async (uid: string) => {
    if (confirm('Are you absolute sure you want to delete this customer? This will clear their user profile.')) {
      setActionLoading(true);
      setActionError(null);
      const res = await DB.deleteUser(uid);
      setActionLoading(false);
      if (res && !res.success) {
        setActionError(`Failed to delete customer from Supabase: ${res.error?.message || 'Access Denied.'}`);
      } else {
        reloadData();
      }
    }
  };

  // --- COMPUTE ACTIVE LIST FILTERS OVER SEARCH QUERY ---
  // "admin can search any order or user by name, email, phone or location."
  const meetsSearchCriteria = (item: any) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    
    // For orders
    if (item && item.userName !== undefined) {
      return (
        (item.id || '').toLowerCase().includes(query) ||
        (item.userName || '').toLowerCase().includes(query) ||
        (item.userEmail || '').toLowerCase().includes(query) ||
        (item.userPhone || '').includes(query) ||
        (item.userDistrict || '').toLowerCase().includes(query) ||
        (item.userAddress || '').toLowerCase().includes(query)
      );
    }
    
    // For users / customers
    if (item && item.uid !== undefined) {
      return (
        (item.uid || '').toLowerCase().includes(query) ||
        (item.name || '').toLowerCase().includes(query) ||
        (item.email || '').toLowerCase().includes(query) ||
        (item.phone || '').includes(query) ||
        (item.district || '').toLowerCase().includes(query) ||
        (item.address || '').toLowerCase().includes(query)
      );
    }

    // For products
    if (item && item.category !== undefined) {
      return (
        (item.name || '').toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query)
      );
    }

    return false;
  };

  const filteredOrders = orders.filter(meetsSearchCriteria).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredCustomers = users.filter(meetsSearchCriteria);

  const filteredProducts = products.filter(meetsSearchCriteria);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="admin-dashboard-container">
      
      {/* Upper Meta metrics layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-blue-600 font-sans uppercase">CONFIDENTIAL MANAGEMENT CONSOLE</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
            Chinamati Admin Panel
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1 uppercase font-semibold">
            Control shop inventory, process pending shipments and compile financial invoices.
          </p>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-full text-xs transition-all cursor-pointer shadow-sm"
          >
            Live Web Window
          </button>
          
          <button
            onClick={startCreateProduct}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-blue-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Create product</span>
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start justify-between gap-3 text-xs font-sans">
          <div className="flex gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Database Sync Action Blocked</p>
              <p className="text-red-700/90 mt-0.5">{actionError}</p>
              <p className="text-[10px] text-red-500 font-medium uppercase tracking-wider mt-2">
                Action Needed in Supabase: Check if products table exists, or run the ALTER TABLE ... DISABLE ROW LEVEL SECURITY command!
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActionError(null)}
            className="text-red-500 hover:text-red-800 font-bold p-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {actionLoading && (
        <div className="mb-6 p-4 bg-blue-50/70 border border-blue-100 text-blue-800 rounded-2xl flex items-center gap-3 text-xs font-sans animate-pulse">
          <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
          <span>Synchronizing administrative change with live Supabase database...</span>
        </div>
      )}

      {/* Quick stats boxes row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 border border-slate-100 rounded-[24px] shadow-2xl shadow-slate-200/40 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wide">Gross Delivered Sales</span>
          <span className="text-blue-600 text-xl sm:text-2xl font-extrabold font-sans mt-2">৳{totalCompletedSales.toLocaleString()}</span>
        </div>
        <div className="bg-white p-5 border border-slate-100 rounded-[24px] shadow-2xl shadow-slate-200/40 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wide">Total Incoming Orders</span>
          <span className="text-slate-900 text-xl sm:text-2xl font-extrabold font-sans mt-2">{orders.length} Orders</span>
        </div>
        <div className="bg-white p-5 border border-slate-100 rounded-[24px] shadow-2xl shadow-slate-200/40 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wide">Registered Client DB</span>
          <span className="text-slate-900 text-xl sm:text-2xl font-extrabold font-sans mt-2">{users.length} Clients</span>
        </div>
        <div className="bg-white p-5 border border-slate-100 rounded-[24px] shadow-2xl shadow-slate-200/40 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-wide">Available Catalog</span>
          <span className="text-slate-900 text-xl sm:text-2xl font-extrabold font-sans mt-2">{products.length} Items</span>
        </div>
      </div>

      {/* Control tab controls switcher & Master collections search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-t border-slate-200 pt-6 mb-8">
        
        {/* Navigation panel */}
        <div className="lg:col-span-8 flex flex-wrap items-center gap-2 font-sans">
          <button
            id="tab-orders"
            onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
            className={`px-4.5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders' 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>Orders Log ({orders.length})</span>
          </button>

          <button
            id="tab-products"
            onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
            className={`px-4.5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'products' 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Products Catalog ({products.length})</span>
          </button>

          <button
            id="tab-customers"
            onClick={() => { setActiveTab('customers'); setSearchQuery(''); }}
            className={`px-4.5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'customers' 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Background Clients ({users.length})</span>
          </button>

          <button
            id="tab-profile"
            onClick={() => { setActiveTab('profile'); setSearchQuery(''); }}
            className={`px-4.5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile' 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Admin Profile</span>
          </button>

          <button
            id="tab-supabase"
            onClick={() => { setActiveTab('supabase'); setSearchQuery(''); }}
            className={`px-4.5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'supabase' 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Supabase Control</span>
          </button>
        </div>

        {/* Global Search Bar */}
        {activeTab !== 'profile' && activeTab !== 'supabase' && (
          <div className="lg:col-span-4 relative font-sans">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-blue-500" />
            <input
              id="admin-dashboard-search"
              type="text"
              placeholder={`Search ${activeTab}... (e.g. name, email)`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs font-sans focus:border-blue-500 outline-none transition-all placeholder:text-slate-450 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* --- SELECTED TAB STAGE --- */}

      {/* 1. ORDERS MANAGER TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6" id="panel-orders">
          
          <div className="overflow-hidden bg-white border border-slate-100 rounded-[28px] shadow-2xl shadow-slate-200/40">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-[10px] uppercase font-bold tracking-wider font-sans">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer info</th>
                  <th className="p-4">Location (District)</th>
                  <th className="p-4 text-center">Items (Sum)</th>
                  <th className="p-4 text-center">Gateway</th>
                  <th className="p-4 text-center">Dispatch Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 font-semibold font-sans">
                      No matching order records found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50 text-slate-700 transition-colors">
                      <td className="p-4">
                        <span className="text-slate-950 font-bold block">#{ord.id}</span>
                        <span className="text-[10px] text-slate-400">{new Date(ord.createdAt).toLocaleString()}</span>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <strong className="text-slate-900 block font-sans font-bold">{ord.userName}</strong>
                        <span className="text-slate-500 block">{ord.userEmail}</span>
                        <span className="text-slate-400 text-[10px] block font-medium">{ord.userPhone}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-800 font-bold flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                          <span>{ord.userDistrict}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 max-w-[150px] truncate block mt-0.5 font-medium" title={ord.userAddress}>{ord.userAddress}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-blue-600 font-extrabold text-sm block">৳{ord.totalPrice.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 font-bold block max-w-[120px] truncate">{ord.items[0]?.productName}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          ord.paymentMethod === 'sslcommerz' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}>
                          {ord.paymentMethod.toUpperCase()}
                        </span>
                        <span className={`text-[10px] block mt-1 font-bold ${ord.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                          {ord.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      {/* Status selectors */}
                      <td className="p-4 text-center">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                          className="bg-slate-50 text-slate-700 border border-slate-200 text-[11px] rounded-lg p-1.5 focus:bg-white outline-none cursor-pointer focus:border-blue-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipping">Shipping</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Compile Invoice Ledger"
                            onClick={() => setActiveInvoiceOrder(ord)}
                            className="bg-white border border-slate-200 text-blue-600 hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                          <button
                            title="Delete Order Entry"
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="bg-white border border-slate-200 text-red-500 hover:text-red-700 p-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Collapsible overlay invoice display block */}
          {activeInvoiceOrder && (
            <InvoiceView 
              order={activeInvoiceOrder} 
              isModal={true} 
              onClose={() => setActiveInvoiceOrder(null)} 
            />
          )}

        </div>
      )}

      {/* 2. PRODUCTS MANAGER CATALOGS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6" id="panel-products">
          
          {/* Dynamic Create/Edit product drawer */}
          {showProductForm && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white border border-slate-150 p-6 rounded-[28px] shadow-2xl shadow-slate-250 animate-scale-up w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5 flex-shrink-0">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase font-sans">
                    <Tag className="h-4.5 w-4.5 text-blue-600" />
                    <span>{editingProduct ? 'Update Store Goods ID' : 'Enroll New Shop Item'}</span>
                  </h3>
                  <button
                    onClick={() => setShowProductForm(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-sans font-semibold cursor-pointer"
                  >
                    [ Close ]
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-grow pr-1 pb-2">
                  <div className="space-y-3 font-sans">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Product Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Smart LED Lamp"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-xs focus:border-blue-500 outline-none focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Item Description</label>
                      <textarea
                        required
                        placeholder="Brief specifications summary..."
                        rows={3}
                        value={pDesc}
                        onChange={(e) => setPDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-xs focus:border-blue-500 outline-none resize-none focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Catalog Section</label>
                        <select
                          value={pCategory}
                          onChange={(e) => setPCategory(e.target.value as Category)}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-2 text-xs focus:border-blue-500 outline-none cursor-pointer focus:bg-white"
                        >
                          <option value="gadgets">Gadgets</option>
                          <option value="kitchen">Kitchen</option>
                          <option value="home">Home</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Price (BDT)</label>
                        <input
                          type="number"
                          required
                          value={pPrice}
                          onChange={(e) => setPPrice(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-xs focus:border-blue-500 outline-none focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Stock Vol</label>
                        <input
                          type="number"
                          required
                          value={pStock}
                          onChange={(e) => setPStock(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-xs focus:border-blue-500 outline-none focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 font-sans">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Image Network Address</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/promo..."
                        value={pImgUrl}
                        onChange={(e) => setPImgUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-xs focus:border-blue-500 outline-none focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Technical Specs (Newline Isolated)</label>
                      <textarea
                        placeholder="Property: Value&#151;Capacity: 500ml"
                        rows={3}
                        value={pSpecs}
                        onChange={(e) => setPSpecs(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-xs focus:border-blue-500 outline-none resize-none focus:bg-white"
                      />
                    </div>

                    <div className="pt-4 flex justify-end gap-2 text-xs">
                      <button
                        type="button"
                        disabled={savingProduct}
                        onClick={() => setShowProductForm(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-slate-600 font-bold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingProduct}
                        className={`px-6 py-2 ${savingProduct ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold uppercase rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 disabled:cursor-not-allowed`}
                      >
                        {savingProduct ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Saving Unit...</span>
                          </>
                        ) : (
                          editingProduct ? 'Commit Changes' : 'Enroll Goods'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products listings table */}
          <div className="overflow-hidden bg-white border border-slate-100 rounded-[28px] shadow-2xl shadow-slate-200/40">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-[10px] uppercase font-bold tracking-wider font-sans">
                  <th className="p-4">Visual Thumb/ID</th>
                  <th className="p-4">Goods Name</th>
                  <th className="p-4 font-center">Category</th>
                  <th className="p-4 text-center">Unit Price</th>
                  <th className="p-4 text-center">Stock remaining</th>
                  <th className="p-4 text-center">Metrics rating</th>
                  <th className="p-4 text-right">Edit Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 font-bold font-sans">
                      No matching goods found under active search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50 text-slate-705 transition-all">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="h-10 w-10 object-cover rounded-lg border border-slate-150 shadow-sm"
                        />
                        <span className="text-slate-400 font-mono text-[10px]">{prod.id}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-900 font-bold block">{prod.name}</span>
                        <span className="text-[10px] text-slate-400 block max-w-[250px] truncate font-medium">{prod.description}</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-105 text-[10px] uppercase text-blue-605 font-bold tracking-wider">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-slate-900 font-bold font-sans">৳{prod.price.toLocaleString()}</span>
                      </td>
                      <td className="p-4 text-center font-sans">
                        <span className={`font-bold ${prod.stock <= 20 ? 'text-red-500 font-extrabold animate-pulse' : 'text-slate-750'}`}>
                          {prod.stock} Units
                        </span>
                      </td>
                      <td className="p-4 text-center font-sans">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-amber-500 font-extrabold">{prod.rating}</span>
                          <span className="text-slate-400 font-medium">({prod.reviewsCount})</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEditProduct(prod)}
                            className="bg-white border border-slate-205 text-blue-600 hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="bg-white border border-slate-205 text-red-500 hover:text-red-700 p-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 3. CUSTOMERS/CLIENTS LIST TAB */}
      {activeTab === 'customers' && (
        <div className="space-y-6" id="panel-customers">
          
          <div className="overflow-hidden bg-white border border-slate-100 rounded-[28px] shadow-2xl shadow-slate-200/40">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 text-[10px] uppercase font-bold tracking-wider font-sans">
                  <th className="p-4">Customer ID & Date</th>
                  <th className="p-4">Particular Identity Name</th>
                  <th className="p-4">Contact email</th>
                  <th className="p-4">Cell phone</th>
                  <th className="p-4">Location (District)</th>
                  <th className="p-4 text-center">Autosignup Status</th>
                  <th className="p-4 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 font-semibold font-sans">
                      No matching customer accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(cust => {
                    const custOrders = orders.filter(o => o.userId === cust.uid);
                    return (
                      <tr key={cust.uid} className="hover:bg-slate-50 text-slate-700 transition-colors">
                        <td className="p-4">
                          <span className="text-slate-900 font-bold block">{cust.uid}</span>
                          <span className="text-[10px] text-slate-400">{new Date(cust.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="p-4">
                          <strong className="text-slate-900 font-sans text-md font-bold block">{cust.name}</strong>
                          <span className="text-[10px] text-slate-400 font-sans block font-semibold">Order Submissions: ({custOrders.length})</span>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-650 flex items-center gap-1.5">
                            <span>{cust.email}</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-900 font-bold">{cust.phone}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-800 flex items-center gap-1 font-bold">
                            <MapPin className="h-3.5 w-3.5 text-blue-500" />
                            <span>{cust.district}</span>
                          </span>
                          <p className="text-[10px] text-slate-400 max-w-[150px] truncate block mt-0.5" title={cust.address}>{cust.address}</p>
                        </td>
                        <td className="p-4 text-center font-sans">
                          <span className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                            cust.hasSetPassword 
                              ? 'bg-blue-50 text-blue-600 border-blue-105' 
                              : 'bg-slate-50 text-slate-450 border-slate-200'
                          }`}>
                            {cust.hasSetPassword ? 'CREDS RECLAIMED' : 'BACKSTAGE AUTO'}
                          </span>
                        </td>
                        <td className="p-4 text-right cursor-pointer">
                          <button
                            onClick={() => handleDeleteCustomer(cust.uid)}
                            className="bg-white border border-slate-205 text-red-500 hover:text-red-700 p-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                            title="Delete Customer profile details"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 4. ADMIN PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="space-y-6" id="panel-profile font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-100 shadow-2xl shadow-slate-250/30 p-6 sm:p-8 rounded-[28px] backdrop-blur-sm">
            <div className="space-y-5 font-sans text-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase pb-2 border-b border-slate-100 flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-600" />
                <span>Active Credentials Particulars</span>
              </h3>
              
              <div className="space-y-4 font-sans text-slate-700 text-sm">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Access Tier Role</span>
                  <p className="text-slate-900 font-extrabold text-sm flex items-center gap-1.5">
                    <ShieldAlert className="h-4.5 w-4.5 text-blue-600" />
                    <span>STOREHEAD SYSTEM ADMINISTRATOR</span>
                  </p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Primary Email</span>
                  <p className="text-slate-900 font-extrabold">{currentUser.email}</p>
                </div>

                <div className="space-y-1 font-sans">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Base HQ Location</span>
                  <p className="text-slate-800 font-semibold">{currentUser.address}</p>
                </div>

                <div className="space-y-1 font-sans">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Security State Token</span>
                  <p className="text-slate-450 font-mono select-all text-xs">gs_sec_token_hash_a84bb904d99c4ffbb</p>
                </div>
              </div>
            </div>

            {/* Quick tips card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 flex flex-col justify-between font-sans">
              <div className="space-y-2">
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">Admin Sandbox guidelines</span>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  As the shop administrator, you possess full reading, writing, and deletions authorization over core system datasets stored in local memory.
                </p>
                <p className="text-xs text-slate-500 leading-relaxed mt-2 font-sans font-medium">
                  All changes are reactive and immediately adjust live client views. The default password setup bypasses verification, allowing quick order generation debugging.
                </p>
              </div>

              <div className="border-t border-slate-205 pt-4 mt-4 flex items-center justify-between text-[11px] text-slate-450">
                <span>System Health Indicator:</span>
                <span className="text-blue-600 font-extrabold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>ONLINE / SYNCED</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUPABASE CLOUD INTEGRATION VIEW */}
      {activeTab === 'supabase' && (
        <div className="space-y-8 font-sans" id="panel-supabase">
          
          {/* Main Hero Header Info Card */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-[30px] border border-white/[0.05] shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 bg-blue-500/10 h-72 w-72 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 position-relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.06] rounded-full text-[10px] font-bold tracking-wider tracking-widest uppercase border border-white/[0.08]">
                  <Database className="h-3.5 w-3.5 text-blue-400" />
                  <span>SUPABASE INTEGRATION HUB</span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">Connect your Live SQL Backend</h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Supabase provides full PostgreSQL databases, instant RESTful APIs, real-time sync mechanisms, and storage wrappers. Below you can manage schema replication, pull or push existing datasets, and read the connection setup guides.
                </p>
              </div>

              {/* Live Indicator */}
              <div className="flex-shrink-0 bg-white/[0.04] p-4 rounded-2xl border border-white/[0.06] min-w-[200px] text-center font-mono text-xs">
                <span className="text-slate-400 uppercase text-[9px] font-bold tracking-wider block mb-2">Cloud Synced Indicator</span>
                {isSupabaseConfigured() ? (
                  <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-extrabold">
                    <CloudLightning className="h-4.5 w-4.5 animate-bounce" />
                    <span>STATUS: READY</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-amber-500 text-sm font-extrabold">
                    <Database className="h-4.5 w-4.5" />
                    <span>STATUS: UNCONFIGURED</span>
                  </div>
                )}
                <span className="text-[10px] text-slate-500 mt-2 block font-medium">
                  {isSupabaseConfigured() ? 'Connected & listening live.' : 'Fallback: localStorage active'}
                </span>
              </div>
            </div>
          </div>

          {/* Sync operations control pad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Pull updates card */}
            <div className="bg-white border border-slate-100 p-6 rounded-[28px] shadow-2xl shadow-slate-200/40 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Download className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Pull Cloud Datasets</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fetch all current tables (products, users, orders) from your live Supabase cloud database, and merge them safely with your local web browser storage so your UI represents the remote state immediately.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Operations Layer: Safe Get</span>
                <button
                  disabled={syncLoading || !isSupabaseConfigured()}
                  onClick={handleSupabasePull}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold uppercase rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {syncLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  <span>Pull Live Data</span>
                </button>
              </div>
            </div>

            {/* Right: Push seeds card */}
            <div className="bg-white border border-slate-100 p-6 rounded-[28px] shadow-2xl shadow-slate-200/40 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-full bg-blue-55 flex items-center justify-center text-blue-600">
                  <Upload className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Backseed Products & Orders</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Synchronize your active local offline database records (pre-seeded products, test accounts, generated items, and current customer orders) to your Supabase PostgreSQL cloud instance to instantly initialize it.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Operations Layer: Safe Upsert</span>
                <button
                  disabled={syncLoading || !isSupabaseConfigured()}
                  onClick={handleSupabasePush}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold uppercase rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {syncLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <span>Push Seed Data</span>
                </button>
              </div>
            </div>

          </div>

          {/* Sync operations result logger */}
          {syncStatus && (
            <div className={`p-4 rounded-xl text-xs font-semibold ${
              syncStatus.success ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-700'
            }`}>
              {syncStatus.message}
            </div>
          )}

          {/* Setup Guidance step-by-step block */}
          <div className="bg-white border border-slate-150 rounded-[28px] overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-150 px-6 py-4.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Database className="h-4.5 w-4.5 text-blue-600" />
                <span>10-Second Setup: Your Actions in Supabase Dashboard</span>
              </h3>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Steps lists */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-1.5 uppercase">
                    <span className="h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Create a Project</span>
                  </h4>
                  <p>Register a free project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">supabase.com</a>.</p>
                  <p className="text-slate-450 mt-1 font-medium">Choose any regional data-center close to you, and pick a secure database master password.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-1.5 uppercase">
                    <span className="h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Configure Keys</span>
                  </h4>
                  <p>Inside your Supabase panel settings dashboard under <strong>API</strong>, look up the following keys:</p>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2 font-mono text-[10px] space-y-1 block">
                    <p className="font-bold">1. Project URL</p>
                    <p className="font-bold">2. Anon public API Key</p>
                  </div>
                  <p className="text-slate-450 mt-1 font-medium">Paste them inside the <strong>Secrets panel</strong> of AI Studio under the environment keys:</p>
                  <p className="font-mono text-[9px] bg-slate-50 p-1.5 rounded text-blue-600 font-bold">VITE_SUPABASE_URL<br />VITE_SUPABASE_ANON_KEY</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-1.5 uppercase">
                    <span className="h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Database Tables SQL Setup</span>
                  </h4>
                  <p>Navigate to the <strong>SQL Editor</strong> tab on the left margin of your Supabase project dashboard.</p>
                  <p className="text-slate-450 mt-1 font-medium">Click <strong>New Query</strong>, copy the prepared schema code block provided below, paste it, and run the query! Your relational tables will be instantly generated.</p>
                </div>
              </div>

              {/* Copy SQL Schema box block */}
              <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-950 text-slate-50 mt-4">
                <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Database Initialization (Tables Schema Script)</span>
                  <button
                    onClick={() => copyToClipboard(`-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  rating NUMERIC,
  reviews_count INTEGER,
  specs TEXT,
  category TEXT,
  stock INTEGER
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  uid TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  district TEXT,
  address TEXT,
  has_set_password BOOLEAN,
  password TEXT,
  created_at TEXT,
  is_admin BOOLEAN
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(uid) ON DELETE SET NULL,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  user_district TEXT,
  user_address TEXT,
  items TEXT,
  total_price NUMERIC,
  payment_method TEXT,
  payment_status TEXT,
  status TEXT,
  created_at TEXT,
  invoice_id TEXT
);

-- Turn on row-level reading (or disable RLS under your tables settings for quick testing)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access rule logs
CREATE POLICY "Allow public select on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow anon write on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public select on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow anon write on users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public select on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow anon write on orders" ON public.orders FOR ALL USING (true);
`, 'sql')}
                    className="px-3 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-slate-300 font-bold uppercase rounded transition-all flex items-center gap-1.5 cursor-pointer border border-white/[0.05]"
                  >
                    {copiedText === 'sql' ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedText === 'sql' ? 'Copied' : 'Copy Schema'}</span>
                  </button>
                </div>

                <pre className="p-4 overflow-x-auto text-[10px] font-mono text-slate-300 leading-relaxed max-h-[350px]">
{`-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  rating NUMERIC,
  reviews_count INTEGER,
  specs TEXT, -- JSON Array of strings (e.g. ["Material: ABS", ...])
  category TEXT,
  stock INTEGER
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  uid TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  district TEXT,
  address TEXT,
  has_set_password BOOLEAN,
  password TEXT,
  created_at TEXT,
  is_admin BOOLEAN
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(uid) ON DELETE SET NULL,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  user_district TEXT,
  user_address TEXT,
  items TEXT, -- JSON Array of OrderItems (e.g. [{"productId":"prod-1","productName":"Garlic Chopper","price":450,"quantity":1}])
  total_price NUMERIC,
  payment_method TEXT,
  payment_status TEXT,
  status TEXT,
  created_at TEXT,
  invoice_id TEXT
);

-- For quick development, you can disable RLS in the tables settings in Supabase,
-- or run these scripts to allow instant Public read/write:
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow anon write on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public select on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow anon write on users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public select on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow anon write on orders" ON public.orders FOR ALL USING (true);`}
                </pre>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
