"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './globals.css';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            router.push('/login');
            return;
        }
        axios.get('http://127.0.0.1:8000/api/user', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUser(res.data))
        .catch(() => {
            localStorage.removeItem('token');
            router.push('/login');
        });
    }, [router]);

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (!user) return (
        <div className="loading-screen">
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar">
                <div className="sidebar-logo">🚀 MyProject</div>
                <nav className="nav-links">
                    <div className="nav-item active">Dashboard</div>
                    <div className="nav-item">Analytics</div>
                    <div className="nav-item">Profile</div>
                </nav>
                <button onClick={logout} className="logout-btn">Log Out</button>
            </aside>

            <main className="main-content">
                <div className="header-section">
                    <div className="welcome-text">
                        <h1>Welcome, {user.name}</h1>
                        <p>Everything looks good today.</p>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">User Email</span>
                        <div className="stat-value">{user.email}</div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Account Status</span>
                        <div className="status-badge">Active</div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Join Date</span>
                        <div className="stat-value">
                            {new Date(user.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}