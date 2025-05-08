import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { SocialMediaPost } from '../../types';

interface SocialMediaPreviewProps {
  posts: Omit<SocialMediaPost, 'status' | 'scheduledFor'>[];
  onSchedule: (post: Omit<SocialMediaPost, 'status' | 'scheduledFor'>) => void;
}

const platformIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram
};

const platformColors = {
  facebook: 'bg-blue-600',
  twitter: 'bg-sky-500',
  instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
};

const SocialMediaPreview: React.FC<SocialMediaPreviewProps> = ({ posts, onSchedule }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Social Media Preview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => {
          const Icon = platformIcons[post.platform];
          const bgColor = platformColors[post.platform];
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Platform Header */}
              <div className={`${bgColor} p-3 flex items-center text-white`}>
                <Icon className="h-5 w-5 mr-2" />
                <span className="capitalize">{post.platform}</span>
              </div>
              
              {/* Image Preview */}
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={post.imageUrl}
                  alt="Social media preview"
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Caption Preview */}
              <div className="p-4">
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {post.caption}
                </p>
              </div>
              
              {/* Schedule Button */}
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => onSchedule(post)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  Schedule Post
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialMediaPreview;