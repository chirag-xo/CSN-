import React, { useState, useEffect } from 'react';
import type { Profile } from '../../services/profileService';
import connectionService, { type Connection } from '../../services/connectionService';
import { Plus, X, Search, Briefcase, Users } from 'lucide-react';

interface ShowcaseTabProps {
    profile: Profile;
    onUpdate: (data: Partial<Profile>) => void;
}

export default function ShowcaseTab({ profile, onUpdate }: ShowcaseTabProps) {
    const [formData, setFormData] = useState({
        topProjectTitle: profile.topProjectTitle || '',
        topProjectDescription: profile.topProjectDescription || '',
        topConnectionIds: profile.topConnectionIds || [],
    });

    const [availableConnections, setAvailableConnections] = useState<Connection[]>([]);
    const [loadingConnections, setLoadingConnections] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showConnectionPicker, setShowConnectionPicker] = useState(false);

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            setLoadingConnections(true);
            const response = await connectionService.getConnections('ACCEPTED');
            if (response && response.data) {
                setAvailableConnections(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch connections', error);
        } finally {
            setLoadingConnections(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            // Assuming the parent component handles the actual API call through onUpdate
            // However, typical pattern here is probably ProfileSettings calling updateProfile
            // Let's assume onUpdate just updates local state and we need to call service, 
            // OR onUpdate calls service. 
            // Looking at ProfileSettings.tsx: handleProfileUpdate just updates local state.
            // So we need to call the API here to save.

            const { profileService } = await import('../../services/profileService');
            await profileService.updateProfile(formData);

            onUpdate(formData); // Update parent state
            alert('Showcase updated successfully!');
        } catch (error) {
            console.error('Error updating showcase:', error);
            alert('Failed to save changes.');
        } finally {
            setIsSaving(false);
        }
    };

    const addConnection = (connectionId: string) => {
        if (formData.topConnectionIds.length >= 5) {
            alert('You can only select up to 5 top connections.');
            return;
        }
        if (!formData.topConnectionIds.includes(connectionId)) {
            setFormData(prev => ({
                ...prev,
                topConnectionIds: [...prev.topConnectionIds, connectionId]
            }));
        }
        setShowConnectionPicker(false);
        setSearchTerm('');
    };

    const removeConnection = (connectionId: string) => {
        setFormData(prev => ({
            ...prev,
            topConnectionIds: prev.topConnectionIds.filter(id => id !== connectionId)
        }));
    };

    // Helper to get connection details by ID (since we only store IDs)
    // We need to look it up in availableConnections. 
    // BUT availableConnections might not be loaded yet or pagination might limit it?
    // connectionService.getConnections usually returns all or paginated. 
    // For now assuming it returns a reasonable list or we might need to fetch specific users if not in list.
    // Given the context, let's assume availableConnections covers it for now.

    const getSelectedConnectionDetails = (id: string) => {
        // The ID in topConnectionIds is likely the CONNECTION ID or the USER ID?
        // The prompt says "from the respective users connections".
        // Usually "Top Connections" implies displaying the USER.
        // If we store connection ID, we can get user. If we store User ID, we search in availableConnections.
        // Let's assume topConnectionIds stores USER IDs for stability.
        // Wait, standard pattern: if I select a connection, I'm selecting a person. 
        // connectionService.getConnections returns objects with `id` (connection ID) and `user` (User object).
        // It's safer to store USER IDs in topConnectionIds so they persist even if connection record changes (unlikely) 
        // but connection ID is strictly for the link.
        // Let's check schema... User model has topConnectionIds String[].
        // Let's use USER IDs.

        // Find connection where connection.user.id === id OR connection.id === id?
        // It's ambiguous. Let's decide to store USER IDs.

        return availableConnections.find(c => c.user.id === id)?.user;
    };

    const filteredConnections = availableConnections.filter(c => {
        const name = `${c.user.firstName} ${c.user.lastName}`.toLowerCase();
        return name.includes(searchTerm.toLowerCase()) && !formData.topConnectionIds.includes(c.user.id);
    });

    return (
        <form onSubmit={handleSubmit} className="profile-tab-content">
            {/* Top Project Section */}
            <div className="form-section">
                <div className="section-header">
                    <Briefcase className="section-icon" size={24} />
                    <div>
                        <h3>Top Project</h3>
                        <p className="section-subtitle">Showcase your most impressive work</p>
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-group full-width">
                        <label>Project Title</label>
                        <input
                            type="text"
                            name="topProjectTitle"
                            value={formData.topProjectTitle}
                            onChange={handleChange}
                            placeholder="e.g. Enterprise SaaS Migration"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Description</label>
                        <textarea
                            name="topProjectDescription"
                            value={formData.topProjectDescription}
                            onChange={handleChange}
                            placeholder="Describe the project, your role, and the outcome..."
                            className="form-textarea"
                            rows={4}
                        />
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* Top Connections Section */}
            <div className="form-section">
                <div className="section-header">
                    <Users className="section-icon" size={24} />
                    <div>
                        <h3>Top 5 Connections</h3>
                        <p className="section-subtitle">Highlight key people in your network (Max 5)</p>
                    </div>
                </div>

                <div className="top-connections-manager">
                    {/* Selected Connections List */}
                    <div className="selected-connections-grid">
                        {formData.topConnectionIds.map(userId => {
                            const user = getSelectedConnectionDetails(userId);
                            if (!user) return null; // Or some skeleton/loading state if fetching
                            return (
                                <div key={userId} className="connection-chip-card">
                                    <div className="chip-avatar">
                                        {user.profilePhoto ? (
                                            <img
                                                src={user.profilePhoto}
                                                alt={`${user.firstName} ${user.lastName}`}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6D28D9&color=fff`;
                                                }}
                                            />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="chip-info">
                                        <div className="chip-name">{user.firstName} {user.lastName}</div>
                                        <div className="chip-role">{user.company ? `${user.position} at ${user.company}` : user.position || 'Member'}</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeConnection(userId)}
                                        className="remove-connection-btn"
                                        aria-label="Remove connection"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Add Button */}
                        {formData.topConnectionIds.length < 5 && (
                            <div className="add-connection-wrapper">
                                {!showConnectionPicker ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowConnectionPicker(true)}
                                        className="add-connection-btn"
                                    >
                                        <Plus size={20} />
                                        <span>Add Connection</span>
                                    </button>
                                ) : (
                                    <div className="connection-picker">
                                        <div className="picker-search">
                                            <Search size={16} className="search-icon" />
                                            <input
                                                type="text"
                                                autoFocus
                                                placeholder="Search connections..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConnectionPicker(false)}
                                                className="close-picker"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="picker-results">
                                            {loadingConnections ? (
                                                <div className="picker-loading">Loading...</div>
                                            ) : filteredConnections.length > 0 ? (
                                                filteredConnections.map(c => (
                                                    <button
                                                        key={c.id}
                                                        type="button"
                                                        className="picker-item"
                                                        onClick={() => addConnection(c.user.id)}
                                                    >
                                                        <div className="picker-item-avatar">
                                                            {c.user.profilePhoto ? (
                                                                <img
                                                                    src={c.user.profilePhoto}
                                                                    alt=""
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.src = `https://ui-avatars.com/api/?name=${c.user.firstName}+${c.user.lastName}&background=6D28D9&color=fff`;
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="avatar-placeholder small">
                                                                    {c.user.firstName[0]}{c.user.lastName[0]}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="picker-item-info">
                                                            <div className="name">{c.user.firstName} {c.user.lastName}</div>
                                                            <div className="role">{c.user.company}</div>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="picker-empty">No matching connections</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="input-helper">
                        {formData.topConnectionIds.length}/5 connections selected
                    </p>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="save-btn" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <style>{`
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .section-icon {
                    color: #6D28D9;
                }
                .section-subtitle {
                    color: #6B7280;
                    font-size: 14px;
                    margin-top: 2px;
                }
                .divider {
                    height: 1px;
                    background: #E5E7EB;
                    margin: 32px 0;
                }
                .connection-chip-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #F9FAFB;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 12px;
                    position: relative;
                }
                .chip-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #E5E7EB;
                    flex-shrink: 0;
                }
                .chip-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .avatar-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #6D28D9;
                    color: white;
                    font-weight: 600;
                    font-size: 14px;
                }
                .chip-info {
                    flex: 1;
                    min-width: 0;
                }
                .chip-name {
                    font-weight: 500;
                    color: #1F2937;
                    font-size: 14px;
                }
                .chip-role {
                    color: #6B7280;
                    font-size: 12px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .remove-connection-btn {
                    color: #9CA3AF;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                .remove-connection-btn:hover {
                    color: #DC2626;
                    background: #FEE2E2;
                }
                .selected-connections-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 16px;
                    margin-top: 16px;
                }
                .add-connection-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    height: 100%;
                    min-height: 80px;
                    border: 2px dashed #D1D5DB;
                    border-radius: 12px;
                    background: white;
                    color: #6B7280;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .add-connection-btn:hover {
                    border-color: #6D28D9;
                    color: #6D28D9;
                    background: #F5F3FF;
                }
                
                .connection-picker {
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    background: white;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    font-size: 14px;
                }
                .picker-search {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border-bottom: 1px solid #E5E7EB;
                    background: #F9FAFB;
                }
                .picker-search input {
                    border: none;
                    background: transparent;
                    flex: 1;
                    outline: none;
                    font-size: 14px;
                }
                .close-picker {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #6B7280;
                }
                .picker-results {
                    max-height: 200px;
                    overflow-y: auto;
                }
                .picker-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 8px 12px;
                    border: none;
                    background: none;
                    text-align: left;
                    cursor: pointer;
                    transition: background 0.1s;
                }
                .picker-item:hover {
                    background: #F3F4F6;
                }
                .picker-item-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #E5E7EB;
                }
                .picker-item-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .avatar-placeholder.small {
                    font-size: 12px;
                }
            `}</style>
        </form>
    );
}
