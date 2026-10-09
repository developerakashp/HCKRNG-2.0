"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  Coffee, Menu as MenuIcon, X, MapPin, Star, Wifi, Clock, ArrowRight, ArrowUpRight, GraduationCap
} from "lucide-react";

// Lazy-load the heavy canvas animation
const CoffeeShopIntro = dynamic(() => import("./components/CoffeeShopIntro"), {
  ssr: false,
});

export default function NammaBrew() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <CoffeeShopIntro onComplete={handleIntroComplete} />}
      <div className="bg-[#FDFBF7] text-[#3E2723] min-h-screen selection:bg-[#2E4F4F] selection:text-white">
        <Navbar />
        <Hero />
        <WhyNammaBrew />
        <SignatureMenu />
        <FullMenu />
        <SpecialOffer />
        <StudentOffer />
        <Gallery />
        <OurStory />
        <CustomerLove />
        <Location />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}

// --- TYPOGRAPHY UTILS ---
const playfair = { fontFamily: 'var(--font-playfair)' };
const caveat = { fontFamily: 'var(--font-caveat)' };

// --- COMPONENTS ---

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed w-full z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#3E2723]/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-[#3E2723] rounded-full flex items-center justify-center text-[#FDFBF7]">
            <Coffee className="w-5 h-5" />
          </div>
          <span style={playfair} className="font-bold text-2xl tracking-tight text-[#3E2723]">Namma Brew</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Menu', 'Our Story', 'Offers', 'Visit Us'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-[#3E2723]/70 hover:text-[#2E4F4F] transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/campaign" className="px-5 py-2.5 bg-white border border-[#3E2723]/20 text-[#3E2723] rounded-full text-sm font-semibold hover:border-[#2E4F4F] hover:text-[#2E4F4F] transition-colors shadow-sm">
            Create Campaign
          </Link>
          <a href="#menu" className="px-6 py-2.5 bg-[#2E4F4F] hover:bg-[#1a2d2d] text-white rounded-full text-sm font-semibold transition-colors inline-block text-center">Order Now</a>
        </div>

        {/* Mobile Toggle */}
        <button type="button" className="md:hidden text-[#3E2723]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#FDFBF7] border-b border-[#3E2723]/10 px-6 py-6 flex flex-col gap-6 shadow-xl">
          {['Home', 'Menu', 'Our Story', 'Offers', 'Visit Us'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setIsOpen(false)} className="text-lg font-medium text-[#3E2723]">
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-[#3E2723]/10">
            <Link href="/campaign" className="px-6 py-3 bg-white border border-[#3E2723]/20 text-[#3E2723] rounded-full font-semibold w-full text-center">
              Create Campaign
            </Link>
            <a href="#menu" className="px-6 py-2.5 bg-[#2E4F4F] hover:bg-[#1a2d2d] text-white rounded-full text-sm font-semibold transition-colors inline-block text-center">Order Now</a>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-40 left-10 opacity-20">
        <Coffee className="w-12 h-12 text-[#3E2723] rotate-12" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 hidden md:block">
        <Star className="w-16 h-16 text-[#D4AF37] -rotate-12" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div className="space-y-8 z-10">
          <div>
            <span className="inline-block px-4 py-1.5 bg-[#F5F0E6] text-[#3E2723] rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Bengaluru's Favorite Coffee Spot
            </span>
            <h1 style={playfair} className="text-6xl md:text-8xl font-bold leading-[1.1] text-[#3E2723]">
              Namma Coffee.<br/>
              <span className="relative">
                Namma <span style={caveat} className="text-[#2E4F4F] text-7xl md:text-9xl ml-2 inline-block -rotate-3">Vibe.</span>
              </span>
            </h1>
          </div>
          
          <div className="space-y-3">
            <p className="text-xl text-[#3E2723]/80 max-w-md leading-relaxed">
              Great coffee, tasty bites and good vibes — made for Bengaluru.
            </p>
            <p className="text-lg font-medium text-[#2E4F4F]">
              ಒಂದು ಕಾಫಿ, ಇನ್ನೊಂದು ಫೀಲ್!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a href="#menu" className="px-8 py-4 bg-[#3E2723] hover:bg-[#2a1a17] text-white rounded-full font-medium transition-colors shadow-lg shadow-[#3E2723]/20 inline-flex items-center gap-2">Explore Menu <ArrowRight className="w-4 h-4" /></a>
            <a href="#visit-us" className="px-8 py-4 bg-transparent border-2 border-[#3E2723] hover:bg-[#3E2723] hover:text-white text-[#3E2723] rounded-full font-medium transition-all inline-block">Visit Us</a>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative z-10">
          <div className="absolute -inset-4 bg-[#F5F0E6] rounded-[2rem] rotate-3 -z-10"></div>
          <div className="relative h-[500px] md:h-[650px] w-full rounded-[2rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80" 
              alt="Pouring hot coffee in a cozy cafe" 
              className="w-full h-full object-cover"
            />
            {/* Offer Badge Overlay */}
            <div className="absolute top-6 right-6 md:-right-6 md:top-12 bg-[#D4AF37] text-white p-6 rounded-2xl shadow-xl transform rotate-6 border-4 border-white">
              <p className="text-xs font-bold uppercase tracking-wider mb-1">Limited Offer</p>
              <h4 style={playfair} className="text-2xl font-bold leading-tight">BUY 1<br/>GET 1</h4>
              <p className="text-sm font-medium mt-1">ON ALL COFFEES</p>
              <p className="text-[10px] mt-2 font-medium opacity-90">ಒಂದು ಕಾಫಿ ಕೊಂಡ್ರೆ<br/>ಇನ್ನೊಂದು ಫ್ರೀ!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyNammaBrew() {
  const features = [
    { icon: <Coffee className="w-6 h-6"/>, title: "Great Coffee", desc: "Freshly brewed, every single time." },
    { icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, title: "Tasty Bites", desc: "Comfort food made for every mood." },
    { icon: <Star className="w-6 h-6"/>, title: "Chill Ambience", desc: "A cozy space to work, relax and connect." },
    { icon: <Wifi className="w-6 h-6"/>, title: "Free Wi-Fi", desc: "Stay productive while you sip." }
  ];

  return (
    <section className="py-24 bg-[#3E2723] text-[#FDFBF7] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 style={playfair} className="text-4xl md:text-5xl font-bold mb-4">More Than Just Coffee.</h2>
          <p className="text-[#FDFBF7]/70 text-lg max-w-xl mx-auto">Your everyday place to slow down, catch up and enjoy something good.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 border border-[#FDFBF7]/10 rounded-2xl hover:bg-[#FDFBF7]/5 transition-colors group">
              <div className="w-12 h-12 bg-[#2E4F4F] rounded-full flex items-center justify-center text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-[#FDFBF7]/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SignatureMenu() {
  const menu = [
    { name: "Filter Coffee", desc: "Classic South Indian drip", price: "₹80", img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80" },
    { name: "Cold Coffee", desc: "Thick, creamy, refreshing", price: "₹180", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80" },
    { name: "Cappuccino", desc: "Perfectly steamed milk", price: "₹160", img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80" },
    { name: "Masala Chai", desc: "Spiced ginger delight", price: "₹70", img: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=600&q=80" },
    { name: "Veg Sandwich", desc: "Grilled Bombay style", price: "₹140", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80" },
    { name: "Signature Brownie", desc: "Warm, gooey, chocolatey", price: "₹120", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80" },
  ];

  return (
    <section id="signature-menu" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[#2E4F4F] font-bold tracking-widest uppercase text-xs">Our Menu</span>
          <h2 style={playfair} className="text-4xl md:text-5xl font-bold text-[#3E2723] mt-2">Made to Make You Stay.</h2>
        </div>
        <a href="#menu" className="inline-flex items-center gap-2 text-[#3E2723] font-medium hover:text-[#2E4F4F] transition-colors">View Full Menu <ArrowRight className="w-4 h-4" /></a>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto pb-12 pt-4 -mx-6 px-6 gap-6 snap-x hide-scrollbar">
          {menu.map((item, i) => (
            <div key={i} className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl p-4 shadow-sm border border-[#3E2723]/5 hover:-translate-y-2 transition-transform duration-300 snap-start">
              <div className="h-48 rounded-xl overflow-hidden mb-4 bg-[#F5F0E6]">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-[#3E2723]">{item.name}</h3>
                <span className="font-bold text-[#2E4F4F]">{item.price}</span>
              </div>
              <p className="text-[#3E2723]/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FullMenu() {
  const [activeCategory, setActiveCategory] = useState("COFFEE");

  const categories = ["COFFEE", "TEA", "COLD DRINKS", "BREAKFAST", "BITES", "DESSERTS"];

  const menuData: Record<string, any[]> = {
    "COFFEE": [
      { name: "Bengaluru Filter Coffee", desc: "Strong, smooth and unmistakably South Indian.", price: "₹90", img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80", popular: true, veg: true },
      { name: "Classic Cappuccino", desc: "Rich espresso with silky steamed milk.", price: "₹150", img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80", veg: true },
      { name: "Café Latte", desc: "Smooth espresso balanced with creamy milk.", price: "₹160", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80", veg: true },
      { name: "Mocha", desc: "Espresso, chocolate and steamed milk.", price: "₹180", img: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80", veg: true }
    ],
    "TEA": [
      { name: "Masala Chai", desc: "Aromatic Indian tea brewed with warming spices.", price: "₹80", img: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=600&q=80", popular: true, veg: true },
      { name: "Ginger Tea", desc: "Fresh ginger with a comforting cup of tea.", price: "₹70", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637536?auto=format&fit=crop&w=600&q=80", veg: true },
      { name: "Green Tea", desc: "Light, refreshing and naturally calming.", price: "₹90", img: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80", veg: true }
    ],
    "COLD DRINKS": [
      { name: "Classic Cold Coffee", desc: "Creamy, chilled and made for Bengaluru afternoons.", price: "₹160", img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80", popular: true, veg: true },
      { name: "Cold Mocha", desc: "Chilled coffee blended with rich chocolate.", price: "₹190", img: "https://images.unsplash.com/photo-1562547256-2c5ee93b60b7?auto=format&fit=crop&w=600&q=80", veg: true },
      { name: "Iced Latte", desc: "Smooth espresso served over chilled milk and ice.", price: "₹170", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80", veg: true }
    ],
    "BREAKFAST": [
      { name: "Masala Dosa", desc: "Crispy dosa served with chutney and sambar.", price: "₹140", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", popular: true, veg: true },
      { name: "Idli & Vada", desc: "Soft idlis and crispy vada with fresh chutney.", price: "₹120", img: "https://images.unsplash.com/photo-1610392972473-f009c13ce74e?auto=format&fit=crop&w=600&q=80", veg: true },
      { name: "Ghee Podi Idli", desc: "Soft idlis tossed with ghee and spicy podi.", price: "₹130", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80", veg: true }
    ],
    "BITES": [
      { name: "Veg Grilled Sandwich", desc: "Grilled vegetables, cheese and our signature sauce.", price: "₹160", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80", popular: true, veg: true },
      { name: "Paneer Sandwich", desc: "Spiced paneer with fresh vegetables and cheese.", price: "₹180", img: "https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=600&q=80", veg: true },
      { name: "French Fries", desc: "Crispy golden fries with our house dip.", price: "₹120", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80", veg: true },
      { name: "Masala Fries", desc: "Crispy fries tossed in our signature masala.", price: "₹140", img: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80", veg: true }
    ],
    "DESSERTS": [
      { name: "Chocolate Brownie", desc: "Warm, rich and fudgy chocolate brownie.", price: "₹130", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", popular: true, veg: true },
      { name: "Classic Cheesecake", desc: "Creamy cheesecake with a delicate biscuit base.", price: "₹180", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80", veg: false },
      { name: "Chocolate Lava Cake", desc: "Warm chocolate cake with a molten centre.", price: "₹190", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&q=80", veg: false }
    ]
  };

  return (
    <section id="menu" className="py-24 px-6 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#2E4F4F] font-bold tracking-widest uppercase text-xs">Our Menu</span>
          <h2 style={playfair} className="text-4xl md:text-5xl font-bold text-[#3E2723] mt-2 mb-4">Something for Every Mood.</h2>
          <p className="text-[#3E2723]/70 text-lg max-w-2xl mx-auto">From Bengaluru filter coffee to café favourites, find your perfect sip and bite.</p>
        </div>

        {/* Featured Item */}
        <div className="mb-20 bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-[#3E2723]/5 flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden group">
          <div className="md:w-1/2 relative z-10 space-y-6">
            <span className="inline-block px-4 py-1.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-xs font-bold uppercase tracking-widest">The Namma Special</span>
            <h3 style={playfair} className="text-4xl md:text-5xl font-bold text-[#3E2723]">Bengaluru Filter Coffee</h3>
            <p className="text-[#3E2723]/70 text-lg leading-relaxed">
              Our signature blend, roasted to perfection and brewed the traditional way. Served frothy and strong.
            </p>
            <p style={caveat} className="text-3xl text-[#2E4F4F]">ಬೆಂಗಳೂರಿನ ರುಚಿ, ಒಂದು ಕಪ್ನಲ್ಲಿ</p>
            <a href="#menu" className="inline-block px-8 py-4 bg-[#3E2723] text-white rounded-full font-medium hover:bg-[#2a1a17] transition-colors mt-2 shadow-lg shadow-[#3E2723]/20">Order This</a>
          </div>
          <div className="md:w-1/2 h-[300px] md:h-[450px] w-full relative z-10 rounded-2xl overflow-hidden shadow-xl">
             <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80" alt="Filter Coffee" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5F0E6] rounded-full blur-3xl -z-0 opacity-50 translate-x-1/2 -translate-y-1/4"></div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar pb-6 mb-8 gap-4 justify-start md:justify-center">
          {categories.map(cat => (
            <button type="button" 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeCategory === cat 
                ? "bg-[#3E2723] text-white shadow-md" 
                : "bg-white text-[#3E2723]/70 hover:bg-[#F5F0E6] border border-[#3E2723]/10 hover:border-[#3E2723]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuData[activeCategory].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#3E2723]/10 hover:border-[#3E2723]/30 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl group flex flex-col">
              <div className="h-56 overflow-hidden relative bg-[#F5F0E6]">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {item.popular && (
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    Popular
                  </div>
                )}
                {item.veg !== undefined && (
                  <div className="absolute top-4 right-4 bg-white p-1 rounded-md shadow-sm border border-zinc-200">
                     <div className={`w-3 h-3 rounded-sm flex items-center justify-center border ${item.veg ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                     </div>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="font-bold text-xl text-[#3E2723] leading-tight">{item.name}</h3>
                  <span className="font-bold text-[#2E4F4F] text-lg bg-[#F5F0E6] px-3 py-1 rounded-lg shrink-0">{item.price}</span>
                </div>
                <p className="text-[#3E2723]/60 text-sm leading-relaxed mb-6 flex-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Special Offer Promotional Banner under menu */}
        <div className="mt-16 bg-[#F5F0E6] border border-[#3E2723]/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/4"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-[#2E4F4F] rounded-full flex items-center justify-center text-[#D4AF37] shrink-0">
                 <Coffee className="w-8 h-8" />
              </div>
              <div>
                 <h4 className="font-bold text-[#3E2723] text-xl mb-1">BUY 1 GET 1 ON ALL COFFEES</h4>
                 <p className="text-[#3E2723]/70">ಒಂದು ಕಾಫಿ ಕೊಂಡ್ರೆ ಇನ್ನೊಂದು ಫ್ರೀ! Don't miss out on our weekend special.</p>
              </div>
           </div>
           <a href="#offers" className="inline-block px-6 py-3 bg-[#D4AF37] text-[#3E2723] rounded-full font-bold shadow-md hover:bg-[#b5952f] transition-colors">Grab The Offer</a>
        </div>

      </div>
    </section>
  );
}


function SpecialOffer() {
  return (
    <section id="offers" className="py-20 px-6">
      <div className="max-w-5xl mx-auto bg-[#2E4F4F] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="p-12 md:p-16 flex-1 relative z-10 flex flex-col justify-center text-white">
          <span style={caveat} className="text-[#D4AF37] text-3xl mb-2">Weekend Special</span>
          <h2 style={playfair} className="text-5xl md:text-7xl font-bold leading-none mb-2">BUY 1 <br/><span className="text-[#D4AF37]">GET 1</span></h2>
          <p className="text-xl tracking-widest uppercase font-bold mb-6 opacity-90">ON ALL COFFEES</p>
          <p className="text-lg mb-8 font-medium bg-white/10 self-start px-4 py-2 rounded-lg">ಒಂದು ಕಾಫಿ ಕೊಂಡ್ರೆ ಇನ್ನೊಂದು ಫ್ರೀ!</p>
          <a href="#offers" className="inline-block px-6 py-3 bg-[#D4AF37] text-[#3E2723] rounded-full font-bold shadow-md hover:bg-[#b5952f] transition-colors">Grab The Offer</a>
        </div>
        <div className="md:w-2/5 h-[300px] md:h-auto">
          <img src="https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=800&q=80" alt="Two coffees" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function StudentOffer() {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#2E4F4F] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row items-center border border-[#3E2723]/10 relative group">
          {/* Background Decorative Pattern */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -z-0 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#D4AF37]/10 rounded-full blur-2xl -z-0 -translate-x-1/2 translate-y-1/4"></div>
          
          <div className="md:w-1/2 p-10 md:p-16 lg:p-20 relative z-10 text-white flex flex-col items-center md:items-start text-center md:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-[#D4AF37]/30">
              <GraduationCap className="w-4 h-4" /> STUDENT SPECIAL
            </span>
            <h2 style={playfair} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Students, This One's For You!</h2>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-4 max-w-lg">
              Show your valid student ID and enjoy 20% off your entire bill. Keep the ideas brewing!
            </p>
            <p style={caveat} className="text-3xl text-[#D4AF37] mb-10 opacity-90">
              ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿಶೇಷ — ಬಿಲ್ ಮೇಲೆ 20% ರಿಯಾಯಿತಿ!
            </p>
            <a href="#offers" className="inline-block px-10 py-5 bg-[#D4AF37] text-[#3E2723] rounded-full font-bold hover:bg-white hover:text-[#2E4F4F] transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-1">Claim Student Offer</a>
          </div>
          
          <div className="md:w-1/2 w-full h-[400px] md:h-auto md:self-stretch relative z-10 overflow-hidden">
            <img 
              src="/images/student_offer.jpg" 
              alt="Students hanging out at a premium cafe" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" 
            />
            {/* Gradient Overlay for seamless blend */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#2E4F4F] via-[#2E4F4F]/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const images = [
    "/images/vibe1.jpg",
    "/images/vibe2.jpg",
    "/images/vibe3.jpg",
    "/images/vibe4.jpg",
    "/images/vibe5.jpg",
    "/images/vibe6.jpg"
  ];
  return (
    <section className="py-24 px-6 bg-[#F5F0E6]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 style={playfair} className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-4">The Namma Vibe</h2>
          <p className="text-[#3E2723]/70 text-lg">ನಮ್ಮ ಬೆಂಗಳೂರು, ನಮ್ಮ ಕಾಫಿ.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((img, i) => (
            <div key={i} className={`rounded-2xl overflow-hidden shadow-sm aspect-square relative group`}>
              <img src={img} alt="Cafe Vibe" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-medium flex items-center gap-2">@nammabrew</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OurStory() {
  return (
    <section id="our-story" className="py-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-6">
          <h2 style={playfair} className="text-4xl md:text-5xl font-bold text-[#3E2723]">Born in Bengaluru.</h2>
          <p className="text-lg text-[#3E2723]/80 leading-relaxed">
            Namma Brew brings together the warmth of Bengaluru, the comfort of good coffee and the joy of spending time together. 
          </p>
          <p className="text-lg text-[#3E2723]/80 leading-relaxed">
            Whether you're grabbing a quick filter coffee before work or settling in with your laptop for the afternoon, this is your space.
          </p>
          <p style={caveat} className="text-3xl text-[#2E4F4F] pt-4">
            This is our spot!
          </p>
        </div>
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-[#D4AF37] rounded-3xl translate-x-4 translate-y-4 -z-10"></div>
          <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80" alt="Cafe Interior" className="rounded-3xl w-full h-[500px] object-cover shadow-lg" />
        </div>
      </div>
    </section>
  );
}

function CustomerLove() {
  const reviews = [
    { text: "Perfect place for evening coffee and conversations. The vibe is immaculate.", kannada: "Our favorite spot for evening coffee!", author: "Ananya", role: "Local Guide" },
    { text: "The filter coffee tastes just like home. Absolutely love the sandwiches too!", kannada: "The taste of home — found right here.", author: "Rahul", role: "Regular Customer" },
    { text: "Great ambience, great coffee, great vibes. My new favorite hangout spot.", kannada: "Great ambience, great coffee — Namma Brew!", author: "Kiran", role: "Freelancer" }
  ];
  
  return (
    <section className="py-24 px-6 bg-[#3E2723] text-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 style={playfair} className="text-4xl md:text-5xl font-bold mb-2">Customer Love</h2>
          <p className="text-[#D4AF37] text-sm mb-3">Our Reviews</p>
          <p className="text-[#FDFBF7]/70 text-lg">What Bengaluru says about us.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-[#4A3B32] p-8 rounded-2xl relative">
              <div className="text-[#D4AF37] mb-6 flex gap-1">
                {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-lg leading-relaxed mb-3 italic text-[#FDFBF7]/90">&ldquo;{r.text}&rdquo;</p>
              <p style={caveat} className="text-[#D4AF37] text-xl mb-4">{r.kannada}</p>
              <div>
                <p className="font-bold">{r.author}</p>
                <p className="text-sm text-[#FDFBF7]/50">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="visit-us" className="py-24 px-6 bg-[#F5F0E6]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#3E2723]/5">
        <div className="flex-1 space-y-8">
          <div>
            <h2 style={playfair} className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-4">Come Find Your Namma.</h2>
            <p className="text-[#3E2723]/70 text-lg">Drop by for a cup. We'd love to see you.</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#F5F0E6] rounded-full flex items-center justify-center text-[#2E4F4F] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#3E2723]">Location</h4>
                <p className="text-[#3E2723]/70">Koramangala, Bengaluru, Karnataka, India</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#F5F0E6] rounded-full flex items-center justify-center text-[#2E4F4F] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#3E2723]">Hours</h4>
                <p className="text-[#3E2723]/70">Open Daily<br/>8:00 AM — 11:00 PM</p>
              </div>
            </div>
          </div>
          
          <a href="#visit-us" className="inline-flex px-8 py-4 bg-[#3E2723] text-white rounded-full font-medium hover:bg-[#2a1a17] transition-colors items-center gap-2">Get Directions <ArrowUpRight className="w-4 h-4" /></a>
        </div>
        
        <div className="flex-1 w-full h-[400px] bg-[#F5F0E6] rounded-2xl overflow-hidden relative border border-[#3E2723]/10">
          {/* Stylized map placeholder */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')] opacity-50 bg-cover bg-center"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-16 h-16 bg-[#D4AF37] text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <MapPin className="w-8 h-8" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-32 px-6 bg-[#2E4F4F] text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 style={playfair} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Good Coffee.<br/>Good Food.<br/><span className="text-[#D4AF37]">Namma Bengaluru.</span>
        </h2>
        <p className="text-2xl text-white/90 font-medium mb-10">ಬನ್ನಿ, ಒಂದು ಕಪ್ ಮಾತಾಡೋಣ.</p>
        <a href="#visit-us" className="inline-block px-10 py-5 bg-[#D4AF37] hover:bg-[#b5952f] text-[#3E2723] rounded-full text-lg font-bold transition-colors shadow-xl">Visit Namma Brew</a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#3E2723] text-[#FDFBF7]/60 py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Coffee className="w-6 h-6 text-[#D4AF37]" />
          <span style={playfair} className="font-bold text-2xl text-white">Namma Brew</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-medium text-white/80">
          <span>Coffee</span>
          <span className="w-1 h-1 rounded-full bg-[#D4AF37]"></span>
          <span>Food</span>
          <span className="w-1 h-1 rounded-full bg-[#D4AF37]"></span>
          <span>Good Vibes</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
          <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 text-center md:text-left text-sm flex flex-col md:flex-row justify-between">
        <p>&copy; 2026 Namma Brew. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Koramangala, Bengaluru, Karnataka, India</p>
      </div>
    </footer>
  );
}
