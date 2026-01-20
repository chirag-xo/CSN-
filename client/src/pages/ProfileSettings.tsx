import { useState, useEffect } from 'react';
import '../styles/profile.css';
import profileService, { type Profile } from '../services/profileService';
import BasicInfoTab from '../components/profile/BasicInfoTab';
import InterestsTab from '../components/profile/InterestsTab';
import PrivacyTab from '../components/profile/PrivacyTab';
import ProfileCompletionWidget from '../components/profile/ProfileCompletionWidget';
import ShowcaseTab from '../components/profile/ShowcaseTab';
import Breadcrumb from '../components/common/Breadcrumb';
import { User, Star, Lock, Briefcase } from 'lucide-react';

type TabType = 'basic' | 'interests' | 'privacy' | 'showcase';

export default function ProfileSettings() {
    const [activeTab, setActiveTab] = useState<TabType>('basic');
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await profileService.getProfile();
            setProfile(data);
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.error?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = (updatedData: Partial<Profile>) => {
        if (profile) {
            setProfile({ ...profile, ...updatedData });
        }
    };

    if (loading) {
        return (
            <div className="profile-settings">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="profile-settings">
                <div className="error-state">
                    <p className="error-message">{error || 'Profile not found'}</p>
                    <button onClick={fetchProfile} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-settings">
            <div className="profile-container">
                {/* Breadcrumb */}
                <Breadcrumb items={[{ label: 'My Profile' }]} />

                {/* Header */}
                <div className="profile-header">
                    <div className="header-content">
                        <h1>Profile Settings</h1>
                        <p className="header-subtitle">
                            Manage your personal information, interests, and privacy settings
                        </p>
                    </div>
                    <ProfileCompletionWidget />
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    <button
                        className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
                        onClick={() => setActiveTab('basic')}
                    >
                        <span className="tab-icon">
                            <User size={18} />
                        </span>
                        <span>Basic Info</span>
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'interests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('interests')}
                    >
                        <span className="tab-icon">
                            <Star size={18} />
                        </span>
                        <span>Interests</span>
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'showcase' ? 'active' : ''}`}
                        onClick={() => setActiveTab('showcase')}
                    >
                        <span className="tab-icon">
                            <Briefcase size={18} />
                        </span>
                        <span>Showcase</span>
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('privacy')}
                    >
                        <span className="tab-icon">
                            <Lock size={18} />
                        </span>
                        <span>Privacy</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'basic' && (
                        <BasicInfoTab profile={profile} onUpdate={handleProfileUpdate} />
                    )}
                    {activeTab === 'interests' && (
                        <InterestsTab profile={profile} onUpdate={handleProfileUpdate} />
                    )}
                    {activeTab === 'showcase' && (
                        <ShowcaseTab profile={profile} onUpdate={handleProfileUpdate} />
                    )}
                    {activeTab === 'privacy' && <PrivacyTab />}
                </div>
            </div>
        </div>
    );
}
