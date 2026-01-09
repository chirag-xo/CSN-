import { useRef, useState } from 'react';
import '../../styles/eventModal.css';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EventModal({ isOpen, onClose }: EventModalProps) {
    const [step, setStep] = useState(1);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [eventType, setEventType] = useState<'online' | 'in-person'>('online');
    const [eventName, setEventName] = useState('');
    const [timezone, setTimezone] = useState('(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [hasEndDateTime, setHasEndDateTime] = useState(false);
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [externalLink, setExternalLink] = useState('');
    const [description, setDescription] = useState('');
    const [speakers, setSpeakers] = useState('');
    const coverImageInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleCoverImageClick = () => {
        coverImageInputRef.current?.click();
    };

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        } else {
            // Submit event
            console.log('Creating event:', {
                coverImage, eventType, eventName, timezone,
                startDate, startTime, endDate, endTime,
                externalLink, description, speakers
            });
            handleClose();
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const handleClose = () => {
        setStep(1);
        setCoverImage(null);
        setEventName('');
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setExternalLink('');
        setDescription('');
        setSpeakers('');
        onClose();
    };

    return (
        <div className="event-modal-overlay" onClick={handleClose}>
            <div className="event-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="event-modal-header">
                    <h2>Create an event</h2>
                    <button className="event-modal-close" onClick={handleClose}>✕</button>
                </div>

                {/* Content */}
                <div className="event-modal-content">
                    {step === 1 && (
                        <>
                            {/* Cover Image */}
                            <div className="event-cover-section" onClick={handleCoverImageClick}>
                                {coverImage ? (
                                    <img src={coverImage} alt="Cover" className="event-cover-preview" />
                                ) : (
                                    <div className="event-cover-placeholder">
                                        <div className="cover-camera-icon">📷</div>
                                        <div className="cover-upload-text">Upload cover image</div>
                                        <div className="cover-upload-hint">Minimum width 480 pixels, 16:9 recommended</div>
                                    </div>
                                )}
                            </div>

                            {/* Event Type */}
                            <div className="event-field-group">
                                <label className="event-field-label">Event type</label>
                                <div className="event-radio-group">
                                    <label className="event-radio-option">
                                        <input
                                            type="radio"
                                            name="eventType"
                                            value="online"
                                            checked={eventType === 'online'}
                                            onChange={() => setEventType('online')}
                                        />
                                        <span>Online</span>
                                    </label>
                                    <label className="event-radio-option">
                                        <input
                                            type="radio"
                                            name="eventType"
                                            value="in-person"
                                            checked={eventType === 'in-person'}
                                            onChange={() => setEventType('in-person')}
                                        />
                                        <span>In person</span>
                                    </label>
                                </div>
                            </div>

                            {/* Event Name */}
                            <div className="event-field-group">
                                <label className="event-field-label">Event name*</label>
                                <input
                                    type="text"
                                    className="event-input"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    maxLength={75}
                                />
                                <div className="event-char-count">{eventName.length}/75</div>
                            </div>

                            {/* Timezone */}
                            <div className="event-field-group">
                                <label className="event-field-label">Timezone*</label>
                                <select
                                    className="event-select"
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                >
                                    <option>(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                                    <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                                    <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                                    <option>(UTC+00:00) London</option>
                                </select>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            {/* Start Date and Time */}
                            <div className="event-date-time-row">
                                <div className="event-field-group">
                                    <label className="event-field-label">Start date*</label>
                                    <input
                                        type="date"
                                        className="event-input"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="event-field-group">
                                    <label className="event-field-label">Start time*</label>
                                    <input
                                        type="time"
                                        className="event-input"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Add End Date/Time Checkbox */}
                            <label className="event-checkbox-option">
                                <input
                                    type="checkbox"
                                    checked={hasEndDateTime}
                                    onChange={(e) => setHasEndDateTime(e.target.checked)}
                                />
                                <span>Add end date and time</span>
                            </label>

                            {/* End Date and Time (conditional) */}
                            {hasEndDateTime && (
                                <div className="event-date-time-row">
                                    <div className="event-field-group">
                                        <label className="event-field-label">End date</label>
                                        <input
                                            type="date"
                                            className="event-input"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="event-field-group">
                                        <label className="event-field-label">End time</label>
                                        <input
                                            type="time"
                                            className="event-input"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* External Link */}
                            <div className="event-field-group">
                                <label className="event-field-label">External event link*</label>
                                <input
                                    type="url"
                                    className="event-input"
                                    value={externalLink}
                                    onChange={(e) => setExternalLink(e.target.value)}
                                    maxLength={1024}
                                />
                                <div className="event-char-count">{externalLink.length}/1,024</div>
                            </div>

                            {/* Description */}
                            <div className="event-field-group">
                                <label className="event-field-label">Description</label>
                                <textarea
                                    className="event-textarea"
                                    placeholder="Ex: topics, schedule, etc."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={5000}
                                    rows={5}
                                />
                                <div className="event-char-count">{description.length}/5,000</div>
                            </div>

                            {/* Speakers */}
                            <div className="event-field-group">
                                <label className="event-field-label">Speakers</label>
                                <input
                                    type="text"
                                    className="event-input event-search-input"
                                    placeholder="🔍"
                                    value={speakers}
                                    onChange={(e) => setSpeakers(e.target.value)}
                                />
                                <div className="event-help-text">
                                    Add connections to speak at the event. Speakers can join the event early and will be
                                    shown in the event's Details section and presenter area. They cannot allow attendees
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="event-modal-footer">
                    <button className="event-btn-secondary" onClick={handleBack} disabled={step === 1}>
                        Back
                    </button>
                    <button
                        className="event-btn-primary"
                        onClick={handleNext}
                        disabled={step === 1 && !eventName.trim()}
                    >
                        {step === 2 ? 'Done' : 'Next'}
                    </button>
                </div>

                {/* Hidden file input */}
                <input
                    ref={coverImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
}
