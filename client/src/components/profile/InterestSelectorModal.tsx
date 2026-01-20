import { useState, useEffect } from 'react';
import interestsService, { type InterestCategory } from '../../services/interestsService';
import { X, Check } from 'lucide-react';
import VisibilitySelector from '../common/VisibilitySelector';
import '../../styles/interestSelector.css';

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
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
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
                const startCat = data.find(c => c.type === 'PROFESSIONAL') || data[0];
                setActiveCategory(startCat.type);
            }
        } catch (err) {
            console.error('Error fetching interests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleInterest = (interestId: string) => {
        if (selectedInterestIds.includes(interestId)) return;

        setSelectedInterests((prev) => {
            if (prev.includes(interestId)) {
                return prev.filter((id) => id !== interestId);
            } else {
                return [...prev, interestId];
            }
        });
    };

    const handleAdd = () => {
        selectedInterests.forEach(id => {
            onAdd(id, visibility);
        });
        onClose();
    };

    const activeInterests =
        categories.find((c) => c.type === activeCategory)?.interests || [];

    return (
        <div className="interest-modal-backdrop" onClick={onClose}>
            <div
                className="interest-modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="interest-modal-header">
                    <h2 className="interest-modal-title">Add Interest</h2>
                    <button onClick={onClose} className="interest-close-btn" aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="interest-tabs-container">
                    <div className="interest-tabs-scroll">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.type)}
                                className={`interest-tab-btn ${activeCategory === category.type ? 'active' : ''}`}
                            >
                                {category.name}
                                {activeCategory === category.type && (
                                    <div className="interest-tab-indicator" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="interest-modal-body">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D28D9]"></div>
                        </div>
                    ) : (
                        <div>
                            <div className="interest-section-title">
                                Select interests <span>(Multi-select allowed)</span>
                            </div>

                            <div className="interest-grid">
                                {activeInterests.map((interest) => {
                                    const isAlreadyAdded = selectedInterestIds.includes(interest.id);
                                    const isSelected = selectedInterests.includes(interest.id);

                                    return (
                                        <button
                                            key={interest.id}
                                            onClick={() => handleToggleInterest(interest.id)}
                                            disabled={isAlreadyAdded}
                                            className={`interest-chip ${isSelected ? 'selected' : ''}`}
                                        >
                                            {isAlreadyAdded ? (
                                                <Check className="chip-check-icon-disabled" />
                                            ) : isSelected ? (
                                                <Check className="chip-check-icon" />
                                            ) : null}
                                            {interest.name}
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedInterests.length > 0 && (
                                <div className="interest-visibility-box">
                                    <label className="interest-visibility-label">
                                        Who can see these?
                                    </label>
                                    <VisibilitySelector
                                        value={visibility}
                                        onChange={(val) => setVisibility(val)}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="interest-modal-footer">
                    <button onClick={onClose} className="interest-cancel-btn">
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={selectedInterests.length === 0 || loading}
                        className="interest-save-btn"
                    >
                        Add Interest{selectedInterests.length > 0 ? `s (${selectedInterests.length})` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
}
