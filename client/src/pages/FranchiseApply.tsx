import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './FranchiseApply.css';

const Label = ({ children, required = false }: { children: React.ReactNode, required?: boolean }) => (
    <label className="form-label font-dm-sans">
        {required && <span className="text-[#6D28D9] mr-1">*</span>}
        {children} :
    </label>
);

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
    <div className="form-input-wrapper">
        <input
            {...props}
            className={`w-full border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]/50 focus:border-[#6D28D9] text-gray-700 text-sm ${className}`}
        />
    </div>
);

const Select = ({ children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) => (
    <div className="form-input-wrapper">
        <select
            {...props}
            className={`w-full border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]/50 focus:border-[#6D28D9] bg-white text-gray-700 text-sm ${className}`}
        >
            {children}
        </select>
    </div>
);

const TextArea = ({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) => (
    <div className="form-input-wrapper">
        <textarea
            {...props}
            className={`w-full border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#6D28D9]/50 focus:border-[#6D28D9] text-gray-700 text-sm ${className}`}
        />
    </div>
);

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
];

const SearchableSelect = ({
    options,
    value,
    onChange,
    placeholder = "Select",
    required = false
}: {
    options: string[],
    value: string,
    onChange: (value: string) => void,
    placeholder?: string,
    required?: boolean
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null); // To handle click outside

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm(""); // Reset search or keep it? usually reset or set to value.
        // If we set to value user searches inside selected value which is weird.
        // Let's just reset search term but the main input needs to show the VALUE.
    };

    return (
        <div className="form-input-wrapper relative" ref={wrapperRef}>
            <div
                className={`w-full border border-gray-300 rounded px-2 py-2 flex items-center justify-between cursor-pointer bg-white transition-colors hover:border-[#6D28D9]/50 ${isOpen ? 'ring-1 ring-[#6D28D9]/50 border-[#6D28D9]' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`text-sm ${!value ? 'text-gray-400' : 'text-gray-700'}`}>
                    {value || placeholder}
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9]/50"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option}
                                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${value === option ? 'bg-purple-50 text-[#6D28D9]' : 'text-gray-700 hover:bg-gray-50'}`}
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function FranchiseApply() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        city: '',
        country: 'USA',
        state: '',
        zip: '',
        mobile: '',
        comments: '',
        englishProficiency: '',
        email: '',
        fullTime: '',
        region: '',
        businessNetwork: '',
        hasWhatsapp: '',
        whatsapp: '',
        associatedCountry: 'USA'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Form Submitted', formData);
            alert('Application Request Received! We will be in touch shortly.');
            setIsSubmitting(false);
        }, 1500);
    };



    return (
        <div className="min-h-screen bg-gray-100 font-dm-sans">

            {/* Premium Dashboard Gradient Header */}
            <div className="w-full bg-dashboard-gradient py-12 lg:py-16 mt-0">
                <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative flex items-center justify-center">
                    <Link
                        to="/"
                        className="absolute left-6 lg:left-8 text-white/80 hover:text-white transition-colors"
                        aria-label="Back to Home"
                    >
                        <ArrowLeft className="w-6 h-6 lg:w-8 lg:h-8" />
                    </Link>
                    <h1 className="text-white text-3xl lg:text-4xl font-normal tracking-wide uppercase">
                        FRANCHISE ENQUIRY
                    </h1>
                </div>
            </div>

            {/* Main Form Section */}
            <section className="px-4 lg:px-8 py-6 lg:py-8">
                <div className="max-w-[1100px] mx-auto bg-white shadow-sm border border-gray-200">
                    <form onSubmit={handleSubmit} className="p-0">

                        {/* Primary Info Section */}
                        <div className="bg-gray-100 px-6 py-2 border-b border-gray-200">
                            <h2 className="font-bold text-gray-700 text-sm">Primary Info</h2>
                        </div>

                        <div className="p-4 lg:p-8 space-y-3">
                            <div className="max-w-[900px] mx-auto">
                                <div className="text-right text-[10px] text-gray-500 mb-2">
                                    Fields marked with <span className="text-[#6D28D9]">*</span> are mandatory.
                                </div>

                                <div className="franchise-form-grid">
                                    {/* Row 1 */}
                                    <div className="form-group">
                                        <Label required>First Name</Label>
                                        <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                                    </div>
                                    <div className="form-group">
                                        <Label required>Last Name</Label>
                                        <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                                    </div>

                                    {/* Row 2 */}
                                    <div className="form-group">
                                        <Label>Address1</Label>
                                        <Input name="address1" value={formData.address1} onChange={handleChange} placeholder="Address1" />
                                    </div>
                                    <div className="form-group">
                                        <Label required>City</Label>
                                        <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                                    </div>

                                    {/* Row 3 */}
                                    <div className="form-group">
                                        <Label required>Country</Label>
                                        <Select name="country" value={formData.country} onChange={handleChange} required>
                                            <option value="USA">USA</option>
                                            <option value="India">India</option>
                                            <option value="UK">UK</option>
                                        </Select>
                                    </div>
                                    <div className="form-group">
                                        <Label required>State / Province</Label>
                                        <SearchableSelect
                                            options={indianStates}
                                            value={formData.state}
                                            onChange={(val) => setFormData(prev => ({ ...prev, state: val }))}
                                            placeholder="Select State"
                                            required
                                        />
                                    </div>

                                    {/* Row 4 */}
                                    <div className="form-group">
                                        <Label required>Zip / Postal Code</Label>
                                        <Input name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip / Postal Code" required />
                                    </div>
                                    <div className="form-group">
                                        <Label required>Mobile with Country Code</Label>
                                        <Input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile with Country Code" required />
                                    </div>

                                    {/* Row 5 */}
                                    <div className="form-group items-start">
                                        <Label required>Comments</Label>
                                        <TextArea
                                            name="comments"
                                            rows={3}
                                            placeholder="Comments"
                                            value={formData.comments}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group self-start">
                                        <Label>English Proficiency</Label>
                                        <Select name="englishProficiency" value={formData.englishProficiency} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="Native">Native</option>
                                            <option value="Fluent">Fluent</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Basic">Basic</option>
                                        </Select>
                                    </div>

                                    {/* Row 6 */}
                                    <div className="form-group">
                                        <Label required>Email</Label>
                                        <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                                    </div>
                                    <div className="form-group">
                                        <span className="form-label">
                                            Can you devote your full time to the business? :
                                        </span>
                                        <div className="flex gap-4 form-input-wrapper">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="fullTime" value="Yes" checked={formData.fullTime === 'Yes'} onChange={handleChange} className="w-4 h-4 text-[#6D28D9] focus:ring-[#6D28D9]" />
                                                <span className="text-gray-600 text-sm">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="fullTime" value="No" checked={formData.fullTime === 'No'} onChange={handleChange} className="w-4 h-4 text-[#6D28D9] focus:ring-[#6D28D9]" />
                                                <span className="text-gray-600 text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Row 7 */}
                                    <div className="form-group">
                                        <Label>Interested Franchise Region</Label>
                                        <Input name="region" value={formData.region} onChange={handleChange} placeholder="Interested Franchise Region" />
                                    </div>
                                    <div className="form-group">
                                        <Label>Are you a CSN member?</Label>
                                        <Select name="businessNetwork" value={formData.businessNetwork} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Info Section */}
                        <div className="bg-gray-100 px-6 py-2 border-b border-gray-200 border-t items-center mt-4">
                            <h2 className="font-bold text-gray-700 text-sm">WhatsApp Info</h2>
                        </div>

                        <div className="p-4 lg:p-8 space-y-3">
                            <div className="max-w-[900px] mx-auto">
                                <div className="franchise-form-grid">
                                    {/* Row 1 */}
                                    <div className="form-group">
                                        <span className="form-label">
                                            Do you have a WhatsApp number :
                                        </span>
                                        <div className="flex gap-4 form-input-wrapper">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="hasWhatsapp" value="Yes" checked={formData.hasWhatsapp === 'Yes'} onChange={handleChange} className="w-4 h-4 text-[#6D28D9] focus:ring-[#6D28D9]" />
                                                <span className="text-gray-600 text-sm">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="hasWhatsapp" value="No" checked={formData.hasWhatsapp === 'No'} onChange={handleChange} className="w-4 h-4 text-[#6D28D9] focus:ring-[#6D28D9]" />
                                                <span className="text-gray-600 text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <Label>WhatsApp Number</Label>
                                        <Input name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="WhatsApp Number" />
                                    </div>

                                    {/* Row 2 */}
                                    <div className="form-group">
                                        <Label>Associated Country</Label>
                                        <Select name="associatedCountry" value={formData.associatedCountry} onChange={handleChange}>
                                            <option value="USA">USA</option>
                                            <option value="India">India</option>
                                            <option value="UK">UK</option>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Actions (Centered) */}
                        <div className="flex justify-center gap-4 pb-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-8 py-2 bg-dashboard-gradient text-white font-bold text-sm rounded-full shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''} uppercase tracking-wider`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                            <button
                                type="button"
                                className="px-8 py-2 bg-dashboard-gradient text-white font-bold text-sm rounded-full shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5 uppercase tracking-wider"
                                onClick={() => setFormData({
                                    firstName: '', lastName: '', address1: '', city: '',
                                    country: 'USA', state: '', zip: '', mobile: '',
                                    comments: '', englishProficiency: '', email: '',
                                    fullTime: '', region: '', businessNetwork: '',
                                    hasWhatsapp: '', whatsapp: '', associatedCountry: 'USA'
                                })}
                            >
                                Reset
                            </button>
                        </div>

                    </form>
                </div>
            </section>

            {/* Footer removed as per user request */}
        </div>
    );
}
