import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cartService } from './services';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  // Load cart count
  useEffect(() => {
    const loadCartCount = async () => {
      try {
        const cartItems = await cartService.getAll();
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch (error) {
        console.error('Failed to load cart count:', error);
      }
    };
    loadCartCount();
  }, [location]);

  // Handle header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navigation = [
    { name: 'Browse', href: '/browse', icon: 'Grid3X3' },
    { name: 'Genres', href: '/browse?filter=genres', icon: 'Tags' },
    { name: 'New Releases', href: '/browse?sort=newest', icon: 'Sparkles' }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden max-w-full">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`flex-shrink-0 z-40 transition-all duration-300 ${
          headerScrolled 
            ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
            : 'bg-white'
        } border-b border-gray-200`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
<NavLink to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
<ApperIcon name="BookOpen" size={20} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold text-secondary">
                HEAVEN MANAGA
              </span>
            </NavLink>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search manga, authors, series..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <ApperIcon 
                  name="Search" 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
              </div>
            </form>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <NavLink
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-primary transition-colors"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </NavLink>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
              >
                <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search manga..."
                    className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <ApperIcon 
                    name="Search" 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                </form>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'text-primary bg-primary/10'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                        }`
                      }
                    >
                      <ApperIcon name={item.icon} size={16} />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;