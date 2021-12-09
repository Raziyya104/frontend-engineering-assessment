import { gql } from '@apollo/client';

export interface AllPosts {
    allPosts: Post[];
}

export interface Post {
    id: string;
    title: string;
    body: string;
    published: boolean;
    createdAt: string;
    author: User;
    likelyTopics: [Topic];
}
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
}

export interface Topic {
    label: string;
    likelihood: number;
}

export const ALL_POSTS = gql`
    query {
        allPosts(count: 1000) {
            title
            body
            published
            createdAt
            author {
                id
            }
            likelyTopics {
                label
                likelihood
            }
        }
    }
`;
