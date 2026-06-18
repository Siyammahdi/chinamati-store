import { Product, User, Order, Invoice } from '../types';
import {
  syncProductUpsert,
  syncProductDelete,
  syncUserUpsert,
  syncUserDelete,
  syncOrderUpsert,
  syncOrderDelete
} from './supabase';

const ADMIN_EMAIL = 'admin@chinamati.com';
const ADMIN_PASSWORD = 'adminpassword123';

const PRE_SEEDED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'USB Rechargeable Electric Garlic Chopper',
    description: 'A powerful, compact, wireless food processor. Chopping ingredients is now faster and easier with just a single key click. Great for garlic, ginger, pepper, onion, vegetables, and small meats.',
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviewsCount: 184,
    specs: [
      'Capacity: 250ml',
      'Material: Stainless Steel + ABS',
      'Battery: 1200mAh USB Rechargeable',
      'Operation: One-key touch start',
      'Waterproof: IPX6 washable design'
    ],
    category: 'kitchen',
    stock: 25
  },
  {
    id: 'prod-2',
    name: 'Magnetic LED Motion Sensor Night Light',
    description: 'An intelligent smart motion sensor night light. Stick it anywhere with the built-in strong magnet base or supplied adhesive pads. Perfectly illuminates closets, stairs, workshops, and bedsides.',
    price: 299,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400',
    rating: 4.6,
    reviewsCount: 220,
    specs: [
      'Sensor: Pyroelectric Infrared Sensor',
      'Range: 3 meters distance @ 120-degree angle',
      'Modes: Continuous On / Auto Motion Sensor / Off',
      'Battery: Built-in 500mAh Lithium polymer',
      'Installation: Magnetic strip + Dual-sided tape'
    ],
    category: 'home',
    stock: 40
  },
  {
    id: 'prod-3',
    name: 'Self-Stirring Lazy Coffee Mug',
    description: 'The ultimate gadget for coffee and tea lovers. This high-efficiency double-walled coffee cup instantly mixes beverages with the touch of a button. No spoon, no mess, no hassle.',
    price: 399,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    reviewsCount: 95,
    specs: [
      'Capacity: 400ml',
      'Power: 2 x AAA batteries (not included)',
      'Material: Food-grade Stainless Steel + Premium PC',
      'Mixing Mechanism: Magnetic capsule stirrer',
      'Cleanup: Inner cavity hand-wash safe'
    ],
    category: 'kitchen',
    stock: 15
  },
  {
    id: 'prod-4',
    name: 'Multi-Functional Keychain COB Work Light',
    description: 'A heavy-duty, ultra-bright pocket-sized flashlight. Features an adjustable stand, karabiner hanging clip, magnetic base, tripod adapter, and a built-in bottle opener. Absolute must-have daily accessory.',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1554734867-bf3c00a49371?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviewsCount: 340,
    specs: [
      'Brightness: 800 Lumens Max output',
      'Modes: COB 100% / COB 60% / COB 30% / Strobe',
      'Waterproof: Weather-resistant aluminum body',
      'Charging: USB Type-C input (cable included)',
      'Features: Strong rear magnet + Retractable kickstand'
    ],
    category: 'gadgets',
    stock: 120
  },
  {
    id: 'prod-5',
    name: 'Stainless Steel Smart Temp Bottle',
    description: 'A premium smart water bottle with accurate LED touch temperature display. Keep cold and hot drinks insulated for 12+ hours inside the high-grade double wall thermal chamber with no charging needed.',
    price: 499,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    reviewsCount: 112,
    specs: [
      'Material: Double-wall Food Grade 304 Stainless Steel',
      'Capacity: 500ml',
      'Display: Waterproof high-definition LED Screen',
      'Battery: Built-in non-replaceable battery active for 2+ years',
      'Insulation performance: 12 hours hot / 24 hours cold'
    ],
    category: 'gadgets',
    stock: 30
  },
  {
    id: 'prod-6',
    name: 'Anti-Skid Rotating Cabinet Spinner Organizer',
    description: 'A clean turntable organizer that makes organizing your spice rack, pantry, cosmetic table, or kitchen cabinets incredibly simple. Glides effortlessly and keeps all containers visible.',
    price: 250,
    imageUrl: 'https://images.unsplash.com/photo-1595348020910-87cfdcbe8476?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    reviewsCount: 88,
    specs: [
      'Diameter: 12 Inches (30cm)',
      'Rotation: 360-degree smooth ball bearing glide',
      'Surface: Anti-skid beaded rubber liner',
      'Material: BPA-free heavy-duty plastic',
      'Rims: Elevated edges prevent spice jars falling'
    ],
    category: 'home',
    stock: 45
  },
  {
    id: 'prod-7',
    name: 'Portable High-Speed Handy USB Fan',
    description: 'A pocket-sized powerful handheld fan. Excellent cooling companion for humid hot summer trips, travel, and crowded public transport. Very silent, adjustable speed settings, and durable grip.',
    price: 350,
    imageUrl: 'https://images.unsplash.com/photo-1618944813589-9d784a92c019?auto=format&fit=crop&q=80&w=400',
    rating: 4.6,
    reviewsCount: 156,
    specs: [
      'Speeds: 3 gear adjustments (Low/Med/High)',
      'Battery: Built-in rechargeable 2000mAh',
      'Work Time: 3 to 8 hours depending on mode',
      'Blade: 7-wing silent propellor',
      'Standard: Comes with stable desktop base stand'
    ],
    category: 'gadgets',
    stock: 80
  },
  {
    id: 'prod-8',
    name: 'Expandable Silicone Food Fresh Lids (6Pcs)',
    description: 'Replace plastic waste wraps forever! Extremely elastomeric food-grade silicone lids that fit snugly over bowls, melons, mason jars, half-cut lemons, and pots. Leak-proof and airtight.',
    price: 130,
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=400',
    rating: 4.4,
    reviewsCount: 94,
    specs: [
      'Quantity: 6 size diameters (6.5cm, 9.5cm, 11.5cm, 14.5cm, 16.5cm, 20.5cm)',
      'Material: 100% FDA Approved food-grade silicone',
      'Thermal Limits: Freezer, microwave, dishwasher safe',
      'Environment: Eco-friendly washable and reusable',
      'Elasticity: Can stretch up to 40% wider over containers'
    ],
    category: 'kitchen',
    stock: 150
  },
  {
    id: 'prod-9',
    name: 'Premium Folding Angle-Adjustable Desk Phone Stand',
    description: 'A gorgeous aluminum-weighted desktop cradle for tablets and mobile phones. Highly ergonomic adjustable viewing tilt and height prevents neck strain. Fully folds down to pocket scale.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    reviewsCount: 204,
    specs: [
      'Material: Premium Heavy Density ABS + Aluminum shaft',
      'Weight: Built-in metal stabilizer block inside pad',
      'Compatibility: All devices from 4 to 12.9 inches',
      'Angle adjustment: Dual-axis 270 degree rotation',
      'Anti-Scratch: Silicone back plate and non-slip bottom rubber'
    ],
    category: 'home',
    stock: 90
  }
];

export class DB {
  // --- INITS ---
  static init() {
    if (!localStorage.getItem('gs_products')) {
      localStorage.setItem('gs_products', JSON.stringify(PRE_SEEDED_PRODUCTS));
    }
    if (!localStorage.getItem('gs_users')) {
      // Preseed admin
      const adminUser: User = {
        uid: 'admin-uid',
        name: 'Shop Owner Admin',
        email: ADMIN_EMAIL,
        phone: '+8801700000000',
        district: 'Dhaka',
        address: 'Chinamati Headquarters, Gulshan 2, Dhaka',
        hasSetPassword: true,
        password: ADMIN_PASSWORD,
        createdAt: new Date().toISOString(),
        isAdmin: true
      };
      localStorage.setItem('gs_users', JSON.stringify([adminUser]));
    }
    if (!localStorage.getItem('gs_orders')) {
      localStorage.setItem('gs_orders', JSON.stringify([]));
    }
  }

  // --- PRODUCTS ---
  static getProducts(): Product[] {
    this.init();
    try {
      return JSON.parse(localStorage.getItem('gs_products') || '[]');
    } catch {
      return PRE_SEEDED_PRODUCTS;
    }
  }

  static getProductById(id: string): Product | null {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  static async saveProduct(product: Product): Promise<{ success: boolean; error?: any }> {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem('gs_products', JSON.stringify(products));
    const result = await syncProductUpsert(product);
    return result || { success: true };
  }

  static async deleteProduct(id: string): Promise<{ success: boolean; error?: any }> {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem('gs_products', JSON.stringify(filtered));
    const result = await syncProductDelete(id);
    return result || { success: true };
  }

  // --- USERS ---
  static getUsers(): User[] {
    this.init();
    try {
      return JSON.parse(localStorage.getItem('gs_users') || '[]');
    } catch {
      return [];
    }
  }

  static getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async saveUser(user: User): Promise<{ success: boolean; error?: any }> {
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === user.uid);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('gs_users', JSON.stringify(users));
    const result = await syncUserUpsert(user);
    return result || { success: true };
  }

  static async deleteUser(uid: string): Promise<{ success: boolean; error?: any }> {
    const users = this.getUsers();
    const filtered = users.filter(u => u.uid !== uid);
    localStorage.setItem('gs_users', JSON.stringify(filtered));
    const result = await syncUserDelete(uid);

    // Also clean up current session if this user was logged in
    const session = this.getActiveSession();
    if (session && session.uid === uid) {
      this.clearActiveSession();
    }
    return result || { success: true };
  }

  // --- ORDERS ---
  static getOrders(): Order[] {
    this.init();
    try {
      return JSON.parse(localStorage.getItem('gs_orders') || '[]');
    } catch {
      return [];
    }
  }

  static getOrderById(id: string): Order | null {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  }

  static getOrdersByUser(userId: string): Order[] {
    const orders = this.getOrders();
    return orders.filter(o => o.userId === userId);
  }

  static async saveOrder(order: Order): Promise<{ success: boolean; error?: any }> {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index > -1) {
      orders[index] = order;
    } else {
      orders.push(order);
    }
    localStorage.setItem('gs_orders', JSON.stringify(orders));
    const result = await syncOrderUpsert(order);
    return result || { success: true };
  }

  static async deleteOrder(id: string): Promise<{ success: boolean; error?: any }> {
    const orders = this.getOrders();
    const filtered = orders.filter(o => o.id !== id);
    localStorage.setItem('gs_orders', JSON.stringify(filtered));
    const result = await syncOrderDelete(id);
    return result || { success: true };
  }

  // --- SESSION ---
  static getActiveSession(): User | null {
    try {
      const sess = localStorage.getItem('gs_active_session');
      if (!sess) return null;
      const user = JSON.parse(sess);
      // Refresh user data from primary store
      const freshUser = this.getUsers().find(u => u.uid === user.uid);
      return freshUser || null;
    } catch {
      return null;
    }
  }

  static setActiveSession(user: User): void {
    localStorage.setItem('gs_active_session', JSON.stringify(user));
  }

  static clearActiveSession(): void {
    localStorage.removeItem('gs_active_session');
  }

  // --- BUSINESS LOGIC: QUICK ORDER AND BACKGROUND SIGNUP ---
  static placeOrder(params: {
    name: string;
    email: string;
    phone: string;
    district: string;
    address: string;
    productId: string;
    quantity: number;
    paymentMethod: 'cod' | 'sslcommerz';
  }): { order: Order; user: User; isNewUser: boolean } {
    this.init();

    const product = this.getProductById(params.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // 1. Find or create user
    let user = this.getUserByEmail(params.email);
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = {
        uid: 'user-' + Math.random().toString(36).substr(2, 9),
        name: params.name,
        email: params.email.toLowerCase(),
        phone: params.phone,
        district: params.district,
        address: params.address,
        hasSetPassword: false,
        createdAt: new Date().toISOString(),
        isAdmin: false
      };
      this.saveUser(user);
    } else {
      // Update phone, district, address if they were empty or different
      user.name = params.name;
      user.phone = params.phone;
      user.district = params.district;
      user.address = params.address;
      this.saveUser(user);
    }

    // 2. Reduce product stock
    const newStock = Math.max(0, product.stock - params.quantity);
    this.saveProduct({ ...product, stock: newStock });

    // 3. Create unique Order & Invoice IDs
    const epoch = Date.now().toString().slice(-6);
    const orderId = `GS-ORD-${epoch}`;
    const invoiceId = `GS-INV-${epoch}`;

    const isInsideDhaka = params.district.toLowerCase() === 'dhaka' || params.district.toLowerCase().includes('inside');
    const deliveryCharge = isInsideDhaka ? 60 : 120;
    const itemTotalPrice = product.price * params.quantity;
    const grandTotalPrice = itemTotalPrice + deliveryCharge;

    const newOrder: Order = {
      id: orderId,
      userId: user.uid,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      userDistrict: user.district,
      userAddress: user.address,
      items: [
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: params.quantity
        }
      ],
      totalPrice: grandTotalPrice,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'sslcommerz' ? 'Paid' : 'Pending',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      invoiceId: invoiceId
    };

    this.saveOrder(newOrder);

    // Auto log in user in background securely
    this.setActiveSession(user);

    return { order: newOrder, user, isNewUser };
  }

  // --- PASSWORD FLOWS ---
  static setPassword(userId: string, newPassword: string): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === userId);
    if (index > -1) {
      users[index].password = newPassword;
      users[index].hasSetPassword = true;
      this.saveUser(users[index]);
      
      // Update running session too
      const session = this.getActiveSession();
      if (session && session.uid === userId) {
        this.setActiveSession(users[index]);
      }
    }
  }

  static resetPassword(userId: string, newPassword: string): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === userId);
    if (index > -1) {
      users[index].password = newPassword;
      users[index].hasSetPassword = true;
      this.saveUser(users[index]);

      // Update running session too
      const session = this.getActiveSession();
      if (session && session.uid === userId) {
        this.setActiveSession(users[index]);
      }
    }
  }

  // --- LOGIN ROUTINE ---
  static login(email: string, passwordString: string): { success: boolean; user?: User; error?: string } {
    this.init();
    const user = this.getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'User account not found.' };
    }
    
    // Check if it is the admin and matches default admin pass
    if (email.toLowerCase() === ADMIN_EMAIL && passwordString === ADMIN_PASSWORD) {
      this.setActiveSession(user);
      return { success: true, user };
    }

    if (!user.hasSetPassword) {
      return { success: false, error: 'No password set yet. Please complete an order first or use the recovery.' };
    }

    if (user.password !== passwordString) {
      return { success: false, error: 'Incorrect password.' };
    }

    this.setActiveSession(user);
    return { success: true, user };
  }
}
