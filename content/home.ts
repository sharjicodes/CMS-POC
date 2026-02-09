
export interface PageContent {
  title: string;
  description: string;
  sections: {
    title: string;
    description: string;
  }[];
}

const content: PageContent = {
  "title": "dev to main production change ok lets goo",
  "description": "This content is stored in a TypeScript file and managed via Git branches",
  "sections": [
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
