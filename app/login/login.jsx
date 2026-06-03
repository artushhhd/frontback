"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './login.css';

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ email: '', password: '' });

    const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', form);

            const token = response.data.token; 
            
            if (token) {
                localStorage.setItem('token', token);
                
                router.push('/profile'); 
            } else {
                setError('Server did not return a token!');
            }
            
        } catch (err) {
            setError('Invalid Email or Password');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto p-6 space-y-4 border rounded shadow-sm mt-10">
            <h2 className="text-2xl font-bold text-center"> Login</h2>
            
            {error && <div className="text-red-500 bg-red-100 p-2 rounded">{error}</div>}

            <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                required 
                className="w-full border p-2 rounded" 
                onChange={update} 
            />
            <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                required 
                className="w-full border p-2 rounded" 
                onChange={update} 
            />
            
            <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? 'Logging in...' : 'Login'}
            </button>
            <a href="/" className="text-blue-500 hover:underline">
                Don't have an account? Register
            </a>
        </form>
    );
}