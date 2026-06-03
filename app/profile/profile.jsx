"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ProfileBody() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        axios.get('http://127.0.0.1:8000/api/user', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => setUser(r.data))
        .catch((err) => {
            console.error("Ошибка авторизации:", err);
            localStorage.removeItem('token');
            router.push('/login');           
        });
    }, [router]);

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            if (token) {
                await axios.post('http://127.0.0.1:8000/api/logout', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.log("Токен уже недействителен на сервере");
        } finally {
            localStorage.removeItem('token');
            router.push('/login');
        }
    };

    if (!user) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="header-section mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold">Personal Information</h1>
            </div>
            
            <div className="stats-grid grid gap-4 mb-6">
                <div className="stat-card border p-4 rounded shadow-sm">
                    <label className="text-gray-500 text-sm">Name</label>
                    <p className="stat-value font-medium text-lg">{user.name}</p>
                </div>
                <div className="stat-card border p-4 rounded shadow-sm">
                    <label className="text-gray-500 text-sm">Email</label>
                    <p className="stat-value font-medium text-lg">{user.email}</p>
                </div>
            </div>

            <button onClick={handleLogout} className="btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Logout
            </button>
        </div>
    );
}