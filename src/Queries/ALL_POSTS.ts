import { gql } from '@apollo/client';

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
