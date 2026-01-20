import { useState, useEffect } from 'react';
import profileService, { type Profile, type UpdateProfileData } from '../../services/profileService';
import chapterService, { type Chapter } from '../../services/chapterService';
import ProfilePhotoUpload from './ProfilePhotoUpload';

interface BasicInfoTabProps {
    profile: Profile;
    onUpdate: (data: Partial<Profile>) => void;
}

export default function BasicInfoTab({ profile, onUpdate }: BasicInfoTabProps) {
    const [formData, setFormData] = useState<UpdateProfileData>({
        firstName: profile.firstName,
        lastName: profile.lastName,
        company: profile.company || '',
        position: profile.position || '',
        city: profile.city || '',
        phone: profile.phone || '',
        tagline: profile.tagline || '',
        bio: profile.bio || '',
        chapterId: profile.chapter?.id || '',
    });
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loadingChapters, setLoadingChapters] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const bioMaxLength = 500;

    // Fetch chapters on mount
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                setLoadingChapters(true);
                const data = await chapterService.getChapters();
                setChapters(data);
            } catch (err) {
                console.error('Error fetching chapters:', err);
            } finally {
                setLoadingChapters(false);
            }
        };
        fetchChapters();
    }, []);

    useEffect(() => {
        // Track if form has changed
        const hasChanged =
            formData.firstName !== profile.firstName ||
            formData.lastName !== profile.lastName ||
            formData.company !== (profile.company || '') ||
            formData.position !== (profile.position || '') ||
            formData.city !== (profile.city || '') ||
            formData.phone !== (profile.phone || '') ||
            formData.tagline !== (profile.tagline || '') ||
            formData.bio !== (profile.bio || '') ||
            formData.chapterId !== (profile.chapter?.id || '');

        setIsDirty(hasChanged);
    }, [formData, profile]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handlePhotoUpdate = (photoUrl: string) => {
        onUpdate({ profilePhoto: photoUrl });
        setSuccessMessage('Profile photo updated!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName) {
            setErrorMessage('First name and last name are required');
            return;
        }

        try {
            setSaving(true);
            setErrorMessage('');
            const updated = await profileService.updateProfile(formData);
            onUpdate(updated);
            setSuccessMessage('Profile updated successfully!');
            setIsDirty(false);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setErrorMessage(
                err.response?.data?.error?.message || 'Failed to update profile'
            );
        } finally {
            setSaving(false);
        }
    };

    const userInitials = `${profile.firstName[0]}${profile.lastName[0]}`;

    return (
        <form className="basic-info-form" onSubmit={handleSubmit}>
            {/* Profile Photo Section */}
            <div className="form-section">
                <h3 className="section-title">Profile Photo</h3>
                <ProfilePhotoUpload
                    currentPhoto={profile.profilePhoto}
                    onPhotoUpdate={handlePhotoUpdate}
                    userInitials={userInitials}
                />
            </div>

            {/* Personal Information */}
            <div className="form-section">
                <h3 className="section-title">Personal Information</h3>

                {/* Email (Read-Only) */}
                <div className="email-verification-section">
                    <div className="form-group">
                        <label htmlFor="email">Email Address (Login Credential)</label>
                        <div className="email-input-wrapper">
                            <input
                                type="email"
                                id="email"
                                value={profile.email || ''}
                                disabled
                                className="readonly-input"
                            />
                            <div className="verification-badges">
                                {profile.emailVerified ? (
                                    <span className="badge verified">✓ Email Verified</span>
                                ) : (
                                    <span className="badge unverified">⚠ Email Not Verified</span>
                                )}
                                {profile.communityVerified && (
                                    <span className="badge community-verified">
                                        ⭐ Community Verified
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="field-hint">
                            {!profile.emailVerified && 'Verify your email to unlock all features. '}
                            To change your email, contact support.
                        </p>
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="firstName">
                            First Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">
                            Last Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="company">Company</label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="position">Position</label>
                        <input
                            type="text"
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="chapter">Chapter</label>
                        <select
                            id="chapter"
                            name="chapterId"
                            value={formData.chapterId || ''}
                            onChange={handleInputChange}
                            disabled={loadingChapters}
                        >
                            <option value="">Select Chapter (Optional)</option>
                            {chapters.map((chapter) => (
                                <option key={chapter.id} value={chapter.id}>
                                    {chapter.name} - {chapter.city}
                                </option>
                            ))}
                        </select>
                        {profile.chapter && (
                            <p className="field-hint">
                                Current: {profile.chapter.name} ({profile.chapter.city})
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tagline */}
            <div className="form-section">
                <h3 className="section-title">Tagline</h3>
                <div className="form-group">
                    <label htmlFor="tagline">Professional tagline</label>
                    <input
                        type="text"
                        id="tagline"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleInputChange}
                        placeholder="e.g., Building the future, one connection at a time"
                        maxLength={100}
                    />
                    <p className="field-hint">A short one-liner that describes what you do</p>
                </div>
            </div>

            {/* Bio */}
            <div className="form-section">
                <h3 className="section-title">Bio</h3>
                <div className="form-group">
                    <label htmlFor="bio">About you</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={5}
                        maxLength={bioMaxLength}
                        placeholder="Tell people about yourself, your experience, and what you're passionate about..."
                    />
                    <div className="char-count">
                        {formData.bio?.length || 0} / {bioMaxLength}
                    </div>
                </div>
            </div>

            {/* Messages */}
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {/* Actions */}
            <div className="form-actions">
                <button
                    type="submit"
                    className="save-btn"
                    disabled={!isDirty || saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
