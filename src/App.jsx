import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Award,
  Bell,
  Box,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Eye,
  EyeOff,
  Gift,
  Heart,
  LogOut,
  MessageCircle,
  Menu,
  Minus,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  SlidersHorizontal,
  TrendingUp,
  User,
  X,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';
const LOCAL_USER_KEY = 'lumina-user';
const LOCAL_TOKEN_KEY = 'lumina-token';
const LOCAL_CART_KEY = 'lumina-cart';
const LOCAL_WISHLIST_KEY = 'lumina-wishlist';
const LOCAL_RECENT_KEY = 'lumina-recent';
const LOCAL_THEME_KEY = 'lumina-theme';

const sampleProducts = [
  { id: '1', name: 'Silk Cashmere Scarf', category: 'Accessories', price: 145, description: 'Soft cashmere with a luxurious finish.', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80' },
  { id: '2', name: 'Minimalist Leather Tote', category: 'Bags', price: 220, description: 'A versatile leather tote for everyday elegance.', image: 'https://images.unsplash.com/photo-1519741499509-9f648ec21851?auto=format&fit=crop&w=900&q=80' },
  { id: '3', name: 'Modern Wool Coat', category: 'Outerwear', price: 395, description: 'Tailored wool coat with refined silhouettes.', image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80' },
  { id: '4', name: 'Classic Runner Sneakers', category: 'Footwear', price: 180, description: 'Comfortable runners with a sleek profile.', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80' },
  { id: '5', name: 'Organic Linen Shirt', category: 'Clothing', price: 110, description: 'Breathable linen for relaxed luxury.', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80' },
  { id: '6', name: 'Fine Knit Sweater', category: 'Clothing', price: 155, description: 'A lightweight sweater with elevated texture.', image: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d1?auto=format&fit=crop&w=900&q=80' },
  { id: '7', name: 'Signature Blazer', category: 'Outerwear', price: 320, description: 'Sharp tailoring with a modern silhouette.', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80' },
  { id: '8', name: 'Suede Ankle Boots', category: 'Footwear', price: 260, description: 'Smooth suede with luxe finishing details.', image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80' },
];

const categories = ['All', 'Accessories', 'Bags', 'Outerwear', 'Footwear', 'Clothing'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];

const testimonials = [
  { id: 1, name: 'Mia Lopez', role: 'Style Editor', quote: 'Every piece feels premium and effortless. The quality is unmatched.', rating: 5 },
  { id: 2, name: 'Noah Kim', role: 'Entrepreneur', quote: 'The shopping experience is smooth and elegant�exactly what a luxury brand should feel like.', rating: 5 },
];

const adminMetrics = [
  { title: 'Revenue', value: '$78.4K', icon: Activity, trend: '+18%' },
  { title: 'Orders', value: '1.2K', icon: ShoppingBag, trend: '+12%' },
  { title: 'Customers', value: '4.8K', icon: User, trend: '+8%' },
  { title: 'Returns', value: '24', icon: ShieldCheck, trend: '-2%' },
];

const stats = [
  { label: 'VIP launches', value: '12' },
  { label: '5-star reviews', value: '4.9/5' },
  { label: 'Satisfied customers', value: '18K+' },
];

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const loadJson = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(() => loadJson(LOCAL_USER_KEY, null));
  const [token, setToken] = useState(() => localStorage.getItem(LOCAL_TOKEN_KEY) || '');
  const [cart, setCart] = useState(() => loadJson(LOCAL_CART_KEY, []));
  const [wishlist, setWishlist] = useState(() => loadJson(LOCAL_WISHLIST_KEY, []));
  const [recentlyViewed, setRecentlyViewed] = useState(() => loadJson(LOCAL_RECENT_KEY, []));
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Newest');
  const [coupon, setCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', variant: 'success' });
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => loadJson(LOCAL_THEME_KEY, false));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ currentPassword: '', newPassword: '', phone: '' });
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => { localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user)); }, [user]);
  useEffect(() => { if (token) localStorage.setItem(LOCAL_TOKEN_KEY, token); else localStorage.removeItem(LOCAL_TOKEN_KEY); }, [token]);
  useEffect(() => { localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem(LOCAL_RECENT_KEY, JSON.stringify(recentlyViewed)); }, [recentlyViewed]);
  useEffect(() => { localStorage.setItem(LOCAL_THEME_KEY, JSON.stringify(isDarkMode)); }, [isDarkMode]);
  useEffect(() => { if (token) fetchProfile(); }, [token]);

  useEffect(() => {
    if (currentPage === 'products') {
      setIsLoadingProducts(true);
      const timeout = setTimeout(() => setIsLoadingProducts(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [currentPage, selectedCategory, search, selectedSort]);

  const apiRequest = async (path, method = 'GET', body = null, auth = true) => {
    const headers = {};
    if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
    if (auth && token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  };

  const showToast = (message, variant = 'success') => {
    setToast({ visible: true, message, variant });
    window.setTimeout(() => setToast((state) => ({ ...state, visible: false })), 3200);
  };

  const fetchProfile = async () => {
    try {
      const data = await apiRequest('/users/profile');
      setUser(data);
      setProfile(data);
    } catch (error) {
      setMessage(error.message);
      signOut();
    }
  };

  const signOut = () => {
    setUser(null);
    setProfile(null);
    setToken('');
    setCurrentPage('home');
    setMessage('Logged out successfully.');
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    try {
      setMessage('');
      const route = authMode === 'login' ? '/users/login' : '/users/register';
      const payload = { email: form.email, password: form.password };
      if (authMode === 'signup') payload.name = form.name;
      const data = await apiRequest(route, 'POST', payload, false);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.user);
      setCurrentPage('profile');
      setForm({ name: '', email: '', password: '' });
      setMessage(`Welcome ${data.user.name || data.user.email}`);
      showToast(`Welcome ${data.user.name || data.user.email}`);
    } catch (error) {
      setMessage(error.message);
      showToast(error.message, 'error');
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    try {
      const updates = { name: profile.name, email: profile.email, avatar: uploadedImageUrl || profile.avatar };
      if (profile.password) updates.password = profile.password;
      const data = await apiRequest('/users/profile', 'PUT', updates);
      setUser(data);
      setProfile(data);
      setMessage('Profile updated successfully.');
      showToast('Profile updated successfully.');
    } catch (error) {
      setMessage(error.message);
      showToast(error.message, 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Delete your account? This cannot be undone.')) return;
    try {
      await apiRequest('/users/profile', 'DELETE');
      signOut();
      setMessage('Account deleted.');
      showToast('Account deleted.', 'error');
    } catch (error) {
      setMessage(error.message);
      showToast(error.message, 'error');
    }
  };

  const handleUploadChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const handleUploadSubmit = async (event) => {
    event.preventDefault();
    if (!uploadFile) return setMessage('Please choose an image first.');
    try {
      const formData = new FormData();
      formData.append('image', uploadFile);
      const data = await apiRequest('/upload/image', 'POST', formData);
      setUploadedImageUrl(data.imageUrl);
      setMessage('Image uploaded successfully.');
      showToast('Image uploaded successfully.');
    } catch (error) {
      setMessage(error.message);
      showToast(error.message, 'error');
    }
  };

  const handleLoadUsers = async () => {
    try {
      const all = await apiRequest('/users');
      setUsers(all);
      showToast('Loaded protected users.');
    } catch (error) {
      setMessage(error.message);
      showToast(error.message, 'error');
    }
  };

  const addToCart = (product) => {
    if (!user) {
      setCurrentPage('login');
      setMessage('Sign in to add items to your bag.');
      showToast('Sign in to add items to your bag.', 'error');
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to bag.`);
  };

  const updateQty = (id, delta) => {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  };

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.includes(product.id);
      const next = exists ? current.filter((id) => id !== product.id) : [...current, product.id];
      showToast(exists ? `${product.name} removed from wishlist.` : `${product.name} saved to your wishlist.`);
      return next;
    });
  };

  const recordView = (productId) => {
    setRecentlyViewed((current) => {
      const next = [productId, ...current.filter((id) => id !== productId)].slice(0, 4);
      return next;
    });
  };

  const handleCouponApply = () => {
    if (coupon.trim().toUpperCase() === 'LUMINA10') {
      setCouponMessage('Coupon applied for 10% off.');
      showToast('Coupon applied successfully.');
    } else {
      setCouponMessage('Invalid code. Try LUMINA10.');
      showToast('Invalid coupon code.', 'error');
    }
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    try {
      if (settingsForm.newPassword && settingsForm.newPassword !== settingsForm.currentPassword) {
        if (settingsForm.newPassword.length < 6) {
          showToast('New password must be at least 6 characters.', 'error');
          return;
        }
      }
      const updates = { phone: settingsForm.phone || profile?.phone };
      if (settingsForm.newPassword) updates.password = settingsForm.newPassword;
      const data = await apiRequest('/users/profile', 'PUT', updates);
      setProfile(data);
      setSettingsForm({ currentPassword: '', newPassword: '', phone: '' });
      setSettingsModalOpen(false);
      showToast('Settings updated successfully.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const filteredProducts = [...sampleProducts]
    .filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (selectedSort === 'Price: Low to High') return a.price - b.price;
      if (selectedSort === 'Price: High to Low') return b.price - a.price;
      if (selectedSort === 'Newest') return Number(b.id) - Number(a.id);
      return 0;
    });

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const recentProducts = recentlyViewed.map((id) => sampleProducts.find((product) => product.id === id)).filter(Boolean);
  const ADMIN_EMAIL = 'dhruvil0409modi@gmail.com';
  const isAdmin = profile?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const pageBackground = isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F2EE] text-[#1F2937]';

  return (
    <div className={`${pageBackground} min-h-screen transition-colors duration-500`}>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/90 backdrop-blur-xl shadow-sm dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#111827] text-white shadow-lg">
              <Sparkles size={22} />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs uppercase tracking-[0.35em] text-[#6B7280]">Lumina</p>
              <h1 className="text-xl font-semibold text-[#111827] dark:text-slate-100">Fashion Studio</h1>
            </div>
          </button>

          <div className="hidden flex-1 items-center gap-4 md:flex">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search premium pieces"
                className="w-full rounded-full border border-[#E5E7EB] bg-[#F9FAFB] py-3 pl-12 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#111827]"
              />
            </div>
            <button className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1F2937]" onClick={() => setCurrentPage('products')}>Catalog</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              {user ? (
                <div className="relative">
                  <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white shadow-sm transition hover:bg-[#1F2937]">
                    {profile?.avatar ? <img src={profile.avatar} alt="Profile" className="h-full w-full rounded-full object-cover" /> : <User size={18} />}
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-[#E5E7EB] bg-white shadow-lg">
                      <div className="border-b border-[#E5E7EB] p-4">
                        <p className="text-xs uppercase tracking-[0.35em] text-[#6B7280]">Account</p>
                        <p className="mt-2 font-semibold text-[#111827]">{profile?.name || 'User'}</p>
                        <p className="text-sm text-[#6B7280]">{profile?.email}</p>
                      </div>
                      <div className="space-y-1 p-2">
                        <button onClick={() => { setCurrentPage('profile'); setProfileDropdownOpen(false); }} className="w-full rounded-lg px-4 py-2 text-left text-sm font-semibold text-[#111827] transition hover:bg-[#F3F4F6]">Profile</button>
                        <button onClick={() => { setSettingsModalOpen(true); setProfileDropdownOpen(false); }} className="w-full rounded-lg px-4 py-2 text-left text-sm font-semibold text-[#111827] transition hover:bg-[#F3F4F6]">Settings</button>
                        <button onClick={() => { setUser(null); setToken(''); setCurrentPage('home'); setProfileDropdownOpen(false); showToast('Logged out successfully.', 'success'); }} className="w-full rounded-lg px-4 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button onClick={() => { setAuthMode('login'); setCurrentPage('login'); }} className="rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">
                    Login
                  </button>
                  <button onClick={() => { setAuthMode('signup'); setCurrentPage('login'); }} className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1F2937]">
                    Sign Up
                  </button>
                </>
              )}
            </div>
            <button onClick={() => setIsDarkMode((prev) => !prev)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111827] transition hover:border-[#D1D5DB]">
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            {isAdmin && (
              <button onClick={() => setCurrentPage('admin')} className="hidden rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB] md:inline-flex">
                Dashboard
              </button>
            )}
            <button onClick={() => setCurrentPage('cart')} className="relative rounded-3xl border border-[#E5E7EB] bg-white p-3 text-[#111827] shadow-sm transition hover:border-[#D1D5DB]">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#111827] px-1.5 text-[10px] text-white">{cartCount}</span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#111827] shadow-sm transition hover:border-[#D1D5DB] md:hidden">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#E5E7EB] bg-white/95 px-6 py-5 shadow-lg md:hidden">
            <div className="flex flex-col gap-3 text-sm uppercase tracking-[0.35em] text-[#4B5563]">
              <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="text-left font-semibold text-[#111827]">Home</button>
              <button onClick={() => { setCurrentPage('products'); setMobileMenuOpen(false); }} className="text-left font-semibold text-[#111827]">Shop</button>
              <button onClick={() => { setCurrentPage('cart'); setMobileMenuOpen(false); }} className="text-left font-semibold text-[#111827]">Cart</button>
              {user ? (
                <>
                  <button onClick={() => { setCurrentPage('profile'); setMobileMenuOpen(false); }} className="text-left font-semibold text-[#111827]">Profile</button>
                  {isAdmin && <button onClick={() => { setCurrentPage('admin'); setMobileMenuOpen(false); }} className="text-left font-semibold text-[#111827]">Admin</button>}
                  <button onClick={() => { setUser(null); setToken(''); setCurrentPage('home'); setMobileMenuOpen(false); showToast('Logged out successfully.', 'success'); }} className="text-left font-semibold text-[#111827]">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setAuthMode('login'); setCurrentPage('login'); setMobileMenuOpen(false); }} className="text-left font-semibold text-[#111827]">Login</button>
                  <button onClick={() => { setAuthMode('signup'); setCurrentPage('login'); setMobileMenuOpen(false); }} className="text-left font-semibold text-[#111827]">Sign Up</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {toast.visible && (
          <div className="fixed bottom-6 right-6 z-50 w-[calc(100%-2rem)] max-w-sm rounded-[2rem] border border-[#E5E7EB] bg-white p-4 text-sm shadow-xl md:w-auto">
            <div className="flex items-start gap-3">
              <div className={`mt-1 h-3.5 w-3.5 rounded-full ${toast.variant === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <p className="text-[#111827]">{toast.message}</p>
            </div>
          </div>
        )}

        {settingsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Account settings</p>
                  <h2 className="mt-2 text-3xl font-black text-[#111827]">Update settings</h2>
                </div>
                <button onClick={() => setSettingsModalOpen(false)} className="text-[#6B7280] transition hover:text-[#111827]">
                  <X size={24} />
                </button>
              </div>
              <form className="space-y-5" onSubmit={handleSettingsSubmit}>
                <label className="block text-sm text-[#4B5563]">Phone number
                  <input value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} type="tel" placeholder="+1 (555) 000-0000" className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#111827]" />
                </label>
                <label className="block text-sm text-[#4B5563]">Current password
                  <input value={settingsForm.currentPassword} onChange={(e) => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })} type="password" placeholder="Leave blank if no change" className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#111827]" />
                </label>
                <label className="block text-sm text-[#4B5563]">New password
                  <input value={settingsForm.newPassword} onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })} type="password" placeholder="Min 6 characters" className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#111827]" />
                </label>
                <div className="grid gap-3 sm:grid-cols-2 pt-4">
                  <button type="button" onClick={() => { setSettingsModalOpen(false); setSettingsForm({ currentPassword: '', newPassword: '', phone: '' }); }} className="rounded-full border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">Cancel</button>
                  <button type="submit" className="rounded-full bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1F2937]">Save settings</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentPage === 'home' && (
          <>
            <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-200 shadow-sm">
                  <Sparkles size={16} /> Curated premium collection
                </div>
                <h1 className="mt-8 max-w-2xl text-5xl font-black tracking-tight leading-[1.05]">Timeless luxury for your everyday wardrobe.</h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">Discover a premium edit of modern essentials made for effortless styling, elevated comfort, and polished versatility.</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button onClick={() => setCurrentPage('products')} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                    Shop collection <ArrowRight size={16} />
                  </button>
                  <button onClick={() => setCurrentPage(user ? 'profile' : 'login')} className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Your account</button>
                </div>
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.75rem] bg-white/5 p-5 backdrop-blur-sm">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">New</p>
                    <p className="mt-3 text-2xl font-black">60+</p>
                    <p className="mt-2 text-sm text-slate-400">Premium items selected</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-white/5 p-5 backdrop-blur-sm">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Trusted</p>
                    <p className="mt-3 text-2xl font-black">4.9/5</p>
                    <p className="mt-2 text-sm text-slate-400">Average customer rating</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-white/5 p-5 backdrop-blur-sm">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Fast</p>
                    <p className="mt-3 text-2xl font-black">Free shipping</p>
                    <p className="mt-2 text-sm text-slate-400">On orders over $150</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Featured edit</p>
                  <h2 className="mt-4 text-3xl font-black text-[#111827]">Best sellers this week</h2>
                  <p className="mt-3 text-sm leading-7 text-[#6B7280]">Hand-picked favorites from our curated edit.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {sampleProducts.slice(0, 4).map((product) => (
                    <div key={product.id} className="group overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-[0_24px_60px_rgba(15,23,42,0.15)] transition hover:-translate-y-1">
                      <img src={product.image} alt={product.name} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                      <div className="p-6">
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{product.category}</p>
                        <h3 className="mt-4 text-xl font-semibold">{product.name}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{product.description}</p>
                        <div className="mt-6 flex items-center justify-between">
                          <span className="text-lg font-black">{formatCurrency(product.price)}</span>
                          <button onClick={() => addToCart(product)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">Add to bag</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-14 space-y-8">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Trending categories</p>
                  <h2 className="mt-4 text-3xl font-black text-[#111827]">Explore the most wanted edits.</h2>
                  <p className="mt-3 text-sm leading-7 text-[#6B7280]">Minimal silhouettes and luxe materials, designed to elevate your wardrobe.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {categories.slice(1).map((category) => (
                    <div key={category} className="rounded-[2rem] bg-slate-950/5 p-6 transition hover:bg-slate-950/10">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#6B7280]">Category</p>
                      <h3 className="mt-4 text-xl font-semibold text-[#111827]">{category}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#6B7280]">Handpicked pieces with premium finishes in every silhouette.</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">AI recommendations</p>
                    <h2 className="mt-4 text-3xl font-black">Products tailored for you.</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Discover intelligent picks based on your style, recently viewed products, and curated trends.</p>
                  </div>
                  <button onClick={() => setCurrentPage('products')} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">View recommendations <ArrowRight size={16} /></button>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {sampleProducts.slice(1, 5).map((product) => (
                    <div key={product.id} className="rounded-[1.75rem] bg-white/10 p-5 backdrop-blur-sm transition hover:scale-[1.01]">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{product.category}</p>
                      <h3 className="mt-4 text-xl font-semibold">{product.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{product.description}</p>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="font-black">{formatCurrency(product.price)}</span>
                        <button onClick={() => addToCart(product)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Add</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Customer reviews</p>
                <h2 className="mt-4 text-3xl font-black text-[#111827]">What customers are saying</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="rounded-[1.75rem] border border-[#E5E7EB] p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-[#111827]">{testimonial.name}</p>
                          <p className="text-sm text-[#6B7280]">{testimonial.role}</p>
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-3 py-2 text-sm font-semibold text-[#15803D]">
                          <Star size={14} /> {testimonial.rating}.0
                        </div>
                      </div>
                      <p className="mt-5 text-sm leading-7 text-[#6B7280]">�{testimonial.quote}�</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] bg-[#111827] p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Stay connected</p>
                <h2 className="mt-4 text-3xl font-black">Join the Lumina newsletter</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">Get exclusive early access to new drops, styling tips, and member-only offers.</p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <input className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-slate-300 focus:border-white" placeholder="Enter your email" type="email" />
                  <button className="rounded-full bg-white px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">Subscribe</button>
                </div>
              </div>
            </section>

            <section className="mt-14 rounded-[2rem] bg-white p-8 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-[1.75rem] bg-[#F9FAFB] p-6 text-center">
                    <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">{item.label}</p>
                    <p className="mt-4 text-3xl font-black text-[#111827]">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {recentProducts.length > 0 && (
              <section className="mt-14 rounded-[2rem] bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Recently viewed</p>
                    <h2 className="mt-3 text-3xl font-black text-[#111827]">Back to your browsing</h2>
                  </div>
                  <button onClick={() => setCurrentPage('products')} className="rounded-full border border-[#E5E7EB] px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">Shop more</button>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {recentProducts.map((product) => (
                    <div key={product.id} className="rounded-[1.75rem] border border-[#E5E7EB] p-5">
                      <img src={product.image} alt={product.name} className="h-48 w-full rounded-[1.5rem] object-cover" />
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-[#111827]">{product.name}</h3>
                        <p className="mt-2 text-sm text-[#6B7280]">{product.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {currentPage === 'products' && (
          <section className="space-y-8">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Shop the edit</p>
                  <h2 className="mt-3 text-3xl font-black text-[#111827]">Find your perfect pieces.</h2>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative w-full sm:w-[320px]">
                    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="w-full rounded-full border border-[#E5E7EB] bg-[#F9FAFB] py-3 pl-12 pr-4 text-sm text-[#111827] outline-none transition focus:border-[#111827]" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <button key={category} onClick={() => setSelectedCategory(category)} className={`rounded-full px-4 py-3 text-sm font-semibold transition ${selectedCategory === category ? 'bg-[#111827] text-white' : 'border border-[#E5E7EB] bg-white text-[#4B5563]'}`}>
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-3 rounded-full bg-[#F9FAFB] px-4 py-3 text-sm text-[#6B7280] shadow-sm">
                  <SlidersHorizontal size={18} /> Filter and sort options
                </div>
                <div className="flex flex-wrap gap-3">
                  {sortOptions.map((option) => (
                    <button key={option} onClick={() => setSelectedSort(option)} className={`rounded-full px-4 py-3 text-sm font-semibold transition ${selectedSort === option ? 'bg-[#111827] text-white' : 'border border-[#E5E7EB] bg-white text-[#4B5563]'}`}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {isLoadingProducts ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse rounded-[2rem] bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
                    <div className="h-72 w-full rounded-[1.75rem] bg-[#F3F4F6]" />
                    <div className="mt-6 h-4 w-3/4 rounded-full bg-[#F3F4F6]" />
                    <div className="mt-3 h-3 w-1/2 rounded-full bg-[#F3F4F6]" />
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div className="h-10 w-24 rounded-full bg-[#F3F4F6]" />
                      <div className="h-10 w-24 rounded-full bg-[#F3F4F6]" />
                    </div>
                  </div>
                ))
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full rounded-[2rem] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-12 text-center text-[#6B7280]">
                  No matching products. Try a different search or category.
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <article key={product.id} className="overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
                    <div className="relative overflow-hidden bg-slate-100">
                      <img src={product.image} alt={product.name} loading="lazy" className="h-80 w-full object-cover transition duration-500 hover:scale-105" />
                      <button onClick={() => toggleWishlist(product)} className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-sm transition hover:bg-white">
                        <Heart size={18} className={wishlist.includes(product.id) ? 'text-red-500' : ''} />
                      </button>
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-[#6B7280]">
                        <span>{product.category}</span>
                        <span className="inline-flex items-center gap-1 text-[#F59E0B]"><Star size={14} /> 4.9</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-2xl font-semibold text-[#111827]">{product.name}</h3>
                          <button onClick={() => addToCart(product)} className="rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1F2937]">Add</button>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[#6B7280]">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-black text-[#111827]">{formatCurrency(product.price)}</p>
                        <button onClick={() => recordView(product.id)} className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-[#4B5563] transition hover:bg-[#F3F4F6]">Quick preview</button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )}

        {currentPage === 'cart' && (
          <section className="grid gap-8 xl:grid-cols-[1.5fr_0.8fr]">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Shopping cart</p>
                  <h2 className="mt-3 text-3xl font-black text-[#111827]">Ready to checkout</h2>
                </div>
                <div className="rounded-full bg-[#F3F4F6] px-5 py-3 text-sm font-semibold text-[#111827]">{cartCount} items</div>
              </div>
              <div className="mt-8 rounded-[2rem] bg-[#F9FAFB] p-6">
                <div className="flex items-center justify-between gap-4 text-sm text-[#6B7280]">
                  <span>Cart</span>
                  <span>Order summary</span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {['Cart', 'Address', 'Payment'].map((stage, index) => (
                    <div key={stage} className={`rounded-full border px-5 py-3 text-center text-sm font-semibold ${index === 0 ? 'border-[#111827] bg-white text-[#111827]' : 'border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280]'}`}>
                      {stage}
                    </div>
                  ))}
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="mt-8 rounded-[2rem] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-12 text-center text-[#6B7280]">
                  Your cart is empty. Add something beautiful to your collection.
                </div>
              ) : (
                <div className="mt-8 space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="grid gap-4 rounded-[2rem] border border-[#E5E7EB] p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
                      <img src={item.image} alt={item.name} className="h-28 w-28 rounded-3xl object-cover" />
                      <div>
                        <h3 className="text-xl font-semibold text-[#111827]">{item.name}</h3>
                        <p className="mt-2 text-sm text-[#6B7280]">{item.category}</p>
                        <p className="mt-3 text-lg font-bold text-[#111827]">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-3 rounded-full bg-[#F3F4F6] p-3">
                        <button onClick={() => updateQty(item.id, -1)} className="rounded-full bg-white p-2 shadow-sm"><Minus size={14} /></button>
                        <span className="font-semibold text-[#111827]">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="rounded-full bg-white p-2 shadow-sm"><Plus size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside className="rounded-[2rem] bg-white p-8 shadow-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Order summary</p>
                  <h3 className="mt-3 text-3xl font-black text-[#111827]">Almost there</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6B7280]">Review your order and apply discounts before checkout.</p>
                </div>
                <div className="rounded-[1.75rem] bg-[#F3F4F6] p-6">
                  <div className="flex items-center justify-between text-sm text-[#6B7280]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-[#6B7280]">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-lg font-black text-[#111827]">
                    <span>Total</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#111827]">Coupon code</label>
                  <div className="flex gap-3">
                    <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter code" className="w-full rounded-full border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none" />
                    <button onClick={handleCouponApply} className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1F2937]">Apply</button>
                  </div>
                  {couponMessage && <p className="text-sm text-[#6B7280]">{couponMessage}</p>}
                </div>
                <button className="w-full rounded-full bg-[#111827] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#1F2937]">Proceed to checkout</button>
              </div>
            </aside>
          </section>
        )}

        {(currentPage === 'login' || currentPage === 'signup') && (
          <section className="flex justify-center py-10">
            <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
              <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
                <div className="hidden rounded-[2rem] bg-slate-950 p-10 text-white md:block">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">Welcome to Lumina</div>
                  <h2 className="mt-10 text-4xl font-black leading-tight">A seamless account experience.</h2>
                  <p className="mt-6 text-sm leading-7 text-slate-300">Save favorites, manage orders, and access premium features with a modern login flow.</p>
                  <div className="mt-10 space-y-4 text-sm text-slate-300">
                    <p className="inline-flex items-center gap-2"><CheckCircle2 size={16} /> Fast sign in and signup</p>
                    <p className="inline-flex items-center gap-2"><ShieldCheck size={16} /> Secure authentication</p>
                    <p className="inline-flex items-center gap-2"><Sparkles size={16} /> Smooth transitions and styling</p>
                  </div>
                </div>
                <div className="p-10">
                  <div className="mb-8 space-y-3 text-center">
                    <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Welcome back</p>
                    <h2 className="text-4xl font-black text-[#111827]">{authMode === 'login' ? 'Sign in' : 'Create account'}</h2>
                    <p className="text-sm leading-7 text-[#6B7280]">Access your dashboard, save your favorites, and manage profile settings.</p>
                  </div>
                  <form className="space-y-5" onSubmit={handleAuthSubmit}>
                    {authMode === 'signup' && (
                      <label className="block text-sm text-[#4B5563]">Name
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#111827]" required />
                      </label>
                    )}
                    <label className="block text-sm text-[#4B5563]">Email
                      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#111827]" required />
                    </label>
                    <label className="block text-sm text-[#4B5563]">Password
                      <div className="relative mt-2">
                        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type={showPassword ? 'text' : 'password'} className="w-full rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 pr-12 text-sm text-[#111827] outline-none focus:border-[#111827]" required />
                        <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <button type="submit" className="rounded-full bg-[#111827] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1F2937]">{authMode === 'login' ? 'Login' : 'Create account'}</button>
                      <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setMessage(''); }} className="rounded-full border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">{authMode === 'login' ? 'Sign up instead' : 'Log in instead'}</button>
                    </div>
                  </form>
                  <div className="mt-8 space-y-3 text-center">
                    <p className="text-sm text-[#6B7280]">Or continue with</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]" disabled><span className="h-4 w-4 rounded-full bg-red-500" /> Google</button>
                      <button className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]" disabled><span className="h-4 w-4 rounded-full bg-blue-600" /> Facebook</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'admin' && (
          !isAdmin ? (
            <section className="mt-12 rounded-[2rem] border border-dashed border-red-300 bg-red-50 p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-200 text-red-600 text-2xl font-bold">⚠</div>
              <h2 className="mt-6 text-3xl font-black text-red-900">Access Denied</h2>
              <p className="mt-3 text-sm leading-7 text-red-700">Only administrators can access this dashboard. If you should have access, please contact support.</p>
              <button onClick={() => setCurrentPage('home')} className="mt-6 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700">Return to home</button>
            </section>
          ) : (
            <section className="space-y-8">
              <div className="grid gap-8 xl:grid-cols-[0.28fr_1fr]">
                <aside className="space-y-8 rounded-[2rem] bg-white p-8 shadow-sm">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Admin panel</p>
                    <h2 className="mt-3 text-3xl font-black text-[#111827]">Dashboard</h2>
                    <p className="mt-3 text-sm leading-7 text-[#6B7280]">Monitor analytics, manage product inventory, and review performance from one place.</p>
                  </div>
                  <div className="space-y-4">
                    <button onClick={() => setCurrentPage('admin')} className="w-full rounded-full bg-[#111827] px-5 py-4 text-left text-sm font-semibold text-white transition hover:bg-[#1F2937]">Overview</button>
                    <button onClick={() => setCurrentPage('admin')} className="w-full rounded-full border border-[#E5E7EB] bg-white px-5 py-4 text-left text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">Products</button>
                    <button onClick={() => setCurrentPage('admin')} className="w-full rounded-full border border-[#E5E7EB] bg-white px-5 py-4 text-left text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">Orders</button>
                    <button onClick={() => setCurrentPage('admin')} className="w-full rounded-full border border-[#E5E7EB] bg-white px-5 py-4 text-left text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">Customers</button>
                  </div>
                </aside>
                <div className="space-y-8">
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {adminMetrics.map((metric) => (
                      <div key={metric.title} className="rounded-[1.75rem] bg-white p-6 shadow-sm">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#F9FAFB] text-[#111827]">
                          <metric.icon size={20} />
                        </div>
                        <p className="mt-5 text-sm uppercase tracking-[0.35em] text-[#6B7280]">{metric.title}</p>
                        <div className="mt-4 flex items-end justify-between gap-3">
                          <p className="text-3xl font-black text-[#111827]">{metric.value}</p>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{metric.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Product management</p>
                        <h2 className="mt-3 text-3xl font-black text-[#111827]">Catalog inventory</h2>
                      </div>
                      <button className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1F2937]">Add product</button>
                    </div>
                    <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-[#E5E7EB]">
                      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                        <thead className="bg-[#F9FAFB]">
                          <tr>
                            <th className="px-6 py-4 font-semibold text-[#6B7280]">Product</th>
                            <th className="px-6 py-4 font-semibold text-[#6B7280]">Category</th>
                            <th className="px-6 py-4 font-semibold text-[#6B7280]">Price</th>
                            <th className="px-6 py-4 font-semibold text-[#6B7280]">Stock</th>
                            <th className="px-6 py-4 font-semibold text-[#6B7280]">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sampleProducts.map((product) => (
                            <tr key={product.id} className="border-t border-[#E5E7EB] hover:bg-[#F3F4F6]">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img src={product.image} alt={product.name} className="h-14 w-14 rounded-3xl object-cover" />
                                  <div>
                                    <p className="font-semibold text-[#111827]">{product.name}</p>
                                    <p className="text-xs uppercase tracking-[0.35em] text-[#6B7280]">ID {product.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-[#4B5563]">{product.category}</td>
                              <td className="px-6 py-4 font-semibold text-[#111827]">{formatCurrency(product.price)}</td>
                              <td className="px-6 py-4 text-[#4B5563]">{Math.floor(5 + Number(product.id) * 3)} in stock</td>
                              <td className="px-6 py-4">
                                <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">Edit</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        )}

        {currentPage === 'profile' && (
          <section className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#111827]/5 text-[#111827] text-2xl font-bold">{profile?.name?.[0] || 'U'}</div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Account</p>
                    <h2 className="mt-2 text-3xl font-black text-[#111827]">{profile?.name || 'Your profile'}</h2>
                    <p className="mt-2 text-sm text-[#6B7280]">Manage your account and secure access to Lumina.</p>
                  </div>
                </div>
                <div className="mt-8 space-y-6">
                  <div className="rounded-[1.75rem] bg-[#F9FAFB] p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#6B7280]">Email</p>
                    <p className="mt-2 text-sm text-[#111827]">{profile?.email}</p>
                  </div>
                  {profile?.phone && (
                    <div className="rounded-[1.75rem] bg-[#F9FAFB] p-6">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#6B7280]">Phone</p>
                      <p className="mt-2 text-sm text-[#111827]">{profile?.phone}</p>
                    </div>
                  )}
                  <div className="rounded-[1.75rem] bg-[#F9FAFB] p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#6B7280]">Avatar</p>
                    {uploadedImageUrl || profile?.avatar ? (
                      <img src={uploadedImageUrl || profile.avatar} alt="Avatar" className="mt-4 h-40 w-full rounded-[1.5rem] object-cover" />
                    ) : (
                      <p className="mt-4 text-sm text-[#6B7280]">Upload an image to personalize your profile.</p>
                    )}
                  </div>
                  <button onClick={handleLoadUsers} className="w-full rounded-full bg-[#111827] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#1F2937]">Load protected users</button>
                  {isAdmin && (
                    <button onClick={() => setCurrentPage('admin')} className="mt-4 w-full rounded-full border border-[#E5E7EB] bg-white px-5 py-4 text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">Open Admin Dashboard</button>
                  )}
                  {users.length > 0 && <p className="text-sm text-[#6B7280]">{users.length} users loaded from the backend.</p>}
                </div>
              </div>

              <form className="rounded-[2rem] bg-white p-8 shadow-sm space-y-6" onSubmit={handleProfileUpdate}>
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.35em] text-[#6B7280]">Profile settings</p>
                  <h3 className="text-2xl font-black text-[#111827]">Update your account</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-[#4B5563]">Name
                    <input value={profile?.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#111827]" required />
                  </label>
                  <label className="block text-sm text-[#4B5563]">Email
                    <input value={profile?.email || ''} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#111827]" required />
                  </label>
                </div>
                <label className="block text-sm text-[#4B5563]">Phone number
                  <input value={profile?.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} type="tel" placeholder="+1 (555) 000-0000" className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#111827]" />
                </label>
                <label className="block text-sm text-[#4B5563]">Upload avatar
                  <input type="file" accept="image/*" onChange={handleUploadChange} className="mt-2 w-full text-sm text-[#111827]" />
                </label>
                {uploadPreview && <img src={uploadPreview} alt="Preview" className="h-52 w-full rounded-[1.5rem] object-cover" />}
                <div className="grid gap-4 sm:grid-cols-2">
                  <button type="button" onClick={handleUploadSubmit} className="rounded-full bg-[#111827] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#1F2937]">Upload image</button>
                  <button type="submit" className="rounded-full border border-[#E5E7EB] bg-white px-5 py-4 text-sm font-semibold text-[#111827] transition hover:bg-[#F9FAFB]">Save profile</button>
                </div>
                <button type="button" onClick={handleDeleteAccount} className="w-full rounded-full bg-red-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-red-700">Delete account</button>
                {message && <p className="text-sm text-[#DC2626]">{message}</p>}
                {uploadedImageUrl && <p className="text-sm text-[#15803D]">Uploaded avatar URL: <a href={uploadedImageUrl} target="_blank" rel="noreferrer" className="underline">View image</a></p>}
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2" />
      <path d="M12 21v2" />
      <path d="M4.22 4.22l1.42 1.42" />
      <path d="M18.36 18.36l1.42 1.42" />
      <path d="M1 12h2" />
      <path d="M21 12h2" />
      <path d="M4.22 19.78l1.42-1.42" />
      <path d="M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 0012 21a9 9 0 009-8.21z" />
    </svg>
  );
}

export default App;
