import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { PackagesSection } from './components/PackagesSection';
import { LabelVisualizer } from './components/LabelVisualizer';
import { EventInquiryModal } from './components/EventInquiryModal';
import { CartDrawer } from './components/CartDrawer';
import { ScentQuizModal } from './components/ScentQuizModal';
import { Footer } from './components/Footer';

import { PERFUME_PRODUCTS, DISCOVERY_SETS } from './data/products';
import { PerfumeProduct, CartItem, ScentFamily } from './types';
import { Sparkles, Search, Check, ShoppingBag, Eye, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function App() {
  // Navigation & section
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Search & Category Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers state
  const [selectedProductForModal, setSelectedProductForModal] = useState<PerfumeProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingPackageId, setBookingPackageId] = useState<string>('first-class');
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [attachedLabelForQuote, setAttachedLabelForQuote] = useState<{
    title: string;
    date: string;
    coordinates: string;
    scents: string;
  } | null>(null);

  // Cart state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('coordinates_parfum_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial luxury item in cart for high visual conversion & ease of testing
    return [
      {
        cartId: 'tokyo-50-init',
        productId: 'tokyo',
        productName: 'TOKYO • Cherry Blossom & White Musk',
        city: 'Tokyo',
        coordinates: "35° 41' 1.4964\" N 139° 46' 2.2368\" E",
        size: '50ml Bottle',
        price: 2450,
        quantity: 1,
        giftBox: true,
        customEngraving: 'Aug 3, 2026'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('coordinates_parfum_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add to cart handler
  const handleAddToCart = (
    product: PerfumeProduct,
    size: '10ml Roller' | '50ml Bottle' | '100ml Bottle',
    customEngraving?: string,
    giftBox: boolean = true
  ) => {
    let price = product.price50ml;
    if (size === '10ml Roller') price = product.samplePrice || 450;
    if (size === '100ml Bottle') price = product.price100ml;

    const cartId = `${product.id}-${size}-${customEngraving || 'standard'}`;

    setCartItems(prev => {
      const existing = prev.find(it => it.cartId === cartId);
      if (existing) {
        return prev.map(it => it.cartId === cartId ? { ...it, quantity: it.quantity + 1 } : it);
      }
      return [
        ...prev,
        {
          cartId,
          productId: product.id,
          productName: `${product.name} • ${product.city}`,
          city: product.city,
          coordinates: product.coordinates,
          size,
          price,
          quantity: 1,
          customEngraving,
          giftBox
        }
      ];
    });

    setIsCartOpen(true);
  };

  // Add discovery set directly to cart
  const handleAddDiscoverySet = (set: typeof DISCOVERY_SETS[0]) => {
    const sizeName = set.id === 'discovery-10' ? 'Discovery Set (10 Scents)' : 'Discovery Set (20 Scents)';
    const cartId = `${set.id}-cart`;

    setCartItems(prev => {
      const existing = prev.find(it => it.cartId === cartId);
      if (existing) {
        return prev.map(it => it.cartId === cartId ? { ...it, quantity: it.quantity + 1 } : it);
      }
      return [
        ...prev,
        {
          cartId,
          productId: set.id,
          productName: set.name,
          city: 'Global Atelier',
          coordinates: '14° 35\' 58" N 120° 58\' 56" E',
          size: sizeName,
          price: set.price,
          quantity: 1,
          giftBox: true
        }
      ];
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(it => {
          if (it.cartId === cartId) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter((it): it is CartItem => it !== null)
    );
  };

  const handleRemoveCartItem = (cartId: string) => {
    setCartItems(prev => prev.filter(it => it.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenBookingForPackage = (packageId: string) => {
    setBookingPackageId(packageId);
    setIsBookingOpen(true);
  };

  const handleApplyLabelToQuote = (data: { title: string; date: string; coordinates: string; scents: string }) => {
    setAttachedLabelForQuote(data);
    setIsBookingOpen(true);
  };

  // Filtering products
  const filteredProducts = PERFUME_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      product.name.toLowerCase().includes(q) ||
      product.city.toLowerCase().includes(q) ||
      product.country.toLowerCase().includes(q) ||
      product.topNotes.some(n => n.toLowerCase().includes(q)) ||
      product.heartNotes.some(n => n.toLowerCase().includes(q)) ||
      product.baseNotes.some(n => n.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  const categories: (string | ScentFamily)[] = [
    'All',
    'Floral',
    'Fresh & Citrus',
    'Woody & Earthy',
    'Warm & Amber',
    'Aquatic & Clean'
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2825] flex flex-col selection:bg-[#2C2825] selection:text-[#FAF8F5]">
      {/* Primary Sticky Header */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenEventBooking={() => handleOpenBookingForPackage('first-class')}
        onOpenQuiz={() => setIsQuizOpen(true)}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      <main className="flex-1">
        {/* Editorial Hero Component */}
        <Hero
          onExploreScents={() => scrollToSection('shop-scents')}
          onExplorePackages={() => scrollToSection('wedding-packages')}
          onOpenVisualizer={() => scrollToSection('custom-bottle-visualizer')}
        />

        {/* SHOP SCENTS SECTION */}
        <section id="shop-scents" className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E8E2D9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* Header & Scent Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EAE4D9] pb-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFECE6] border border-[#DDD5C7] text-[#7A7067] text-[10px] tracking-[0.2em] uppercase font-semibold">
                  <span>Destination Eau de Parfum</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-light text-[#2C2825] tracking-tight">
                  The Fragrance Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#6E645A]">
                  Artisanal 25% Extrait formulations inspired by the sensory memory of global destinations.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search size={15} className="absolute left-3.5 top-3 text-[#8A8177]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, accords, notes..."
                  className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full border border-[#D5CEC4] bg-white focus:outline-none focus:ring-1 focus:ring-[#2C2825]"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
                    selectedCategory === cat
                      ? 'bg-[#2C2825] text-white shadow-sm'
                      : 'bg-white border border-[#DDD5C7] text-[#5A524A] hover:bg-[#F2EFE8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center text-sm text-[#7A7167]">
                No fragrances matched "{searchQuery}". Try searching for Tokyo, Paris, Rose, or Hinoki.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(prod, size) => handleAddToCart(prod, size)}
                    onViewDetails={(prod) => setSelectedProductForModal(prod)}
                  />
                ))}
              </div>
            )}

          </div>
        </section>

        {/* DISCOVERY SETS (10 Scents & 20 Scents) */}
        <section id="discovery-sets" className="py-16 sm:py-24 bg-[#F4F0E8] border-b border-[#E6DFD4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-[0.2em] font-mono-coord text-[#8E5E52] font-semibold">
                Olfactory Tasting Flights
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-[#2C2825] tracking-tight">
                Curated Discovery Sets
              </h2>
              <p className="text-xs sm:text-sm text-[#686057] leading-relaxed">
                Experience our complete olfactory library in the comfort of your home. Ideal for personal testing or selecting your official wedding & event scents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {DISCOVERY_SETS.map((set) => (
                <div
                  key={set.id}
                  className="bg-white border border-[#DDD5C7] rounded-2xl p-7 sm:p-9 flex flex-col justify-between shadow-sm hover:border-[#8E5E52] transition-colors relative"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-coord uppercase tracking-widest text-[#8E5E52] font-semibold bg-[#FAF3F0] px-3 py-1 rounded-full">
                        {set.badge}
                      </span>
                      <span className="text-xl font-light font-mono-coord font-semibold text-[#2C2825]">
                        ₱{set.price.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-light text-[#2C2825]">
                        {set.name}
                      </h3>
                      <p className="text-xs font-mono-coord text-[#80766B] mt-0.5">
                        {set.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-[#635B53] leading-relaxed">
                      {set.description}
                    </p>

                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-semibold text-[#2C2825] tracking-wider block mb-2">
                        Included Scents in Tasting Set:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {set.scents.map((s, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-[#F5F2EB] text-[#4A433D] px-2.5 py-1 rounded-md border border-[#E8E2D9]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#F0EBE3] flex items-center justify-between gap-4">
                    <span className="text-[11px] text-[#7A7167]">
                      Includes ₱500 voucher credit towards 50ml/100ml bottle
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddDiscoverySet(set)}
                      className="bg-[#2C2825] hover:bg-[#433D37] text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <ShoppingBag size={13} />
                      <span>Order Set</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* THE CORE PACKAGES SECTION (First Class, Business Class, Regular Class, Stag/Bachelorette, Add-ons, Pax tiers) */}
        <PackagesSection
          onSelectPackageForInquiry={handleOpenBookingForPackage}
          onOpenLabelStudio={() => scrollToSection('custom-bottle-visualizer')}
        />

        {/* INTERACTIVE BESPOKE BOTTLE & LABEL VISUALIZER */}
        <LabelVisualizer
          initialProduct={PERFUME_PRODUCTS[0]}
          onApplyToQuote={handleApplyLabelToQuote}
        />

      </main>

      {/* FOOTER */}
      <Footer
        onNavigate={scrollToSection}
        onOpenBooking={() => handleOpenBookingForPackage('first-class')}
      />

      {/* DETAILED SCENT INSPECTION MODAL */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
        onOpenLabelStudio={(prod) => {
          setSelectedProductForModal(null);
          scrollToSection('custom-bottle-visualizer');
        }}
      />

      {/* SHOPPING BAG SLIDE-OVER DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* EVENT PACKAGE BOOKING & INQUIRY MODAL */}
      <EventInquiryModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedPackageId={bookingPackageId}
        attachedLabelData={attachedLabelForQuote}
      />

      {/* SCENT FINDER QUIZ MODAL */}
      <ScentQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectProduct={(prod) => setSelectedProductForModal(prod)}
      />
    </div>
  );
}
