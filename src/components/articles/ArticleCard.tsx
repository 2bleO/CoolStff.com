import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ExternalLink } from 'lucide-react';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  // Format date: "Jan 1, 2025"
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link 
      to={`/article/${article.id}`}
      className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
    >
      <div className="relative pt-[56.25%] bg-gray-100 overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="absolute top-0 left-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        {article.source && (
          <div className="absolute top-3 left-3 bg-white/90 text-gray-700 py-1 px-3 rounded-full text-xs font-medium flex items-center">
            <ExternalLink className="h-3 w-3 mr-1" />
            {article.source}
          </div>
        )}
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Calendar className="h-3 w-3 mr-1" />
          {formattedDate}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-800 transition-colors mb-3 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
          {article.excerpt}
        </p>
        
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-blue-800 font-medium group-hover:text-blue-700 transition-colors">
            Read Article
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;