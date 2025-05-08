import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, TrendingUp, Award } from 'lucide-react';
import { useProducts } from '../contexts/ProductsContext';
import ProductCard from '../components/products/ProductCard';
import ArticleCard from '../components/articles/ArticleCard';
import CategoryCard from '../components/categories/CategoryCard';

const HomePage = () => {
  const { 
    featuredProducts, 
    featuredArticles, 
    categories, 
    loading, 
    error 
  } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold">Oops! Something went wrong.</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-r from-blue-900 to-purple-900 flex items-center">
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center md:text-left md:max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Discover Tomorrow's <span className="text-teal-400">Innovations</span> Today
            </h1>
            <p className="mt-6 text-xl text-gray-200">
              Explore the most innovative products and conceptual designs from around the world.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <Link to="/category/tech" className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors shadow-lg">
                Explore Products
              </Link>
              <Link to="/category/conceptual" className="bg-transparent hover:bg-white/10 text-white border border-white px-8 py-3 rounded-md font-medium transition-colors">
                View Concepts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/category/all" className="text-blue-800 hover:text-blue-700 flex items-center">
              View All <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse Categories</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Concepts & Designs</h2>
            <Link to="/category/conceptual" className="text-blue-800 hover:text-blue-700 flex items-center">
              View All <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefit Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose coolstff.com</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-2">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-800 mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cutting-Edge Products</h3>
              <p className="text-gray-600">
                Discover the most innovative products from around the world, carefully curated for tech enthusiasts.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-2">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-800 mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Future Concepts</h3>
              <p className="text-gray-600">
                Explore conceptual designs and futuristic ideas that push the boundaries of what's possible.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform duration-300 hover:-translate-y-2">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-800 mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Best Deals</h3>
              <p className="text-gray-600">
                Find the best prices through our carefully selected affiliate partners with exclusive discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with the Latest Innovations</h2>
            <p className="text-xl text-blue-100 mb-8">
              Subscribe to our newsletter and never miss out on the newest products and designs.
            </p>
            <form className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-l-md focus:outline-none text-gray-900"
              />
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-r-md font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;