import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface SkillsInputProps {
    skills: string[];
    onChange: (skills: string[]) => void;
    maxSkills?: number;
}

export default function SkillsInput({ skills, onChange, maxSkills = 20 }: SkillsInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const handleAddSkill = () => {
        const trimmedValue = inputValue.trim();

        // Validation
        if (!trimmedValue) {
            return;
        }

        if (trimmedValue.length < 2) {
            setError('Skill must be at least 2 characters');
            return;
        }

        if (skills.length >= maxSkills) {
            setError(`Maximum ${maxSkills} skills allowed`);
            return;
        }

        // Check for duplicates (case-insensitive)
        const isDuplicate = skills.some(
            skill => skill.toLowerCase() === trimmedValue.toLowerCase()
        );

        if (isDuplicate) {
            setError('This skill already exists');
            return;
        }

        // Add skill
        onChange([...skills, trimmedValue]);
        setInputValue('');
        setError('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleRemoveSkill = (indexToRemove: number) => {
        onChange(skills.filter((_, index) => index !== indexToRemove));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setError('');
    };

    return (
        <div className="skills-input-wrapper">
            <div className="skills-input-row">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a skill and press Enter..."
                    maxLength={50}
                />
                <button
                    type="button"
                    onClick={handleAddSkill}
                    className="add-skill-btn"
                    disabled={!inputValue.trim() || skills.length >= maxSkills}
                >
                    Add Skill
                </button>
            </div>

            {error && (
                <p className="field-hint" style={{ color: 'var(--red)' }}>
                    {error}
                </p>
            )}

            {skills.length > 0 ? (
                <>
                    <div className="skills-list">
                        {skills.map((skill, index) => (
                            <span key={index} className="skill-chip">
                                {skill}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(index)}
                                    className="skill-chip-remove"
                                    aria-label={`Remove ${skill}`}
                                >
                                    <X size={12} strokeWidth={3} />
                                </button>
                            </span>
                        ))}
                    </div>
                    <p className="skills-count">
                        {skills.length} / {maxSkills} skills
                    </p>
                </>
            ) : (
                <div className="skills-empty">
                    No skills added yet. Add up to {maxSkills} skills to showcase your expertise.
                </div>
            )}
        </div>
    );
}
