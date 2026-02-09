
export interface PageContent {
    title: string;
    description: string;
    sections: {
        title: string;
        description: string;
    }[];
}

const content: PageContent = {
    "title": "About Us",
    "description": "We are building a headless Git-based CMS.",
    "sections": [
        {
            "title": "Our Mission",
            "description": "To demonstrate that you don't always need a database."
        },
        {
            "title": "Our Vision",
            "description": "Content as Code."
        }
    ]
};

export default content;