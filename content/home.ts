
const content = {
  "title": "dev to main production change ok lets goo",
  "description": "This content is stored in a TypeScript file and managed via Git branches",
  "sections": [
    {
      "title": "No Database",
      "description": "Content lives in your repo as code."
    },
    {
      "title": "Approval Workflow",
      "description": "Edits go to a development branch for review.",
      "newImage": "/uploads/1770707401274-screenshot-2026-02-03-at-10.44.24-am.png"
    },
    {
      "title": "Type Safety",
      "description": "Content is typed with TypeScript interfaces."
    }
  ]
};

export type PageContent = typeof content;
export default content;
