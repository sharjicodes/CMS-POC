
export interface HomePageContent {
  heroTitle: string;
  heroDescription: string;
  features: {
    title: string;
    description: string;
  }[];
}

const content: HomePageContent = {
  "heroTitle": "dev to main",
  "heroDescription": "This content is being tested",
  "features": [
    {
      "title": "No Database",
      "description": "Content lives in your repo as code."
    },
    {
      "title": "Approval Workflow",
      "description": "Edits go to a development branch for review."
    },
    {
      "title": "Type Safety",
      "description": "Content is typed with TypeScript interfaces."
    }
  ]
};

export default content;
