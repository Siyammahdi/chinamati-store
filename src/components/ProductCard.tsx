import { Star, Zap, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onOrderNow: (product: Product) => void;
  onViewDetails: (productId: string) => void;
}

const categoryConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  gadgets: {
    label: 'Smart Tech',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  kitchen: {
    label: 'Smart Kitchen',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  home: {
    label: 'Smart Home',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
};

export default function ProductCard({ product, onOrderNow, onViewDetails }: ProductCardProps) {
  const cat = categoryConfig[product.category] ?? categoryConfig.gadgets;
  const isLowStock = product.stock <= 20;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="group relative bg-white rounded-[28px] overflow-hidden border border-slate-200/80 shadow-[0_2px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:border-slate-300/80 transition-all duration-400 flex flex-col"
      id={`product-card-${product.id}`}
    >
      {/* ── Image Stage ── */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 cursor-pointer"
        style={{ paddingTop: '72%' }}
        onClick={() => onViewDetails(product.id)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-700 ease-out"
        />

        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category chip */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${cat.bg} ${cat.color} border ${cat.border} shadow-sm`}>
          <span>{cat.label}</span>
        </div>

        {/* Low stock badge */}
        {isLowStock && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-500 text-white text-[9px] font-bold uppercase tracking-wide shadow-md shadow-red-500/30">
            <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
            <span>Only {product.stock} Left</span>
          </div>
        )}

        {/* Hover: Quick view overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="h-3.5 w-3.5" />
            <span>Quick View</span>
          </div>
        </div>
      </div>

      {/* ── Card Content ── */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-800">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviewsCount})</span>
        </div>

        {/* Name */}
        <h3
          onClick={() => onViewDetails(product.id)}
          className="text-slate-900 group-hover:text-blue-600 font-bold text-[15px] leading-snug mb-2 cursor-pointer line-clamp-1 transition-colors duration-200 font-sans"
        >
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-sans flex-grow">
          {product.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />

        {/* Price + CTA row */}
        <div className="flex items-center justify-between gap-3">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono">Best Price</span>
            <span className="text-2xl font-black text-slate-900 leading-tight font-sans tracking-tight">
              ৳{product.price.toLocaleString()}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* View details */}
            <button
              onClick={() => onViewDetails(product.id)}
              className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all cursor-pointer focus:outline-none flex-shrink-0"
              title="View details"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>

            {/* Order Now */}
            <button
              id={`btn-order-now-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onOrderNow(product);
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-[11px] tracking-wider uppercase rounded-2xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.97] transition-all cursor-pointer focus:outline-none"
            >
              <Zap className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300 flex-shrink-0" />
              <span>Order</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
