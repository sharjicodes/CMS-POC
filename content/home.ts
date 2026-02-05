
export interface HomePageContent {
  heroTitle: string;
  heroDescription: string;
  features: {
    title: string;
    description: string;
  }[];
}

const content: HomePageContent = {
  "heroTitle": "Verified by AgentWelcome to the Git-Based CMS okay dfhf fhfhfbg bbdfbdfbfb. 11. ffg",
  "heroDescription": "This content is stored in a TypeScript file and managed via Git branches",
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
