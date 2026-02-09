export interface PageContent {
  title: string;
  description: string;
  heroImage: string;
  sections: {
    title: string;
    description: string;
    icon?: string;
  }[];
}

const content: PageContent = {
  "title": "Products",
  "description": "Explore our amazing product lineup",
  "heroImage": "/uploads/panda-hero.jpg",
  "sections": [
    {
      "title": "Quality Products",
      "description": "We deliver the best quality products to our customers.",
      "icon": ""
    },
    {
      "title": "Fast Shipping",
      "description": "Get your orders delivered quickly and safely."
    }
  ]
};

export default content;
