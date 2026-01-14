import { useState } from 'react';
import interestsService, { type UserInterest } from '../../services/interestsService';
import InterestSelectorModal from './InterestSelectorModal';
import type { Profile } from '../../services/profileService';

interface InterestsTabProps {
    profile: Profile;
    onUpdate: (data: Partial<Profile>) => void;
}

export default function InterestsTab({ profile, onUpdate }: InterestsTabProps) {
    const [userInterests, setUserInterests] = useState<UserInterest[]>(profile.interests as any);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const MAX_INTERESTS = 7;

    const handleAddInterest = async (interestId: string, visibility: string) => {
        if (userInterests.length >= MAX_INTERESTS) {
            setErrorMessage(`You can only have ${MAX_INTERESTS} interests`);
            return;
        }

        try {
            setLoading(true);
            setErrorMessage('');
            const newInterest = await interestsService.addInterest({
                interestId,
                visibility: visibility as any,
            });
            setUserInterests((prev) => [...prev, newInterest]);
            setSuccessMessage('Interest added!');
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (err: any) {
            console.error('Error adding interest:', err);
            setErrorMessage(
                err.response?.data?.error?.message || 'Failed to add interest'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveInterest = async (userInterestId: string) => {
        try {
            setLoading(true);
            setErrorMessage('');
            await interestsService.removeInterest(userInterestId);
            setUserInterests((prev) => prev.filter((ui) => ui.id !== userInterestId));
            setSuccessMessage('Interest removed');
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (err: any) {
            console.error('Error removing interest:', err);
            setErrorMessage(
                err.response?.data?.error?.message || 'Failed to remove interest'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVisibilityChange = async (userInterestId: string, visibility: string) => {
        try {
            await interestsService.updateVisibility(userInterestId, visibility as any);
            setUserInterests((prev) =>
                prev.map((ui) => (ui.id === userInterestId ? { ...ui, visibility } : ui))
            );
        } catch (err: any) {
            console.error('Error updating visibility:', err);
            setErrorMessage('Failed to update visibility');
        }
    };

    return (
        <div className="interests-tab">
            {/* Header */}
            <div className="interests-header">
                <div>
                    <h3>Your Interests</h3>
                    <p className="interest-count">
                        {userInterests.length} / {MAX_INTERESTS} interests selected
                    </p>
                </div>
                <button
                    type="button"
                    className="add-interest-btn"
                    onClick={() => setShowModal(true)}
                    disabled={userInterests.length >= MAX_INTERESTS || loading}
                >
                    + Add Interest
                </button>
            </div>

            {/* Messages */}
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {/* Interests List */}
            {userInterests.length === 0 ? (
                <div className="empty-interests">
                    <p>No interests added yet</p>
                    <p className="hint">Add interests to help people discover you!</p>
                </div>
            ) : (
                <div className="interests-list">
                    {userInterests.map((ui) => (
                        <div key={ui.id} className="interest-item">
                            <div className="interest-info">
                                <span className="interest-category">
                                    {ui.interest.category.name}
                                </span>
                                <span className="interest-name">{ui.interest.name}</span>
                            </div>
                            <div className="interest-actions">
                                <select
                                    className="visibility-select"
                                    value={ui.visibility}
                                    onChange={(e) => handleVisibilityChange(ui.id, e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="PUBLIC">Public</option>
                                    <option value="CONNECTIONS">Connections</option>
                                    <option value="PRIVATE">Private</option>
                                </select>
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => handleRemoveInterest(ui.id)}
                                    disabled={loading}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <InterestSelectorModal
                    selectedInterestIds={userInterests.map((ui) => ui.interest.id)}
                    maxReached={userInterests.length >= MAX_INTERESTS}
                    onAdd={handleAddInterest}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
