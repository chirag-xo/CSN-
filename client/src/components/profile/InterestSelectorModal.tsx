import { useState, useEffect } from 'react';
import interestsService, { type InterestCategory } from '../../services/interestsService';

interface InterestSelectorModalProps {
    selectedInterestIds: string[];
    maxReached: boolean;
    onAdd: (interestId: string, visibility: string) => void;
    onClose: () => void;
}

export default function InterestSelectorModal({
    selectedInterestIds,
    maxReached,
    onAdd,
    onClose,
}: InterestSelectorModalProps) {
    const [categories, setCategories] = useState<InterestCategory[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [selectedInterest, setSelectedInterest] = useState<string>('');
    const [visibility, setVisibility] = useState<string>('PUBLIC');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await interestsService.getAllInterests();
            setCategories(data);
            if (data.length > 0) {
                setActiveCategory(data[0].type);
            }
        } catch (err) {
            console.error('Error fetching interests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        if (selectedInterest) {
            onAdd(selectedInterest, visibility);
            onClose();
        }
    };

    const activeInterests =
        categories.find((c) => c.type === activeCategory)?.interests || [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Interest</h2>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading-spinner"></div>
                    ) : (
                        <>
                            {/* Category Tabs */}
                            <div className="category-tabs">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        className={`category-tab ${activeCategory === category.type ? 'active' : ''
                                            }`}
                                        onClick={() => setActiveCategory(category.type)}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            {/* Interests Grid */}
                            <div className="interests-grid">
                                {activeInterests.map((interest) => {
                                    const isSelected = selectedInterestIds.includes(interest.id);
                                    const isCurrentSelection = selectedInterest === interest.id;

                                    return (
                                        <button
                                            key={interest.id}
                                            className={`interest-card ${isSelected ? 'already-selected' : ''
                                                } ${isCurrentSelection ? 'selected' : ''}`}
                                            onClick={() =>
                                                !isSelected && setSelectedInterest(interest.id)
                                            }
                                            disabled={isSelected || (maxReached && !isCurrentSelection)}
                                        >
                                            {interest.name}
                                            {isSelected && <span className="check-mark">✓</span>}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Visibility Selection */}
                            {selectedInterest && (
                                <div className="visibility-section">
                                    <label>Who can see this interest?</label>
                                    <select
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value)}
                                        className="visibility-dropdown"
                                    >
                                        <option value="PUBLIC">Everyone</option>
                                        <option value="CONNECTIONS">Connections only</option>
                                        <option value="PRIVATE">Only me</option>
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="add-btn"
                        onClick={handleAdd}
                        disabled={!selectedInterest || loading}
                    >
                        Add Interest
                    </button>
                </div>
            </div>
        </div>
    );
}
