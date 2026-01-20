import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import './Breadcrumb.css';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="breadcrumb">
            <Link to="/dashboard/home" className="breadcrumb-home">
                <Home size={16} strokeWidth={2.5} />
            </Link>
            {items.map((item, index) => (
                <span key={index} className="breadcrumb-item">
                    <span className="breadcrumb-separator">›</span>
                    {item.path ? (
                        <Link to={item.path} className="breadcrumb-link">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="breadcrumb-current">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
