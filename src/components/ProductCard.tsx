import { Star, Zap } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onOrderNow: (product: Product) => void;
  onViewDetails: (productId: string) => void;
}

export default function ProductCard({
  product,
  onOrderNow,
  onViewDetails
}: ProductCardProps) {
  // Format Category name
  const catNames: Record<string, string> = {
    gadgets: 'Smart Tech',
    kitchen: 'Smart Kitchen',
    home: 'Smart Home'
  };

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group bg-white hover:bg-white border border-slate-100 hover:border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-300 flex flex-col"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative pt-[75%] overflow-hidden bg-slate-50 cursor-pointer" onClick={() => onViewDetails(product.id)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wider font-sans uppercase px-2.5 py-1 rounded-full shadow-sm">
          {catNames[product.category]}
        </span>

        {/* Stock status helper */}
        {product.stock <= 20 && (
          <span className="absolute top-3 right-3 bg-red-50 text-red-600 text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full border border-red-100">
            Only {product.stock} Left
          </span>
        )}
      </div>

      {/* Meta Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Mock Rating Section */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) 
                      ? 'fill-amber-400 text-amber-400' 
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-700 text-xs font-bold font-sans">{product.rating}</span>
            <span className="text-slate-400 text-xs font-sans">({product.reviewsCount} reviews)</span>
          </div>

          {/* Heading */}
          <h3 
            onClick={() => onViewDetails(product.id)}
            className="text-slate-900 group-hover:text-blue-600 font-bold tracking-tight text-md mb-2 cursor-pointer line-clamp-1 transition-colors font-sans"
          >
            {product.name}
          </h3>

          {/* Description Snippet */}
          <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2 font-sans">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price tags & order CTA */}
          <div className="flex items-end justify-between gap-2 border-t border-slate-100 pt-4 mt-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium font-sans uppercase tracking-widest">Price</span>
              <span className="text-slate-900 text-xl font-black font-sans">
                ৳{product.price.toLocaleString()}
              </span>
            </div>

            {/* DIRECT ORDER BTN */}
            <div className="flex gap-2 w-[55%]">
              <button
                id={`btn-order-now-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onOrderNow(product);
                }}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] tracking-wider uppercase rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="h-3.5 w-3.5 fill-white text-yellow-300" />
                <span>ORDER NOW</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
