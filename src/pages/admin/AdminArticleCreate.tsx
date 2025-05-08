import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, PlusCircle, LinkIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../../firebase/config';
import { Article, Category } from '../../types';
import { scrapeArticleFromUrl } from '../../services/scraper';

type FormData = Omit<Article, 'id' | 'createdAt' | 'updatedAt'> & {
  urlToScrape?: string;
  coverImageFile?: FileList;
};

const AdminArticleCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      coverImage: '',
      categoryId: '',
      featured: false,
      source: '',
      sourceUrl: ''
    }
  });

  const watchTitle = watch('title');
  const watchUrlToScrape = watch('urlToScrape');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Category));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleScrapeUrl = async () => {
    if (!watchUrlToScrape) return;
    
    try {
      setIsScrapingUrl(true);
      const scrapedData = await scrapeArticleFromUrl(watchUrlToScrape);
      
      if (scrapedData) {
        setValue('title', scrapedData.title);
        setValue('content', scrapedData.content || '');
        setValue('excerpt', scrapedData.content?.substring(0, 150) + '...' || '');
        setValue('source', scrapedData.source || '');
        setValue('sourceUrl', scrapedData.sourceUrl);
        
        if (scrapedData.images && scrapedData.images.length > 0) {
          setCoverImagePreview(scrapedData.images[0]);
          setValue('coverImage', scrapedData.images[0]);
        }
      }
    } catch (error) {
      console.error('Error scraping URL:', error);
      alert('Failed to scrape the URL. Please try again or input the data manually.');
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      let coverImageUrl = data.coverImage;
      
      // Upload cover image if it's a file
      if (coverImageFile) {
        const storageRef = ref(storage, `articles/${uuidv4()}`);
        await uploadBytes(storageRef, coverImageFile);
        coverImageUrl = await getDownloadURL(storageRef);
      }
      
      // Create article object
      const newArticle: Omit<Article, 'id'> = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: coverImageUrl,
        categoryId: data.categoryId,
        featured: data.featured,
        source: data.source,
        sourceUrl: data.sourceUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'articles'), newArticle);
      
      setIsLoading(false);
      alert('Article created successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating article:', error);
      setIsLoading(false);
      alert('Failed to create article. Please try again.');
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center">
          <button 
            onClick={() => navigate('/admin')}
            className="text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Article</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* URL Scraping */}
              <div className="mb-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h2 className="text-lg font-semibold text-purple-800 mb-2">Scrape from URL</h2>
                <p className="text-sm text-purple-700 mb-4">
                  Paste an article URL from supported sites to automatically extract information.
                </p>
                
                <div className="flex">
                  <input
                    type="url"
                    placeholder="https://www.example.com/article"
                    {...register('urlToScrape')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleScrapeUrl}
                    disabled={isScrapingUrl || !watchUrlToScrape}
                    className="bg-purple-700 text-white px-4 py-2 rounded-r-md hover:bg-purple-600 transition-colors disabled:bg-purple-300"
                  >
                    {isScrapingUrl ? 'Scraping...' : 'Scrape'}
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Article Title*
                  </label>
                  <input
                    id="title"
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>
                
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image*
                  </label>
                  
                  {coverImagePreview ? (
                    <div className="mt-2 relative">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-full h-64 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImagePreview('');
                          setCoverImageFile(null);
                          setValue('coverImage', '');
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <label className="block w-full h-64 rounded-md border-2 border-dashed border-gray-300 p-12 text-center cursor-pointer hover:border-purple-700 transition-colors">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="sr-only"
                          accept="image/*"
                        />
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <span className="relative bg-white rounded-md font-medium text-purple-700 hover:text-purple-600 transition-colors">
                              Upload a file
                            </span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </label>
                      
                      {/* URL input alternative */}
                      <div className="mt-4">
                        <div className="relative">
                          <input
                            type="url"
                            {...register('coverImage')}
                            placeholder="Or paste an image URL..."
                            className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                          />
                          <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {errors.coverImage && (
                    <p className="mt-1 text-sm text-red-600">{errors.coverImage.message}</p>
                  )}
                </div>
                
                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt* <span className="text-gray-500 text-xs">(Short summary for listings)</span>
                  </label>
                  <textarea
                    id="excerpt"
                    rows={2}
                    {...register('excerpt', { 
                      required: 'Excerpt is required',
                      maxLength: { value: 200, message: 'Excerpt cannot exceed 200 characters' }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                  />
                  {errors.excerpt && (
                    <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
                  )}
                </div>
                
                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content*
                  </label>
                  <textarea
                    id="content"
                    rows={10}
                    {...register('content', { required: 'Content is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>
                
                {/* Category & Featured (side by side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category*
                    </label>
                    <select
                      id="category"
                      {...register('categoryId', { required: 'Category is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-start md:justify-center h-full">
                    <input
                      id="featured"
                      type="checkbox"
                      {...register('featured')}
                      className="h-4 w-4 text-purple-700 focus:ring-purple-700 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                      Feature this article on the homepage
                    </label>
                  </div>
                </div>
                
                {/* Source Information */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Source Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                        Source Name
                      </label>
                      <input
                        id="source"
                        type="text"
                        {...register('source')}
                        placeholder="e.g., TrendHunter, Yanko Design"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        Source URL
                      </label>
                      <input
                        id="sourceUrl"
                        type="url"
                        {...register('sourceUrl')}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-700 hover:bg-purple-600 text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Create Article
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminArticleCreate;