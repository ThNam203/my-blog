import { type Author } from "./author";

export type PostAddress = {
    name: string;
    address: string;
    link?: string;
    addressLink?: string;
};

export type Post = {
    slug: string;
    title: string;
    categories: string[];
    date: string;
    coverImage?: string;
    author: Author;
    excerpt: string;
    ogImage?: {
        url: string;
    };
    content: string;
    preview?: boolean;
    draft?: boolean;
    addresses?: PostAddress[];
};
