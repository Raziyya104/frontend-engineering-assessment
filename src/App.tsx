import { useQuery } from '@apollo/client';
import React from 'react';
import './App.css';
import { getDataMatrix, getLatestPosts } from './app.data';
import Card from './components/Card/Card';
import TopicChord from './components/TopicChord/TopicChord';
import { AllPosts, ALL_POSTS, Post } from './Queries/ALL_POSTS';

function App() {
    const { data, loading, error } = useQuery<AllPosts>(ALL_POSTS);

    if (loading) {
        return <span>Loading...</span>;
    }

    if (error) {
        return <span>Error: {error}</span>;
    }

    const user = data!.allPosts[0].author;
    const userId = user.id;

    const userData: Record<string, Post[]> | undefined = data!.allPosts.reduce(
        (previous, post) => {
            if (!previous[post.author.id]) {
                previous[post.author.id] = [];
            } else {
                previous[post.author.id].push(post);
            }

            return previous;
        },
        {} as Record<string, Post[]>
    );

    const latestUserPosts = getLatestPosts(userData[userId], 3);
    const dataMatrix = getDataMatrix(userData[userId]);
    const userCards = latestUserPosts.map((post) => (
        <Card key={post.id} className="User-card">
            <p>
                <b>{post.title}</b>
            </p>
            <p>{post.body}</p>
        </Card>
    ));

    return (
        <div className="App">
            <div className="Side-panel">
                <div className="User">{userId}</div>
                {userCards}
            </div>

            <header className="Chart-list">
                <Card className="Chart-card"></Card>
                <Card className="Chart-card"></Card>
                <Card className="Chart-card"></Card>
                <Card className="Chart-card">
                    <TopicChord
                        dataMatrix={dataMatrix}
                        width={650}
                        height={400}
                    />
                </Card>
            </header>
        </div>
    );
}

export default App;
