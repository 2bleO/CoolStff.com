import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { currentUser, userData } = useAuth();
  const [isFavorite, setIsFavorite] = useState(
    userData?.favorites?.includes(product.id) || false
  );
  const [isHovered, setIsHovered] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      // Redirect to sign in or show a notification
      alert('Please sign in to save items to your favorites');
      return;
    }
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: arrayRemove(product.id)
        });
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(product.id)
        });
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pt-[75%] bg-gray-100 overflow-hidden">
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.title}
          className={`absolute top-0 left-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
            isHovered && product.images.length > 1 ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Second Image (shown on hover if available) */}
        {product.images.length > 1 && (
          <img
            src={product.images[1]}
            alt={`${product.title} - alternate view`}
            className={`absolute top-0 left-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md z-10 transition-transform duration-300 hover:scale-110"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
        
        {/* Price Tag */}
        <div className="absolute bottom-3 left-3 bg-blue-800 text-white py-1 px-3 rounded-full text-sm font-medium">
          ${product.price.toFixed(2)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 group-hover:text-blue-800 transition-colors">
          {product.title}
        </h3>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    stroke={i < Math.floor(product.rating) ? 'none' : 'currentColor'}
                    strokeWidth="1.5"
                  />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
          </div>
          
          <button className="inline-flex items-center text-sm text-blue-800 font-medium hover:text-blue-700">
            <ShoppingBag className="h-4 w-4 mr-1" />
            View Deals
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;