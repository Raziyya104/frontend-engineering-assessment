import { Post } from './Queries/ALL_POSTS';

function getUniqueUserTopics(posts: Post[]) {
    const userTopics: string[] = posts.flatMap((post) =>
        post.likelyTopics.map((topic) => topic.label)
    );

    return userTopics.filter((topic, i) => userTopics.indexOf(topic) === i);
}

export function getLatestPosts(posts: Post[], count: number) {
    return [...posts]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, count);
}

export function getDataMatrix(posts: Post[]): number[][] {
    const uniqueUserTopics = getUniqueUserTopics(posts);

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

export function getRawWords(posts: Post[]): string {
    return posts.map(({ body }) => body).join(' ');
}

export function getBarData(posts: Post[]): Record<string, any>[] {
    const monthData: Record<string, Record<string, any>> = [...posts]
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .reduce((previous, post) => {
            const date = new Date(parseInt(post.createdAt));
            const month = `${date.getMonth()} ${date.getFullYear()}`;

            if (!previous[month]) {
                previous[month] = { date: month };
            }

            for (const topic of post.likelyTopics) {
                if (!previous[month][topic.label]) {
                    previous[month][topic.label] = 0;
                }

                previous[month][topic.label]++;
            }

            return previous;
        }, {} as Record<string, Record<string, any>>);

    return Object.values(monthData);
}
