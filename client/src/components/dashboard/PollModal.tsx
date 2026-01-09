import { useState } from 'react';
import '../../styles/pollModal.css';

interface PollModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PollModal({ isOpen, onClose }: PollModalProps) {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [duration, setDuration] = useState('1 week');

    if (!isOpen) return null;

    const handleAddOption = () => {
        if (options.length < 4) {
            setOptions([...options, '']);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleRemoveOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleDone = () => {
        console.log('Creating poll:', { question, options, duration });
        // TODO: Implement poll creation
        handleClose();
    };

    const handleClose = () => {
        setQuestion('');
        setOptions(['', '']);
        setDuration('1 week');
        onClose();
    };

    const isValid = question.trim() && options.every(opt => opt.trim());

    return (
        <div className="poll-modal-overlay" onClick={handleClose}>
            <div className="poll-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="poll-modal-header">
                    <h2>Create a poll</h2>
                    <button className="poll-modal-close" onClick={handleClose}>✕</button>
                </div>

                {/* Content */}
                <div className="poll-modal-content">
                    {/* Question */}
                    <div className="poll-field-group">
                        <label className="poll-field-label">Your question*</label>
                        <textarea
                            className="poll-textarea"
                            placeholder="E.g., How do you commute to work?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            maxLength={140}
                            rows={3}
                        />
                        <div className="poll-char-count">{question.length}/140</div>
                    </div>

                    {/* Options */}
                    {options.map((option, index) => (
                        <div key={index} className="poll-field-group">
                            <div className="poll-option-header">
                                <label className="poll-field-label">Option {index + 1}*</label>
                                {index >= 2 && (
                                    <button
                                        className="poll-remove-option"
                                        onClick={() => handleRemoveOption(index)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                className="poll-input"
                                placeholder={index === 0 ? "E.g., Public transportation" : index === 1 ? "E.g., Drive myself" : ""}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                maxLength={30}
                            />
                            <div className="poll-char-count">{option.length}/30</div>
                        </div>
                    ))}

                    {/* Add Option Button */}
                    {options.length < 4 && (
                        <button className="poll-add-option" onClick={handleAddOption}>
                            + Add option
                        </button>
                    )}

                    {/* Poll Duration */}
                    <div className="poll-field-group">
                        <label className="poll-field-label">Poll duration</label>
                        <select
                            className="poll-select"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        >
                            <option>1 day</option>
                            <option>3 days</option>
                            <option>1 week</option>
                            <option>2 weeks</option>
                        </select>
                    </div>

                    {/* Warning Text */}
                    <div className="poll-warning">
                        We don't allow requests for political opinions, medical information or other sensitive data.
                    </div>
                </div>

                {/* Footer */}
                <div className="poll-modal-footer">
                    <button className="poll-btn-secondary" onClick={handleClose}>
                        Back
                    </button>
                    <button
                        className="poll-btn-primary"
                        onClick={handleDone}
                        disabled={!isValid}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
