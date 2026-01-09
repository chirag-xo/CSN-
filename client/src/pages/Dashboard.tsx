import DashboardNav from '../components/dashboard/DashboardNav';
import ProfileCard from '../components/dashboard/ProfileCard';
import EventsCard from '../components/dashboard/EventsCard';
import PostCreator from '../components/dashboard/PostCreator';
import Feed from '../components/dashboard/Feed';
import SuggestedConnections from '../components/dashboard/SuggestedConnections';
import NewsCard from '../components/dashboard/NewsCard';
import { useFeed } from '../hooks/useFeed';
import '../styles/dashboard.css';

export default function Dashboard() {
    const { posts, isLoading, createPost, retryPost } = useFeed();

    return (
        <div className="dashboard-container">
            <DashboardNav />

            <div className="dashboard-layout">
                {/* Left Sidebar */}
                <div>
                    <ProfileCard />
                    <div style={{ marginTop: '20px' }}>
                        <EventsCard />
                    </div>
                </div>

                {/* Center Feed */}
                <div>
                    <PostCreator onCreatePost={createPost} />
                    <Feed posts={posts} isLoading={isLoading} onRetry={retryPost} />
                </div>

                {/* Right Sidebar */}
                <div>
                    <SuggestedConnections />
                    <div style={{ marginTop: '20px' }}>
                        <NewsCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
