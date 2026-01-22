import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileHeader from '../components/profile/PublicProfileHeader';
import ProfileAbout from '../components/profile/ProfileAbout';
import ProfileInterests from '../components/profile/ProfileInterests';
import ProfileActions from '../components/profile/ProfileActions';
import Breadcrumb from '../components/common/Breadcrumb';
import '../styles/publicProfile.css';

interface PublicProfileData {
    basic: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        location: string | null;
    };
    professional: {
        company: string | null;
        position: string | null;
    };
    about: {
        tagline: string | null;
        bio: string | null;
        memberSince: string;
    };
    verification: {
        emailVerified: boolean;
        communityVerified: boolean;
        vouchCount: number;
    };
    interests: Array<{
        id: string;
        name: string;
        category: string;
        categoryType: string;
        visibility: string;
    }>;
    chapter: {
        name: string;
        city: string;
    } | null;
    contact: {
        email: string | null;
        phone: string | null;
    };
    viewerContext: {
        isOwnProfile: boolean;
        isConnected: boolean;
        connectionPending: boolean;
        hasVouched: boolean;
        canVouch: boolean;
    };
}

export default function PublicProfile() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<PublicProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/profile/${userId}`,
                { headers }
            );

            setProfile(response.data.data);
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.error?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="public-profile-page">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="public-profile-page">
                <div className="error-state">
                    <h2>❌ Profile Not Found</h2>
                    <p>{error || 'The profile you\'re looking for doesn\'t exist'}</p>
                    <button onClick={() => navigate('/dashboard')} className="back-btn">
                        ← Go Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const fullName = `${profile.basic.firstName} ${profile.basic.lastName}`;

    return (
        <div className="public-profile-page">
            <div className="public-profile-container">
                {/* Breadcrumb */}
                <Breadcrumb items={[
                    { label: 'Members', path: '/dashboard' },
                    { label: fullName }
                ]} />

                {/* Profile Content */}
                <div className="profile-content">
                    {/* Left Column */}
                    <div className="profile-left">
                        <ProfileHeader
                            firstName={profile.basic.firstName}
                            lastName={profile.basic.lastName}
                            photoUrl={profile.basic.profilePhoto}
                            company={profile.professional.company}
                            position={profile.professional.position}
                            location={profile.basic.location}
                            emailVerified={profile.verification.emailVerified}
                            communityVerified={profile.verification.communityVerified}
                            vouchCount={profile.verification.vouchCount}
                            chapterName={profile.chapter?.name}
                        />

                        <ProfileInterests interests={profile.interests} />
                    </div>

                    {/* Right Column */}
                    <div className="profile-right">
                        <ProfileActions
                            userId={profile.basic.id}
                            viewerContext={profile.viewerContext}
                            userName={fullName}
                            onVouch={fetchProfile}
                            isAuthenticated={!!localStorage.getItem('token')}
                        />

                        <ProfileAbout
                            tagline={profile.about.tagline}
                            bio={profile.about.bio}
                            memberSince={profile.about.memberSince}
                        />

                        {profile.chapter && (
                            <div className="profile-card">
                                <h3>Chapter</h3>
                                <p>
                                    <strong>{profile.chapter.name}</strong>
                                    <br />
                                    {profile.chapter.city}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
