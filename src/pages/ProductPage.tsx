import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { ExternalLink, Star, MessageSquare, Share2, Heart } from 'lucide-react';
import { db } from '../firebase/config';
import { Product, Comment, Category } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, userData } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch product
        const productDoc = await getDoc(doc(db, 'products', id));
        
        if (!productDoc.exists()) {
          setError('Product not found');
          setLoading(false);
          return;
        }
        
        const productData = { id: productDoc.id, ...productDoc.data() } as Product;
        setProduct(productData);
        setSelectedImage(productData.images[0]);
        
        // Fetch category
        if (productData.categoryId) {
          const categoryDoc = await getDoc(doc(db, 'categories', productData.categoryId));
          if (categoryDoc.exists()) {
            setCategory({ id: categoryDoc.id, ...categoryDoc.data() } as Category);
          }
        }
        
        // Fetch comments
        const commentsQuery = query(
          collection(db, 'comments'),
          where('contentId', '==', id),
          where('contentType', '==', 'product')
        );
        
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Comment));
        
        setComments(commentsData);
        
        // Check if product is in user's favorites
        if (userData) {
          setIsFavorite(userData.favorites.includes(id));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('Failed to load product data');
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, userData]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !newComment.trim() || !id) return;
    
    try {
      setSubmittingComment(true);
      
      const commentData: Omit<Comment, 'id'> = {
        userId: currentUser.uid,
        userName: userData?.name || 'User',
        contentId: id,
        contentType: 'product',
        text: newComment.trim(),
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'comments'), commentData);
      
      const newCommentWithId: Comment = {
        id: docRef.id,
        ...commentData
      };
      
      setComments(prev => [newCommentWithId, ...prev]);
      setNewComment('');
      setSubmittingComment(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error || 'Product not found'}</p>
          <Link to="/" className="text-blue-800 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-800">Home</Link>
            <span className="mx-2">/</span>
            {category && (
              <>
                <Link to={`/category/${category.slug}`} className="hover:text-blue-800">
                  {category.name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-6">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-[500px] object-contain"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      selectedImage === image ? 'border-blue-800' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400 mr-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5"
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
            
            <div className="text-3xl font-bold text-blue-800 mb-8">${product.price.toFixed(2)}</div>
            
            <div className="prose prose-blue max-w-none mb-8">
              <p>{product.description}</p>
            </div>
            
            {/* Affiliate Links */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-medium text-gray-900">Where to Buy</h3>
              
              {product.affiliateLinks.length > 0 ? (
                <div className="space-y-3">
                  {product.affiliateLinks.map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-800 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900 capitalize">{link.store}</span>
                        <span className="ml-6 text-blue-800 font-semibold">${link.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center text-blue-800">
                        <span className="mr-1 hidden sm:inline">Visit Store</span>
                        <ExternalLink className="h-4 w-4" />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No affiliate links available</p>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={product.affiliateLinks[0]?.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-800 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium text-center transition-colors"
              >
                Buy Now
              </a>
              
              <button
                className={`flex items-center justify-center py-3 px-6 rounded-md font-medium border ${
                  isFavorite
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                } transition-colors`}
              >
                <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-red-500' : ''}`} />
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </button>
              
              <button
                className="sm:w-auto w-full flex items-center justify-center py-3 px-6 bg-white text-gray-700 border border-gray-300 rounded-md font-medium hover:border-gray-400 transition-colors"
              >
                <Share2 className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Comments ({comments.length})</h2>
          
          {/* Add comment form */}
          {currentUser ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  rows={3}
                  placeholder="Add your comment..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="bg-blue-800 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors disabled:bg-blue-300"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center mb-8">
              <p className="text-gray-600 mb-4">Please sign in to leave a comment</p>
              <Link
                to="/sign-in"
                className="inline-block bg-blue-800 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
          
          {/* Comments list */}
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between mb-4">
                    <div className="font-medium text-gray-900">{comment.userName}</div>
                    <div className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;