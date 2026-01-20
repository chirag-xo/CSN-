import { type ReactNode } from 'react';

interface KpiCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    trend?: string;
    iconBg?: string;
}

export default function KpiCard({ icon, label, value, trend, iconBg = 'rgba(109, 40, 217, 0.1)' }: KpiCardProps) {
    return (
        <div className="kpi-card">
            <div className="kpi-icon-wrapper" style={{ backgroundColor: iconBg }}>
                {icon}
            </div>
            <div className="kpi-content">
                <div className="kpi-label">{label}</div>
                <div className="kpi-value">{value}</div>
                {trend && <div className="kpi-trend">{trend}</div>}
            </div>
        </div>
    );
}
