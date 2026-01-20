import { useState, useEffect, useRef } from 'react';
import { Globe, Users, Lock, ChevronDown } from 'lucide-react';
import '../../styles/visibilitySelector.css';

interface VisibilitySelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function VisibilitySelector({ value, onChange, disabled = false }: VisibilitySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        { value: 'PUBLIC', label: 'Public', icon: Globe, color: '#2563EB' }, // Blue
        { value: 'CONNECTIONS', label: 'Connections', icon: Users, color: '#6D28D9' }, // Purple
        { value: 'PRIVATE', label: 'Only Me', icon: Lock, color: '#4B5563' } // Gray
    ];

    const selectedOption = options.find(opt => opt.value === value) || options[0];
    const SelectedIcon = selectedOption.icon;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`visibility-selector-container ${isOpen ? 'is-open' : ''}`} ref={dropdownRef}>
            <button
                type="button"
                className={`visibility-trigger ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <SelectedIcon size={14} className="visibility-icon" style={{ color: selectedOption.color }} />
                <span className="visibility-label">{selectedOption.label}</span>
                <ChevronDown size={14} className="visibility-chevron" />
            </button>

            {isOpen && (
                <div className="visibility-dropdown-menu">
                    {options.map((option) => {
                        const Icon = option.icon;
                        const isSelected = option.value === value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={`visibility-option ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                <Icon size={16} style={{ color: option.color }} />
                                <span>{option.label}</span>
                                {isSelected && <div className="option-indicator" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
