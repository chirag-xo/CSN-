import '../../styles/dashboard.css';

export default function NewsCard() {
    const newsItems = [
        { title: 'Tech industry sees record growth in Q4', readers: '1,234 readers' },
        { title: 'New AI regulations announced', readers: '2,891 readers' },
        { title: 'Startup funding reaches all-time high', readers: '987 readers' },
        { title: 'Remote work trends in 2026', readers: '3,456 readers' },
    ];

    return (
        <div className="dashboard-card">
            <div className="card-title">News</div>
            {newsItems.map((news, index) => (
                <div key={index} className="news-item">
                    <div className="news-title">{news.title}</div>
                    <div className="news-meta">{news.readers}</div>
                </div>
            ))}
        </div>
    );
}
