import axios from 'axios';
import { ScrapedContent } from '../types';

// This would normally be an API call to a backend service that handles web scraping
// For demo purposes, we'll simulate scraping with fake data
export const scrapeProductFromUrl = async (url: string): Promise<Partial<ScrapedContent> | null> => {
  console.log('Scraping product from URL:', url);
  
  // In a real implementation, this would call a backend API
  // For demo purposes, we'll return fake data based on URL patterns
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (url.includes('amazon.com')) {
      return {
        type: 'product',
        title: 'Smart Light Strip with App Control',
        description: 'LED strip lights with 16 million colors, music sync, and smart home integration. Control with your smartphone app or voice assistants like Alexa and Google Home.',
        price: 29.99,
        images: [
          'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
          'https://images.pexels.com/photos/1293269/pexels-photo-1293269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
        ],
        sourceUrl: url,
      };
    } else if (url.includes('aliexpress.com')) {
      return {
        type: 'product',
        title: 'Portable Neck Fan with 3 Speeds',
        description: 'Wearable neck fan with bladeless design, 3 speeds, and rechargeable battery. Perfect for outdoor activities, sports, and hot summer days.',
        price: 19.95,
        images: [
          'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
          'https://images.pexels.com/photos/4195509/pexels-photo-4195509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
        ],
        sourceUrl: url,
      };
    } else {
      return {
        type: 'product',
        title: 'Future Tech Product',
        description: 'An innovative product with cutting-edge technology.',
        price: 49.99,
        images: [
          'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
        ],
        sourceUrl: url,
      };
    }
  } catch (error) {
    console.error('Error scraping product:', error);
    return null;
  }
};

export const scrapeArticleFromUrl = async (url: string): Promise<Partial<ScrapedContent> | null> => {
  console.log('Scraping article from URL:', url);
  
  // In a real implementation, this would call a backend API
  // For demo purposes, we'll return fake data
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (url.includes('trendhunter.com')) {
      return {
        type: 'article',
        title: 'Conceptual Flying Car Design Shows the Future of Urban Transportation',
        content: `This innovative flying car concept represents a bold vision for the future of urban mobility. Designed by renowned futurist architect Maya Johnson, the vehicle combines vertical take-off and landing capabilities with autonomous driving features.

The sleek design incorporates sustainable materials and is powered by next-generation solid-state batteries, giving it an estimated range of 300 miles per charge. What sets this concept apart is its modular approach - the flight module can detach from the ground vehicle, allowing users to switch between air and road travel seamlessly.

Urban planners are already considering how such vehicles could transform city infrastructure, potentially reducing the need for traditional roads and parking structures. While commercial production is likely still a decade away, several major aerospace and automotive companies have expressed interest in the technology.`,
        source: 'TrendHunter',
        sourceUrl: url,
        images: [
          'https://images.pexels.com/photos/8539462/pexels-photo-8539462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
        ]
      };
    } else if (url.includes('yankodesign.com')) {
      return {
        type: 'article',
        title: 'Expandable Tiny House Concept Triples Living Space with Ingenious Design',
        content: `This revolutionary tiny house concept has captured the attention of minimalist living enthusiasts worldwide. Created by architectural firm Micro Living Solutions, the 'Expanda Home' can triple its living space at the touch of a button.

The 400-square-foot structure features multiple sections that slide out from the main module, transforming a compact living space into a comfortable 1,200-square-foot home with separate areas for living, working, and sleeping.

What makes this design particularly remarkable is its focus on sustainability. The house is constructed primarily from recycled materials and incorporates solar panels, rainwater collection, and a composting system. Its modular nature also means it can be transported on a standard truck and assembled in just three days.

"We wanted to challenge the perception that tiny living means sacrificing comfort," says lead designer Jordan Chen. "With smart design and automation, we can create spaces that adapt to our needs rather than forcing us to adapt to fixed spaces."

The first prototype is currently being tested in Colorado, with plans for commercial availability by late next year. With a projected price point of $95,000, it offers an affordable housing alternative that doesn't compromise on functionality.`,
        source: 'Yanko Design',
        sourceUrl: url,
        images: [
          'https://images.pexels.com/photos/1769342/pexels-photo-1769342.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
        ]
      };
    } else {
      return {
        type: 'article',
        title: 'Innovative Design Concept',
        content: 'This article showcases an innovative design concept that could change the way we interact with technology.',
        source: 'Design Blog',
        sourceUrl: url,
        images: [
          'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
        ]
      };
    }
  } catch (error) {
    console.error('Error scraping article:', error);
    return null;
  }
};