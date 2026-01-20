import { useState, useEffect } from 'react';
import privacyService, { type PrivacySettings, type UpdatePrivacyData } from '../../services/privacyService';
import VisibilitySelector from '../common/VisibilitySelector';

export default function PrivacyTab() {
    const [settings, setSettings] = useState<PrivacySettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await privacyService.getSettings();
            setSettings(data);
        } catch (err) {
            console.error('Error fetching privacy settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVisibilityChange = async (
        field: keyof UpdatePrivacyData,
        value: string
    ) => {
        if (!settings) return;

        try {
            setUpdating(field);
            const updated = await privacyService.updateSettings({ [field]: value });
            setSettings(updated);
            setSuccessMessage(`${field.replace('Visibility', '')} visibility updated`);
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (err) {
            console.error('Error updating privacy:', err);
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    if (!settings) {
        return <div className="error-message">Failed to load privacy settings</div>;
    }

    const privacyFields = [
        {
            key: 'emailVisibility' as keyof UpdatePrivacyData,
            label: 'Email Address',
            description: 'Who can see your email address',
        },
        {
            key: 'phoneVisibility' as keyof UpdatePrivacyData,
            label: 'Phone Number',
            description: 'Who can see your phone number',
        },
        {
            key: 'eventsVisibility' as keyof UpdatePrivacyData,
            label: 'Events',
            description: 'Who can see events you\'re attending',
        },
        {
            key: 'interestsVisibility' as keyof UpdatePrivacyData,
            label: 'Interests',
            description: 'Who can see your interests',
        },
        {
            key: 'activityVisibility' as keyof UpdatePrivacyData,
            label: 'Activity',
            description: 'Who can see your recent activity',
        },
    ];

    return (
        <div className="privacy-tab">
            <div className="privacy-intro">
                <h3>Privacy Controls</h3>
                <p>Manage who can see your information on CSN</p>
            </div>

            {successMessage && <div className="success-message">{successMessage}</div>}

            <div className="privacy-settings">
                {privacyFields.map((field) => (
                    <div key={field.key} className="privacy-item">
                        <div className="privacy-info">
                            <label>{field.label}</label>
                            <p className="privacy-description">{field.description}</p>
                        </div>
                        <div className="privacy-control">
                            <VisibilitySelector
                                value={settings[field.key] as string || 'PRIVATE'}
                                onChange={(val) => handleVisibilityChange(field.key, val)}
                                disabled={updating === field.key}
                            />
                            {updating === field.key && <span className="updating-indicator">Updating...</span>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="privacy-note">
                <p>
                    <strong>Note:</strong> Some information like your name and profile photo
                    may always be visible to help other members connect with you.
                </p>
            </div>
        </div>
    );
}
