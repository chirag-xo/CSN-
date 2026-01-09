import DashboardNav from '../components/dashboard/DashboardNav';
import NetworkSidebar from '../components/network/NetworkSidebar';
import InvitationCard from '../components/network/InvitationCard';
import { useState } from 'react';
import '../styles/network.css';

// Mock data for invitations
const mockInvitations = [
    {
        id: '1',
        name: 'Partha Pritam Das',
        title: 'Open Source Contributor | Focused on React, Node.js & DSA',
        mutualConnections: 'Yogita Sahni and 1 other mutual connection',
        avatar: '',
    },
    {
        id: '2',
        name: 'Faiz Islam',
        title: 'Attended Al-Kabir Polytechnic',
        mutualConnections: 'Dhiraj Chatpar is a mutual connection',
        avatar: '',
        verified: true,
    },
    {
        id: '3',
        name: 'Abdennour Nasri',
        title: 'Etudiant Master',
        mutualConnections: 'Nisha Kumari is a mutual connection',
        avatar: '',
    },
];

export default function Network() {
    const [activeTab, setActiveTab] = useState<'grow' | 'catchup'>('grow');
    const [invitations, setInvitations] = useState(mockInvitations);

    const handleAccept = (id: string) => {
        console.log('Accept invitation:', id);
        setInvitations(prev => prev.filter(inv => inv.id !== id));
    };

    const handleIgnore = (id: string) => {
        console.log('Ignore invitation:', id);
        setInvitations(prev => prev.filter(inv => inv.id !== id));
    };

    return (
        <div className="dashboard">
            <DashboardNav />

            <div className="dashboard-content">
                <div className="network-layout">
                    {/* Left Sidebar */}
                    <NetworkSidebar />

                    {/* Main Content */}
                    <div className="network-main">
                        <div className="network-tabs dashboard-card">
                            <button
                                className={`network-tab ${activeTab === 'grow' ? 'active' : ''}`}
                                onClick={() => setActiveTab('grow')}
                            >
                                Grow
                            </button>
                            <button
                                className={`network-tab ${activeTab === 'catchup' ? 'active' : ''}`}
                                onClick={() => setActiveTab('catchup')}
                            >
                                Catch up
                            </button>
                        </div>

                        {/* Invitations Section */}
                        <div className="dashboard-card">
                            <div className="invitations-header">
                                <h2>Invitations ({invitations.length})</h2>
                                <button className="show-all-btn">Show all</button>
                            </div>

                            <div className="invitations-list">
                                {invitations.map(invitation => (
                                    <InvitationCard
                                        key={invitation.id}
                                        invitation={invitation}
                                        onAccept={handleAccept}
                                        onIgnore={handleIgnore}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
