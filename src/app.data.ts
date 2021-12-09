import { Post } from './Queries/ALL_POSTS';

export function getLatestPosts(posts: Post[], count: number) {
    return [...posts]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, count);
}

export function getDataMatrix(posts: Post[]): number[][] {
    const userTopics: string[] = posts.flatMap((post) =>
        post.likelyTopics.map((topic) => topic.label)
    );

    const uniqueUserTopics: string[] = userTopics.filter(
        (topic, i) => userTopics.indexOf(topic) === i
    );

    const dataMatrix: number[][] = new Array(uniqueUserTopics.length)
        .fill([])
        .map(() => new Array(uniqueUserTopics.length).fill(0));

    for (const post of posts) {
        for (let i = 0; i < post.likelyTopics.length - 2; i++) {
            for (let j = i + 1; j < post.likelyTopics.length - 1; j++) {
                const topicA = post.likelyTopics[i];
                const topicB = post.likelyTopics[j];

                const topicAIndex = uniqueUserTopics.indexOf(topicA.label);
                const topicBIndex = uniqueUserTopics.indexOf(topicB.label);

                dataMatrix[topicAIndex][topicBIndex]++;
                dataMatrix[topicBIndex][topicAIndex]++;
            }
        }
    }

    return dataMatrix;
}
