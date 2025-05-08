import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, ArrowLeft, Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../../firebase/config';
import { Product, Category, AffiliateLink } from '../../types';
import { scrapeProductFromUrl } from '../../services/scraper';

type FormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'> & {
  urlToScrape?: string;
};

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [currentAffiliateStore, setCurrentAffiliateStore] = useState<'amazon' | 'aliexpress' | 'other'>('amazon');
  const [currentAffiliateUrl, setCurrentAffiliateUrl] = useState('');
  const [currentAffiliatePrice, setCurrentAffiliatePrice] = useState('');

  const { register, handleSubmit, setValue, control, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      images: [],
      categoryId: '',
      affiliateLinks: [],
      featured: false
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
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...selectedFiles]);
      
      // Create preview URLs
      const newImageUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...newImageUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addAffiliateLink = () => {
    if (currentAffiliateUrl.trim() && currentAffiliatePrice.trim()) {
      const newLink: AffiliateLink = {
        id: uuidv4(),
        store: currentAffiliateStore,
        url: currentAffiliateUrl.trim(),
        price: parseFloat(currentAffiliatePrice)
      };
      
      setAffiliateLinks(prev => [...prev, newLink]);
      setCurrentAffiliateUrl('');
      setCurrentAffiliatePrice('');
    }
  };

  const removeAffiliateLink = (id: string) => {
    setAffiliateLinks(prev => prev.filter(link => link.id !== id));
  };

  const handleScrapeUrl = async () => {
    if (!watchUrlToScrape) return;
    
    try {
      setIsScrapingUrl(true);
      const scrapedData = await scrapeProductFromUrl(watchUrlToScrape);
      
      if (scrapedData) {
        setValue('title', scrapedData.title);
        setValue('description', scrapedData.description || '');
        setValue('price', scrapedData.price || 0);
        
        if (scrapedData.images && scrapedData.images.length > 0) {
          setImageUrls(scrapedData.images);
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
      
      // Upload images
      const uploadedImageUrls: string[] = [];
      
      // First, add any image URLs that were already provided (e.g., from scraping)
      uploadedImageUrls.push(...imageUrls.filter(url => url.startsWith('http')));
      
      // Then upload any new files
      for (const file of imageFiles) {
        const storageRef = ref(storage, `products/${uuidv4()}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        uploadedImageUrls.push(downloadUrl);
      }
      
      // Create product object
      const newProduct: Omit<Product, 'id'> = {
        title: data.title,
        description: data.description,
        price: data.price,
        images: uploadedImageUrls,
        categoryId: data.categoryId,
        affiliateLinks: affiliateLinks,
        featured: data.featured,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'products'), newProduct);
      
      setIsLoading(false);
      alert('Product created successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating product:', error);
      setIsLoading(false);
      alert('Failed to create product. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* URL Scraping */}
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">Scrape from URL</h2>
                <p className="text-sm text-blue-700 mb-4">
                  Paste a product URL from Amazon, AliExpress, or other supported sites to automatically extract information.
                </p>
                
                <div className="flex">
                  <input
                    type="url"
                    placeholder="https://www.example.com/product"
                    {...register('urlToScrape')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleScrapeUrl}
                    disabled={isScrapingUrl || !watchUrlToScrape}
                    className="bg-blue-800 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                  >
                    {isScrapingUrl ? 'Scraping...' : 'Scrape'}
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Title*
                  </label>
                  <input
                    id="title"
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    {...register('description', { required: 'Description is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
                
                {/* Price & Category (side by side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price*
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <input
                        id="price"
                        type="number"
                        step="0.01"
                        {...register('price', { 
                          required: 'Price is required',
                          min: { value: 0, message: 'Price must be positive' }
                        })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category*
                    </label>
                    <select
                      id="category"
                      {...register('categoryId', { required: 'Category is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
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
                </div>
                
                {/* Featured Toggle */}
                <div className="flex items-center">
                  <input
                    id="featured"
                    type="checkbox"
                    {...register('featured')}
                    className="h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Feature this product on the homepage
                  </label>
                </div>
                
                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images*
                  </label>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {/* Display images */}
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                          <img
                            src={url}
                            alt={`Product image ${index + 1}`}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Add image button */}
                    <div>
                      <label className="block aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md border-2 border-dashed border-gray-300 p-2 text-center cursor-pointer hover:border-blue-800 transition-colors">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="sr-only"
                          accept="image/*"
                        />
                        <div className="flex flex-col items-center justify-center h-full">
                          <PlusCircle className="h-8 w-8 text-gray-400" />
                          <span className="mt-2 block text-sm font-medium text-gray-700">
                            Add Images
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Affiliate Links */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Affiliate Links</h2>
                  
                  {/* Add new affiliate link form */}
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Store
                        </label>
                        <select
                          value={currentAffiliateStore}
                          onChange={(e) => setCurrentAffiliateStore(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                        >
                          <option value="amazon">Amazon</option>
                          <option value="aliexpress">AliExpress</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          value={currentAffiliateUrl}
                          onChange={(e) => setCurrentAffiliateUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                              $
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              value={currentAffiliatePrice}
                              onChange={(e) => setCurrentAffiliatePrice(e.target.value)}
                              placeholder="0.00"
                              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={addAffiliateLink}
                          className="ml-2 bg-blue-800 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors h-10"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Display added affiliate links */}
                  {affiliateLinks.length > 0 ? (
                    <div className="space-y-2">
                      {affiliateLinks.map(link => (
                        <div key={link.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                          <div className="flex items-center">
                            <div className="font-medium text-gray-800 capitalize">
                              {link.store}
                            </div>
                            <div className="ml-4 text-gray-500 text-sm truncate max-w-xs">
                              {link.url}
                            </div>
                            <div className="ml-4 text-gray-800">
                              ${link.price.toFixed(2)}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAffiliateLink(link.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No affiliate links added yet.</p>
                  )}
                </div>
                
                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-800 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Create Product
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

export default AdminProductCreate;