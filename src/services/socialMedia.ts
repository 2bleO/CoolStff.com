import { SocialMediaPost, Article, Product } from '../types';

interface SocialMediaConfig {
  platform: 'facebook' | 'twitter' | 'instagram' | 'pinterest';
  templates: {
    product: string[];
    article: string[];
  };
  imageRequirements: {
    width: number;
    height: number;
    format: string[];
  };
}

const SOCIAL_MEDIA_CONFIGS: Record<string, SocialMediaConfig> = {
  facebook: {
    platform: 'facebook',
    templates: {
      product: [
        '🔥 NEW: {title} - Discover this innovative product! 🚀\n\n💰 Only ${price}\n\n#Innovation #TechGadgets #CoolStuff',
        '✨ Featured Product Alert! ✨\n\n{title}\n\nExplore more at coolstff.com 🌟\n\n#Innovation #CoolGadgets'
      ],
      article: [
        '🎯 {title}\n\nRead more about this amazing concept on coolstff.com! 🔍\n\n#FutureTech #Innovation',
        '🌟 Design of the Future: {title}\n\nDiscover more innovative designs on coolstff.com 🚀\n\n#ConceptualDesign #Innovation'
      ]
    },
    imageRequirements: {
      width: 1200,
      height: 630,
      format: ['jpg', 'png']
    }
  },
  twitter: {
    platform: 'twitter',
    templates: {
      product: [
        '🆕 {title}\n\nCheck out this innovative product on coolstff.com!\n\n#Innovation #TechGadgets',
        'Discovered: {title} 🚀\n\nFind more cool stuff at coolstff.com!\n\n#CoolGadgets #Innovation'
      ],
      article: [
        '🎯 Future of Design: {title}\n\nRead more on coolstff.com\n\n#FutureTech #Innovation',
        '🌟 {title}\n\nExplore this amazing concept on coolstff.com!\n\n#Design #Innovation'
      ]
    },
    imageRequirements: {
      width: 1200,
      height: 675,
      format: ['jpg', 'png']
    }
  },
  instagram: {
    platform: 'instagram',
    templates: {
      product: [
        '🚀 Introducing: {title}\n\nDiscover more innovative products like this on coolstff.com (link in bio)\n\n.
.
.
#Innovation #TechGadgets #CoolStuff #FutureTech #Design #TechnologyInnovation',
        '✨ Featured: {title}\n\nFind more amazing products on coolstff.com (link in bio)\n\n.
.
.
#Innovation #ProductDesign #CoolGadgets #TechLovers #FutureDesign'
      ],
      article: [
        '🎯 {title}\n\nRead the full story on coolstff.com (link in bio)\n\n.
.
.
#ConceptualDesign #FutureTech #Innovation #Design #TechnologyInnovation',
        '🌟 Design Spotlight: {title}\n\nMore innovative designs on coolstff.com (link in bio)\n\n.
.
.
#FutureDesign #Innovation #ConceptArt #ProductDesign #TechInnovation'
      ]
    },
    imageRequirements: {
      width: 1080,
      height: 1080,
      format: ['jpg', 'png']
    }
  }
};

export class SocialMediaManager {
  private static instance: SocialMediaManager;

  private constructor() {}

  public static getInstance(): SocialMediaManager {
    if (!SocialMediaManager.instance) {
      SocialMediaManager.instance = new SocialMediaManager();
    }
    return SocialMediaManager.instance;
  }

  private getRandomTemplate(templates: string[]): string {
    const index = Math.floor(Math.random() * templates.length);
    return templates[index];
  }

  private formatCaption(template: string, content: Product | Article): string {
    let caption = template;
    caption = caption.replace('{title}', content.title);
    
    if ('price' in content) {
      caption = caption.replace('${price}', `$${content.price.toFixed(2)}`);
    }
    
    return caption;
  }

  public generateSocialPost(content: Product | Article, platform: SocialMediaPost['platform']): Omit<SocialMediaPost, 'status' | 'scheduledFor'> {
    const config = SOCIAL_MEDIA_CONFIGS[platform];
    const contentType = 'price' in content ? 'product' : 'article';
    const templates = config.templates[contentType];
    const template = this.getRandomTemplate(templates);
    const caption = this.formatCaption(template, content);
    
    return {
      platform,
      contentId: content.id,
      contentType,
      caption,
      imageUrl: contentType === 'product' ? content.images[0] : content.coverImage
    };
  }

  public generateAllSocialPosts(content: Product | Article): Omit<SocialMediaPost, 'status' | 'scheduledFor'>[] {
    return Object.keys(SOCIAL_MEDIA_CONFIGS).map(platform => 
      this.generateSocialPost(content, platform as SocialMediaPost['platform'])
    );
  }
}

export const socialMediaManager = SocialMediaManager.getInstance();