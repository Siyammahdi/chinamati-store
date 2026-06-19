import { ArrowLeft, Star, Zap, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { Product, ProductReview } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { DB } from '../lib/db';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onOrderNow: (product: Product, quantity: number) => void;
}

// Curated high-resolution studio photos for each pre-seeded gadget
const PRODUCT_IMAGES_MAP: Record<string, string[]> = {
  'prod-1': [
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1595348020910-87cfdcbe8476?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-2': [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-3': [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1517256064527-09c53b2d0ec6?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-4': [
    'https://images.unsplash.com/photo-1554734867-bf3c00a49371?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-5': [
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-6': [
    'https://images.unsplash.com/photo-1595348020910-87cfdcbe8476?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-7': [
    'https://images.unsplash.com/photo-1618944813589-9d784a92c019?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1565130838608-c8a76d55d676?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-8': [
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-9': [
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1546054483-6f387db2fa3d?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000'
  ]
};

const CLIENT_REVIEW_PHOTOS_MAP: Record<string, string[]> = {
  'prod-1': [
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-2': [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-3': [
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-4': [
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-5': [
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-6': [
    'https://images.unsplash.com/photo-1609592424109-dd77d5442ed1?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-7': [
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-8': [
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&q=80&w=1000'
  ],
  'prod-9': [
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1517256064527-09c53b2d0ec6?auto=format&fit=crop&q=80&w=1000'
  ]
};

const getProductImages = (product: Product): string[] => {
  if (product.subImages && Array.isArray(product.subImages) && product.subImages.length > 0) {
    const validSubs = product.subImages.filter(img => img && img.trim() !== '');
    if (validSubs.length > 0) {
      return [product.imageUrl, ...validSubs];
    }
  }
  return PRODUCT_IMAGES_MAP[product.id] || [
    product.imageUrl,
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000'
  ];
};

const getClientReviewPhotos = (productId: string): string[] => {
  return CLIENT_REVIEW_PHOTOS_MAP[productId] || [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1542751110-97427bb9f20e?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000'
  ];
};

export default function ProductDetailsPage({
  product,
  onBack,
  onOrderNow
}: ProductDetailsPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Stateful photo selection gallery
  const productImages = getProductImages(product);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = productImages[selectedImageIndex];

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImages([]);
  };

  const handleNextLightboxPhoto = () => {
    setLightboxIndex((prevIndex) => (prevIndex + 1) % lightboxImages.length);
  };

  const handlePrevLightboxPhoto = () => {
    setLightboxIndex((prevIndex) => (prevIndex - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // FAQ simple state
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does standard delivery take?",
      answer: "We deliver across all 64 districts in Bangladesh. Standard delivery inside Dhaka takes 5 days, and delivery outside Dhaka takes 10 days."
    },
    {
      question: "Is cash on delivery supported?",
      answer: "Yes, cash on delivery is fully supported nationwide. You do not need an account and can complete the secure payment after inspecting the product package on your doorstep."
    },
    {
      question: "What is the return and exchange policy?",
      answer: `We provide a comprehensive return policy. If you receive a damaged or incorrect product, you can request a return or full refund. The return and refund process takes 7 to 10 working days to be fully completed.`
    }
  ];

  // Dynamically load reviews and review images from the DB for this product
  const reviews = DB.getReviewsForProduct(product.id);

  const reviewImages = reviews.reduce((acc: string[], rev) => {
    if (rev.imageUrls && Array.isArray(rev.imageUrls)) {
      return [...acc, ...rev.imageUrls.filter(url => url && url.trim() !== '')];
    }
    return acc;
  }, []);
  const activeReviewImages = reviewImages.length > 0 ? reviewImages : getClientReviewPhotos(product.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16" id={`details-page-${product.id}`}>
      
      {/* Refined Minimalist Navigation Anchor */}
      <button
        onClick={onBack}
        className="group inline-flex items-center gap-2 mb-10 text-xs font-mono font-bold tracking-widest text-slate-500 hover:text-slate-900 transition-colors cursor-pointer uppercase"
        id="btn-back-to-shop"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>BACK TO CATALOG</span>
      </button>

      {/* Main Two-Column Architectural Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start mb-16">
        
        {/* LEFT COLUMN: Gallery with Standard Multi-photo selection tray */}
        <div className="md:col-span-6 space-y-4">
          <div className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            
            {/* Standard "Fullscreen Lightbox Trigger" option */}
            <button
              onClick={() => openLightbox(productImages, selectedImageIndex)}
              className="absolute top-4 right-4 p-2 bg-white/85 hover:bg-white border border-slate-200/50 rounded-lg text-slate-500 hover:text-slate-900 shadow-sm transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 animate-none"
              title="Click to zoom photo"
              id="btn-view-photo-full"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Standard Responsive Thumbnail list for multi-photos */}
          <div className="grid grid-cols-4 gap-3">
            {productImages.map((imgUrl, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer bg-slate-50 transition-all ${
                  selectedImageIndex === index 
                    ? 'border-slate-900 ring-2 ring-slate-950/5 scale-[0.97]' 
                    : 'border-slate-100 hover:border-slate-250 opacity-70 hover:opacity-100'
                }`}
                id={`btn-thumbnail-selector-${index}`}
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} thumbnail view ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Technical specifications & Order Action Module */}
        <div className="md:col-span-6 space-y-8 flex flex-col justify-between">
          <div>
            {/* Soft status labels */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 tracking-wider uppercase mb-3">
              <span>Category: {product.category}</span>
              <span>•</span>
              <span className="text-slate-500 font-bold">Standard Studio Edition</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-4 font-sans">
              {product.name}
            </h1>

            {/* Elegant simplified star count */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-100'
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-800 text-xs font-bold font-sans">{product.rating}</span>
              <span className="text-slate-300 text-xs font-sans">|</span>
              <span className={`text-xs font-bold font-sans flex items-center gap-1.5 ${product.stock > 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{product.stock} Available in Stock</span>
              </span>
            </div>

            {/* Paragraph copy */}
            <p className="text-slate-600 text-sm leading-relaxed font-sans mt-2">
              {product.description}
            </p>
          </div>

          {/* Clean tech spec list */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mb-4">
              Specs Card
            </h3>
            <ul className="space-y-2.5 text-slate-600 text-xs font-sans">
              {product.specs.map((spec, index) => (
                <li key={index} className="flex items-baseline gap-2">
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full flex-shrink-0" />
                  <span className="leading-tight">{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-6">
            
            {/* Price section & quantity toggle */}
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest">Aspirational Worth</span>
                <span className="text-slate-900 text-3xl font-bold font-sans mt-1">
                  ৳{product.price.toLocaleString()}
                </span>
              </div>

              {/* Minimal Quantity Controls */}
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mb-2">Quantity</span>
                <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
                  <button
                    onClick={decrementQty}
                    className="h-7 w-7 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200 text-sm font-bold flex items-center justify-center transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-slate-800 text-xs font-bold font-sans">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQty}
                    className="h-7 w-7 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200 text-sm font-bold flex items-center justify-center transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Projected total calculation block */}
            <div className="bg-slate-50/50 border border-slate-100 px-4 py-3 rounded-xl flex items-center justify-between text-[11px] font-sans">
              <span className="text-slate-450 font-sans">Subtotal estimate ({quantity} units):</span>
              <span className="text-slate-900 font-bold">৳{(product.price * quantity).toLocaleString()}</span>
            </div>

            {/* Action CTA */}
            <div className="pt-1">
              <button
                id={`btn-details-order-${product.id}`}
                onClick={() => onOrderNow(product, quantity)}
                className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs tracking-widest uppercase rounded-xl shadow-lg shadow-black/[0.04] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2.5 font-mono"
              >
                <Zap className="h-4 w-4 fill-white text-white" />
                <span>CONFIRM ORDER NOW</span>
              </button>
              <p className="text-center text-[9px] text-slate-400 font-mono tracking-wider mt-3.5 uppercase font-medium">
                No advanced registry. Quick Cash on Delivery supported.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* MID-PAGE DIVIDER */}
      <div className="h-px bg-slate-100 my-12" />

      {/* REFINED MINIMALIST FAQ ACCORDION SECTION */}
      <div className="max-w-3xl mx-auto space-y-6 pt-2" id="minimal-faq-container">
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-slate-900 font-sans tracking-tight">Delivery & Policy</h2>
          <p className="text-xs text-slate-400 font-sans mt-1">Simple guidelines regarding fulfillment, doorstep returns and exchanges.</p>
        </div>

        <div className="divide-y divide-slate-100 font-sans">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left flex items-center justify-between gap-4 font-sans cursor-pointer focus:outline-none"
                  id={`btn-faq-toggle-${idx}`}
                >
                  <span className="font-bold text-slate-800 text-sm hover:text-slate-950 transition-colors">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-800 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs text-slate-500 leading-relaxed font-sans max-w-2xl">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-slate-100 my-12" />

      {/* REFINED CLEAN REVIEWS SECTION (No Extra Buyer Badges, Thumbs Rating buttons or Attached Photos) */}
      <div className="max-w-3xl mx-auto pt-2" id="minimal-reviews-container">
        
        {/* Simplified Header */}
        <div className="flex items-baseline justify-between gap-4 mb-10 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans tracking-tight">Client Feedback</h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Meticulous feedback from direct owners.</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-slate-900 font-mono">{product.rating}</span>
            <span className="text-[10px] text-slate-400 font-mono">/ 5.0</span>
          </div>
        </div>

        {/* Real Customer Shared Shots Photo Gallery */}
        <div className="mb-10 pb-8 border-b border-slate-100/60" id="user-reviews-photo-gallery">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3.5 font-bold">
            Real Customer Shared Shots
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {activeReviewImages.map((imgUrl, idx, arr) => (
              <button
                key={idx}
                type="button"
                onClick={() => openLightbox(arr, idx)}
                className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200/65 hover:border-slate-400/80 cursor-pointer bg-slate-50 transition-all shadow-sm hover:shadow-md"
                id={`btn-review-photo-${idx}`}
              >
                <img
                  src={imgUrl}
                  alt={`Real client photo feed ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Stack Reviews */}
        <div className="space-y-8">
          {reviews.map((rev, index) => (
            <div 
              key={index} 
              className="space-y-2.5 pb-8 border-b border-slate-100 last:border-0 last:pb-0 font-sans"
            >
              {/* Reviewer, Date & Rating Line */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">{rev.reviewer}</span>
                  <span className="text-slate-300 text-xs">•</span>
                  <span className="text-[11px] text-slate-400">{rev.location}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">{rev.date}</span>
              </div>

              {/* Star line */}
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-405 text-amber-400 font-black' : 'text-slate-100'}`} 
                  />
                ))}
              </div>

              {/* Clean Review Text */}
              <p className="text-slate-600 text-xs leading-relaxed max-w-2xl pt-1">
                {rev.text}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* STANDARD LIGHTBOX MODAL TRIGGER SYSTEM FOR EXTRA PHOTOS */}
      <AnimatePresence>
        {lightboxImages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8" 
            id="lightbox-modal"
          >
          
          {/* Header Controls */}
          <div className="flex items-center justify-between text-white border-b border-white/[0.08] pb-4">
            <div className="font-mono text-[10px] tracking-widest text-slate-400">
              {product.name} — IMAGE {lightboxIndex + 1} OF {lightboxImages.length}
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 hover:bg-white/[0.08] rounded-full transition-colors cursor-pointer text-slate-300 hover:text-white"
              title="Close gallery"
              id="btn-lightbox-close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Active Big Image Stage */}
          <div className="flex-grow flex items-center justify-center relative my-4">
            
            {/* Prev Trigger */}
            <button
              onClick={handlePrevLightboxPhoto}
              className="absolute left-2 sm:left-4 p-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-full text-white cursor-pointer transition-colors"
              title="Previous photo"
              id="btn-lightbox-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Main Stage Image */}
            <img
              src={lightboxImages[lightboxIndex]}
              alt={`${product.name} premium detail`}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] max-w-[85vw] object-contain rounded-lg drop-shadow-2xl animate-none"
            />

            {/* Next Trigger */}
            <button
              onClick={handleNextLightboxPhoto}
              className="absolute right-2 sm:right-4 p-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-full text-white cursor-pointer transition-colors"
              title="Next photo"
              id="btn-lightbox-next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

          </div>

          {/* Bottom Thumbnails Navigation Tray & quick advice */}
          <div className="space-y-4 pb-4">
            <div className="flex justify-center gap-2 max-w-lg mx-auto">
              {lightboxImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 cursor-pointer bg-slate-900 transition-all ${
                    lightboxIndex === idx ? 'border-sky-400 scale-[0.96] opacity-100' : 'border-white/[0.08] opacity-60 hover:opacity-100'
                  }`}
                  id={`btn-lightbox-thumb-${idx}`}
                >
                  <img
                    src={imgUrl}
                    alt="gallery thumbnail"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              Use arrows or tap thumbnails to view full resolution details. Click 'X' to return.
            </p>
          </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
