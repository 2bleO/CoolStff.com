import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product, Article, Category } from '../types';

interface ProductsContextType {
  products: Product[];
  articles: Article[];
  categories: Category[];
  featuredProducts: Product[];
  featuredArticles: Article[];
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Category));
        setCategories(categoriesData);
        
        // Fetch products
        const productsSnapshot = await getDocs(
          query(collection(db, 'products'), orderBy('createdAt', 'desc'))
        );
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setProducts(productsData);
        
        // Fetch featured products
        const featuredProductsSnapshot = await getDocs(
          query(
            collection(db, 'products'),
            where('featured', '==', true),
            orderBy('createdAt', 'desc'),
            limit(6)
          )
        );
        const featuredProductsData = featuredProductsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setFeaturedProducts(featuredProductsData);
        
        // Fetch articles
        const articlesSnapshot = await getDocs(
          query(collection(db, 'articles'), orderBy('createdAt', 'desc'))
        );
        const articlesData = articlesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Article));
        setArticles(articlesData);
        
        // Fetch featured articles
        const featuredArticlesSnapshot = await getDocs(
          query(
            collection(db, 'articles'),
            where('featured', '==', true),
            orderBy('createdAt', 'desc'),
            limit(3)
          )
        );
        const featuredArticlesData = featuredArticlesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Article));
        setFeaturedArticles(featuredArticlesData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const value = {
    products,
    articles,
    categories,
    featuredProducts,
    featuredArticles,
    loading,
    error
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};