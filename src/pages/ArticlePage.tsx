import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Calendar, User, MessageSquare, Share2, ExternalLink } from 'lucide-react';
import { db } from '../firebase/config';
import { Article, Comment, Category } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, userData } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  useEffect(() => {
    const fetchArticleData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch article
        const articleDoc = await getDoc(doc(db, 'articles', id));
        
        if (!articleDoc.exists()) {
          setError('Article not found');
          setLoading(false);
          return;
        }
        
        const articleData = { id: articleDoc.id, ...articleDoc.data() } as Article;
        setArticle(articleData);
        
        // Fetch category
        if (articleData.categoryId) {
          const categoryDoc = await getDoc(doc(db, 'categories', articleData.categoryId));
          if (categoryDoc.exists()) {
            setCategory({ id: categoryDoc.id, ...categoryDoc.data() } as Category);
          }
        }
        
        // Fetch comments
        const commentsQuery = query(
          collection(db, 'comments'),
          where('contentId', '==', id),
          where('contentType', '==', 'article')
        );
        
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Comment));
        
        setComments(commentsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article data:', err);
        setError('Failed to load article data');
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !newComment.trim() || !id) return;
    
    try {
      setSubmittingComment(true);
      
      const commentData: Omit<Comment, 'id'> = {
        userId: currentUser.uid,
        userName: userData?.name || 'User',
        contentId: id,
        contentType: 'article',
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error || 'Article not found'}</p>
          <Link to="/" className="text-purple-700 hover:text-purple-600">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Format date: "January 1, 2025"
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="pt-16 min-h-screen">
      {/* Featured Image */}
      <div className="relative h-[50vh] bg-gray-900">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 text-white p-8 max-w-4xl mx-auto">
          {category && (
            <Link
              to={`/category/${category.slug}`}
              className="inline-block px-3 py-1 bg-purple-700 rounded-full text-sm font-medium mb-4"
            >
              {category.name}
            </Link>
          )}
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex items-center text-gray-300 text-sm">
            <div className="flex items-center mr-6">
              <Calendar className="h-4 w-4 mr-1" />
              {formattedDate}
            </div>
            
            {article.source && (
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-1" />
                <span>Source: </span>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline hover:text-white"
                >
                  {article.source}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg prose-blue max-w-none">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {/* Share & Source */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <button className="flex items-center text-gray-600 hover:text-blue-800">
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </button>
            
            <div className="text-gray-500">|</div>
            
            <span className="flex items-center text-gray-600">
              <MessageSquare className="h-5 w-5 mr-2" />
              {comments.length} Comments
            </span>
          </div>
          
          {article.source && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 hover:text-purple-600 flex items-center"
            >
              View Original Source
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          )}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-6 rounded-md font-medium transition-colors disabled:bg-purple-300"
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
                className="inline-block bg-purple-700 hover:bg-purple-600 text-white py-2 px-6 rounded-md font-medium transition-colors"
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

export default ArticlePage;