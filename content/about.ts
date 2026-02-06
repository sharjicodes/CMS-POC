
export interface AboutPageContent {
  heroTitle: string;
  heroDescription: string;
  features: {
    title: string;
    description: string;
  }[];
}

const content: AboutPageContent = {
  "title": "About Us",
  "description": "We are a team of developers building the future of CMS let goo",
  "team": [
    {
      "name": "Alice",
      "role": "Frontend Lead"
    },
    {
      "name": "Bob",
      "role": "Backend Architect"
    }
  ]
};

export default content;
