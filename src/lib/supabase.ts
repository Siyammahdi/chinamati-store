import { createClient } from '@supabase/supabase-js';
import { Product, User, Order, ProductReview } from '../types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim() !== '' &&
    supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim() !== '' &&
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// --- CLOUD SYNC HELPERS (PULL FROM CLOUD -> LOCAL STORAGE) ---
export async function pullFromSupabase(): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: 'Supabase credentials are NOT configured.' };
  }

  try {
    // 1. Pull Products
    const { data: dbProducts, error: prodError } = await supabase
      .from('products')
      .select('*');
    if (prodError) throw prodError;

    if (dbProducts && dbProducts.length > 0) {
      const parsedProducts = dbProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        imageUrl: p.image_url,
        rating: Number(p.rating),
        reviewsCount: Number(p.reviews_count),
        specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs || [],
        category: p.category,
        stock: Number(p.stock),
        subImages: p.sub_images 
          ? (typeof p.sub_images === 'string' 
              ? (p.sub_images.startsWith('[') ? JSON.parse(p.sub_images) : [p.sub_images]) 
              : p.sub_images)
          : []
      }));
      localStorage.setItem('gs_products', JSON.stringify(parsedProducts));
    }

    // 2. Pull Users
    const { data: dbUsers, error: userError } = await supabase
      .from('users')
      .select('*');
    if (userError) throw userError;

    if (dbUsers && dbUsers.length > 0) {
      const parsedUsers = dbUsers.map((u: any) => ({
        uid: u.uid,
        name: u.name,
        email: u.email,
        phone: u.phone,
        district: u.district,
        address: u.address,
        hasSetPassword: Boolean(u.has_set_password),
        password: u.password,
        createdAt: u.created_at,
        isAdmin: Boolean(u.is_admin),
      }));
      localStorage.setItem('gs_users', JSON.stringify(parsedUsers));
    }

    // 3. Pull Orders
    const { data: dbOrders, error: orderError } = await supabase
      .from('orders')
      .select('*');
    if (orderError) throw orderError;

    if (dbOrders && dbOrders.length > 0) {
      const parsedOrders = dbOrders.map((o: any) => ({
        id: o.id,
        userId: o.user_id,
        userName: o.user_name,
        userEmail: o.user_email,
        userPhone: o.user_phone,
        userDistrict: o.user_district,
        userAddress: o.user_address,
        items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items || [],
        totalPrice: Number(o.total_price),
        paymentMethod: o.payment_method,
        paymentStatus: o.payment_status,
        status: o.status,
        createdAt: o.created_at,
        invoiceId: o.invoice_id,
      }));
      localStorage.setItem('gs_orders', JSON.stringify(parsedOrders));
    }

    // 4. Pull Reviews
    let pulledReviewsCount = 0;
    try {
      const { data: dbReviews, error: revError } = await supabase
        .from('reviews')
        .select('*');
      if (!revError && dbReviews && dbReviews.length > 0) {
        const parsedReviews = dbReviews.map((r: any) => ({
          id: r.id,
          productId: r.product_id,
          reviewer: r.reviewer_name,
          location: r.location || '',
          date: r.date_text || '',
          rating: Number(r.rating || 5),
          text: r.comment || '',
          imageUrls: r.image_urls 
            ? (typeof r.image_urls === 'string' 
                ? (r.image_urls.startsWith('[') ? JSON.parse(r.image_urls) : [r.image_urls]) 
                : r.image_urls)
            : [],
          createdAt: r.created_at || new Date().toISOString()
        }));
        localStorage.setItem('gs_reviews', JSON.stringify(parsedReviews));
        pulledReviewsCount = dbReviews.length;
      }
    } catch (e) {
      console.warn('Reviews table not yet created in Supabase (optional):', e);
    }

    return { 
      success: true, 
      message: `Successfully loaded ${dbProducts?.length || 0} Products, ${dbUsers?.length || 0} Users, ${dbOrders?.length || 0} Orders, and ${pulledReviewsCount} Reviews from Supabase Cloud.` 
    };
  } catch (error: any) {
    console.error('Failed to pull schema/data from Supabase:', error);
    return { success: false, message: error.message || 'Unknown network error occurred.' };
  }
}

// --- CLOUD SYNC HELPERS (PUSH LOCAL STORAGE -> CLOUD) ---
export async function pushToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: 'Supabase credentials are NOT configured.' };
  }

  try {
    const localProducts = JSON.parse(localStorage.getItem('gs_products') || '[]');
    const localUsers = JSON.parse(localStorage.getItem('gs_users') || '[]');
    const localOrders = JSON.parse(localStorage.getItem('gs_orders') || '[]');

    // 1. Push Products
    if (localProducts.length > 0) {
      const payload = localProducts.map((p: Product) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image_url: p.imageUrl,
        rating: p.rating,
        reviews_count: p.reviewsCount,
        specs: JSON.stringify(p.specs),
        category: p.category,
        stock: p.stock,
        sub_images: p.subImages ? JSON.stringify(p.subImages) : '[]'
      }));

      const { error: prodError } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
      if (prodError) throw prodError;
    }

    // 2. Push Users
    if (localUsers.length > 0) {
      const payload = localUsers.map((u: User) => ({
        uid: u.uid,
        name: u.name,
        email: u.email,
        phone: u.phone,
        district: u.district,
        address: u.address,
        has_set_password: u.hasSetPassword,
        password: u.password || null,
        created_at: u.createdAt,
        is_admin: u.isAdmin
      }));

      const { error: userError } = await supabase.from('users').upsert(payload, { onConflict: 'uid' });
      if (userError) throw userError;
    }

    // 3. Push Orders
    if (localOrders.length > 0) {
      const payload = localOrders.map((o: Order) => ({
        id: o.id,
        user_id: o.userId,
        user_name: o.userName,
        user_email: o.userEmail,
        user_phone: o.userPhone,
        user_district: o.userDistrict,
        user_address: o.userAddress,
        items: JSON.stringify(o.items),
        total_price: o.totalPrice,
        payment_method: o.paymentMethod,
        payment_status: o.paymentStatus,
        status: o.status,
        created_at: o.createdAt,
        invoice_id: o.invoiceId
      }));

      const { error: orderError } = await supabase.from('orders').upsert(payload, { onConflict: 'id' });
      if (orderError) throw orderError;
    }

    // 4. Push Reviews
    let pushedReviewsCount = 0;
    try {
      const localReviews = JSON.parse(localStorage.getItem('gs_reviews') || '[]');
      if (localReviews.length > 0) {
        const payload = localReviews.map((r: ProductReview) => ({
          id: r.id,
          product_id: r.productId,
          reviewer_name: r.reviewer,
          location: r.location,
          date_text: r.date,
          rating: r.rating,
          comment: r.text,
          image_urls: r.imageUrls ? JSON.stringify(r.imageUrls) : '[]',
          created_at: r.createdAt
        }));
        const { error: revError } = await supabase.from('reviews').upsert(payload, { onConflict: 'id' });
        if (!revError) {
          pushedReviewsCount = localReviews.length;
        } else {
          console.warn('Silent warning - Reviews table migration failed:', revError);
        }
      }
    } catch (e) {
      console.warn('Failed to push reviews to Supabase (reviews table may not exist yet):', e);
    }

    return { 
      success: true, 
      message: `Successfully back-seeded ${localProducts.length} Products, ${localUsers.length} Users, ${localOrders.length} Orders, and ${pushedReviewsCount} Reviews to Supabase.` 
    };
  } catch (error: any) {
    console.error('Failed to push schema/data to Supabase:', error);
    return { success: false, message: error.message || 'Error occurred while saving to Supabase.' };
  }
}

// --- SINGLE RECORD SYNC HELPERS (TRIGGERED DYNAMICALLY) ---
export async function syncProductUpsert(product: Product): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.from('products').upsert({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.imageUrl,
      rating: product.rating,
      reviews_count: product.reviewsCount,
      specs: JSON.stringify(product.specs),
      category: product.category,
      stock: product.stock,
      sub_images: product.subImages ? JSON.stringify(product.subImages) : '[]'
    }, { onConflict: 'id' });
    if (error) {
      console.error('Supabase Product Upsert Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (e: any) {
    console.warn('Silent Supabase Background Error:', e);
    return { success: false, error: e };
  }
}

export async function syncUserUpsert(user: User): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.from('users').upsert({
      uid: user.uid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      district: user.district,
      address: user.address,
      has_set_password: user.hasSetPassword,
      password: user.password || null,
      created_at: user.createdAt,
      is_admin: user.isAdmin
    }, { onConflict: 'uid' });
    if (error) {
      console.error('Supabase User Upsert Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (e: any) {
    console.warn('Silent Supabase Background Error:', e);
    return { success: false, error: e };
  }
}

export async function syncOrderUpsert(order: Order): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: true };
  try {
    // Pre-emptively sync and await the associated user to prevent a database level Foreign Key constraint violation
    if (order.userId) {
      try {
        const users = JSON.parse(localStorage.getItem('gs_users') || '[]');
        const matchedUser = users.find((u: any) => u.uid === order.userId);
        if (matchedUser) {
          const { error: userSyncErr } = await supabase.from('users').upsert({
            uid: matchedUser.uid,
            name: matchedUser.name,
            email: matchedUser.email,
            phone: matchedUser.phone,
            district: matchedUser.district,
            address: matchedUser.address,
            has_set_password: matchedUser.hasSetPassword,
            password: matchedUser.password || null,
            created_at: matchedUser.createdAt,
            is_admin: matchedUser.isAdmin
          }, { onConflict: 'uid' });
          if (userSyncErr) {
            console.warn('Pre-emptive user sync for order failed:', userSyncErr);
          }
        }
      } catch (userSyncErr) {
        console.warn('Pre-emptive user sync for order status failed:', userSyncErr);
      }
    }

    const { error } = await supabase.from('orders').upsert({
      id: order.id,
      user_id: order.userId,
      user_name: order.userName,
      user_email: order.userEmail,
      user_phone: order.userPhone,
      user_district: order.userDistrict,
      user_address: order.userAddress,
      items: JSON.stringify(order.items),
      total_price: order.totalPrice,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      status: order.status,
      created_at: order.createdAt,
      invoice_id: order.invoiceId
    }, { onConflict: 'id' });
    if (error) {
      console.error('Supabase Order Upsert Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (e: any) {
    console.warn('Silent Supabase Background Error:', e);
    return { success: false, error: e };
  }
}

export async function syncProductDelete(productId: string): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error('Supabase Product Delete Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (e: any) {
    console.warn('Silent Supabase Background Error:', e);
    return { success: false, error: e };
  }
}

export async function syncUserDelete(uid: string): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.from('users').delete().eq('uid', uid);
    if (error) {
      console.error('Supabase User Delete Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (e: any) {
    console.warn('Silent Supabase Background Error:', e);
    return { success: false, error: e };
  }
}

export async function syncOrderDelete(orderId: string): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (error) {
      console.error('Supabase Order Delete Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (e: any) {
    console.warn('Silent Supabase Background Error:', e);
    return { success: false, error: e };
  }
}

export async function syncReviewUpsert(review: ProductReview): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.from('reviews').upsert({
      id: review.id,
      product_id: review.productId,
      reviewer_name: review.reviewer,
      location: review.location,
      date_text: review.date,
      rating: review.rating,
      comment: review.text,
      image_urls: JSON.stringify(review.imageUrls),
      created_at: review.createdAt
    }, { onConflict: 'id' });
    if (error) {
      console.error('Supabase Review Upsert Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (e: any) {
    console.warn('Silent Supabase Background Error:', e);
    return { success: false, error: e };
  }
}

export async function syncReviewDelete(reviewId: string): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (error) {
      console.error('Supabase Review Delete Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (e: any) {
    console.warn('Silent Supabase Background Error:', e);
    return { success: false, error: e };
  }
}

