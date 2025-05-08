import axios from 'axios';
import { ScrapedContent, ContentType } from '../types';

interface ScraperConfig {
  selectors: {
    title: string;
    description?: string;
    price?: string;
    images: string;
    content?: string;
  };
  type: ContentType;
}

const SCRAPER_CONFIGS: Record<string, ScraperConfig> = {
  'amazon.com': {
    type: 'product',
    selectors: {
      title: '#productTitle',
      description: '#feature-bullets',
      price: '.a-price-whole',
      images: '#imgBlkFront',
    }
  },
  'aliexpress.com': {
    type: 'product',
    selectors: {
      title: '.product-title-text',
      description: '.product-description',
      price: '.product-price-value',
      images: '.magnifier-image',
    }
  },
  'trendhunter.com': {
    type: 'article',
    selectors: {
      title: '.article-title',
      content: '.article-body',
      images: '.article-image',
    }
  }
};

export class ContentScraper {
  private static instance: ContentScraper;
  private readonly apiEndpoint: string;

  private constructor() {
    this.apiEndpoint = import.meta.env.VITE_SCRAPER_API_ENDPOINT || 'http://localhost:3000/api/scrape';
  }

  public static getInstance(): ContentScraper {
    if (!ContentScraper.instance) {
      ContentScraper.instance = new ContentScraper();
    }
    return ContentScraper.instance;
  }

  private getConfigForUrl(url: string): ScraperConfig | null {
    const domain = new URL(url).hostname;
    return SCRAPER_CONFIGS[domain] || null;
  }

  public async scrapeContent(url: string): Promise<Partial<ScrapedContent> | null> {
    try {
      const config = this.getConfigForUrl(url);
      if (!config) {
        throw new Error('Unsupported website');
      }

      // Call the scraping API with the URL and config
      const response = await axios.post(this.apiEndpoint, {
        url,
        config: config.selectors
      });

      const { data } = response;

      return {
        type: config.type,
        title: data.title,
        description: data.description,
        price: config.type === 'product' ? parseFloat(data.price) : undefined,
        content: config.type === 'article' ? data.content : undefined,
        images: Array.isArray(data.images) ? data.images : [data.images],
        sourceUrl: url,
        source: new URL(url).hostname
      };
    } catch (error) {
      console.error('Error scraping content:', error);
      return null;
    }
  }

  public async validateUrl(url: string): Promise<boolean> {
    try {
      new URL(url);
      const config = this.getConfigForUrl(url);
      return config !== null;
    } catch {
      return false;
    }
  }
}

export const contentScraper = ContentScraper.getInstance();