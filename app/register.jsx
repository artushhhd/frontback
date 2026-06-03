"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './register.css';

export default function RegisterForm() {
    const router = useRouter();
    const [payload, setPayload] = useState({ name: '', email: '', password: '' });
    const [info, setInfo] = useState({ msg: '', isError: false });

    const handleInput = (e) => {
        setPayload({ ...payload, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();
        setInfo({ msg: 'Processing...', isError: false });

        try {
            await axios.post('http://127.0.0.1:8000/api/register', payload);
            setInfo({ msg: 'Success! Redirecting...', isError: false });
            
            setTimeout(() => {
                router.push('/login');
            }, 1000);
            
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed';
            setInfo({ msg: errorMsg, isError: true });
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Sign Up</h2>
            <form onSubmit={submit}>
                <div className="form-group">
                    <input name="name" type="text" placeholder="Full Name" required 
                        className="input-field" onChange={handleInput} />
                    
                    <input name="email" type="email" placeholder="Email" required 
                        className="input-field" onChange={handleInput} />
                    
                    <input name="password" type="password" placeholder="Password" required 
                        className="input-field" onChange={handleInput} />
                </div>

                <button type="submit" className="submit-btn">
                    Create Account
                </button>
                <a href="/login">Already have an account? Login
                
                </a>
            </form>

            {info.msg && (
                <p className={`status-msg ${info.isError ? 'error' : 'success'}`}>
                    {info.msg}
                </p>
            )}
        </div>
    );
}