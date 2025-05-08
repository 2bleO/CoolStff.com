import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/category/${category.slug}`}
      className="group relative rounded-lg overflow-hidden h-60 flex items-end"
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-gray-800">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-full object-cover object-center opacity-80 group-hover:opacity-70 transition-opacity duration-300 group-hover:scale-105 transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative p-6 w-full">
        <h3 className="text-2xl font-bold text-white mb-2">
          {category.name}
        </h3>
        <p className="text-gray-200 text-sm mb-4 line-clamp-2">
          {category.description}
        </p>
        <div className="flex items-center text-teal-400 font-medium group-hover:text-teal-300 transition-colors">
          <span>Explore Category</span>
          <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;