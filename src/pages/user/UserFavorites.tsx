import React from 'react';

const UserFavorites = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Favorites</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for when no favorites exist */}
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">You haven't added any favorites yet.</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Browse Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFavorites;