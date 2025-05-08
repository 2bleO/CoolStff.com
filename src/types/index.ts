export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
  favorites: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  affiliateLinks: AffiliateLink[];
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  categoryId: string;
  featured: boolean;
  source: string;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export interface AffiliateLink {
  id: string;
  store: 'amazon' | 'aliexpress' | 'other';
  url: string;
  price: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  contentId: string;
  contentType: 'product' | 'article';
  text: string;
  createdAt: string;
}

export interface Rating {
  userId: string;
  productId: string;
  value: number;
  createdAt: string;
}

export interface ScrapedContent {
  type: 'product' | 'article';
  title: string;
  description?: string;
  content?: string;
  images?: string[];
  price?: number;
  source?: string;
  sourceUrl: string;
}

export interface SocialMediaPost {
  platform: 'facebook' | 'twitter' | 'instagram' | 'pinterest';
  contentId: string;
  contentType: 'product' | 'article';
  caption: string;
  imageUrl: string;
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'published';
}