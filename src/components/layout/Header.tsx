import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, userData, isAdmin, logOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      // Navigate to home page handled by Auth listener
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-purple-700 bg-clip-text text-transparent">
              coolstff<span className="text-teal-500">.com</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/category/tech" className="text-gray-700 hover:text-blue-800 transition-colors font-medium">
              Tech
            </Link>
            <Link to="/category/home" className="text-gray-700 hover:text-blue-800 transition-colors font-medium">
              Home
            </Link>
            <Link to="/category/lifestyle" className="text-gray-700 hover:text-blue-800 transition-colors font-medium">
              Lifestyle
            </Link>
            <Link to="/category/conceptual" className="text-gray-700 hover:text-blue-800 transition-colors font-medium">
              Conceptual
            </Link>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
            
            {/* User Menu */}
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to="/favorites" className="text-gray-700 hover:text-blue-800">
                  <Heart className="h-6 w-6" />
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-blue-800">
                    <User className="h-6 w-6" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                    <div className="py-2">
                      <span className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        Hi, {userData?.name}
                      </span>
                      
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      
                      {isAdmin && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/sign-in" className="flex items-center text-blue-800 hover:text-blue-700">
                <User className="h-6 w-6 mr-1" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <form onSubmit={handleSearchSubmit} className="px-4 py-2">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
            
            <Link to="/category/tech" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
              Tech
            </Link>
            <Link to="/category/home" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
              Home
            </Link>
            <Link to="/category/lifestyle" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
              Lifestyle
            </Link>
            <Link to="/category/conceptual" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
              Conceptual
            </Link>
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              {currentUser ? (
                <>
                  <div className="px-4 py-2">
                    <p className="text-base font-medium text-gray-700">Hi, {userData?.name}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
                    Profile
                  </Link>
                  <Link to="/favorites" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
                    Favorites
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/sign-in" className="block px-4 py-2 text-base font-medium text-blue-800 hover:bg-gray-50">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;