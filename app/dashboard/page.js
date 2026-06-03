"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        axios.get('http://127.0.0.1:8000/api/user', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUser(res.data))
        .catch(() => {
            localStorage.removeItem('token');
            router.push('/login');
        });
    }, [router]);

    if (!user) return <div>Загрузка данных пользователя...</div>;

    return (
        <>
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
                    <span className="stat-label">Join Date</span>
                    <div className="stat-value">
                        {new Date(user.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </>
    );
}