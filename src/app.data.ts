import { Post } from './Queries/ALL_POSTS';

export function getLatestPosts(posts: Post[], count: number) {
    return [...posts]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, count);
}
