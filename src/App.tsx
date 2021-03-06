import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import './App.css';
import {
    getBarData,
    getDataMatrix,
    getLatestPosts,
    getRawWords,
} from './app.data';
import BodyWordCloud from './components/BodyWordCloud/BodyWordCloud';
import Card from './components/Card/Card';
import TopicBar from './components/TopicBar/TopicBar';
import TopicChord from './components/TopicChord/TopicChord';
import { AllPosts, ALL_POSTS, Post } from './Queries/ALL_POSTS';

function App() {
    const { data, loading, error } = useQuery<AllPosts>(ALL_POSTS);
    const [userId, setUserId] = useState<string>();

    if (loading) {
        return <span>Loading...</span>;
    }

    if (error) {
        return <span>Error: {error}</span>;
    }

    const users = data!.allPosts.map((post) => post.author);
    const uniqueUsers = users.filter((user, i) => users.indexOf(user) === i);

    if (!userId) {
        setUserId(uniqueUsers[0].id);
        return <span>Loading...</span>;
    }

    const userData: Record<string, Post[]> | undefined = data!.allPosts.reduce(
        (previous, post) => {
            if (!previous[post.author.id]) {
                previous[post.author.id] = [];
            }

            previous[post.author.id].push(post);

            return previous;
        },
        {} as Record<string, Post[]>
    );

    const latestUserPosts = getLatestPosts(userData[userId], 3);
    const dataMatrix = getDataMatrix(userData[userId]);
    const rawWords = getRawWords(userData[userId]);
    const barData = getBarData(userData[userId]);

    const userOptions = uniqueUsers.map((user) => (
        <option key={user.id} value={user.id}>
            {user.id}
        </option>
    ));

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
                <div className="User">
                    <select
                        value={userId}
                        onChange={(e) => {
                            console.log(e);
                            setUserId((e.target as any).value);
                        }}
                    >
                        {userOptions}
                    </select>
                </div>
                {userCards}
            </div>

            <header className="Chart-list">
                <Card className="Chart-card">
                    <TopicChord
                        dataMatrix={dataMatrix}
                        width={650}
                        height={400}
                    />
                </Card>
                <Card className="Chart-card">
                    <BodyWordCloud
                        rawWords={rawWords}
                        width={650}
                        height={400}
                    />
                </Card>
                <Card className="Chart-card Chart-card--double-width">
                    <TopicBar data={barData} width={1340} height={400} />
                </Card>
            </header>
        </div>
    );
}

export default App;
