'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ClientLayoutHelper({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    
    const [user, setUser] = useState({ mounted: false, loggedIn: false, role: null });
    const isPublic = ['/', '/login', '/register'].includes(pathname);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setUser({ mounted: true, loggedIn: false, role: null });
            if (!isPublic) router.push('/login');
            return;
        }

        fetch('http://127.0.0.1:8000/api/user', {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            setUser({ mounted: true, loggedIn: true, role: data.role });
            if (isPublic) router.push('/posts');
        })
        .catch(() => {
            localStorage.removeItem('token');
            setUser({ mounted: true, loggedIn: false, role: null });
            if (!isPublic) router.push('/login');
        });
    }, [pathname, isPublic]);

    if (!user.mounted) return null;

    const currentRoleLower = user.role ? user.role.toLowerCase().trim() : '';
    const showSettings = currentRoleLower !== 'user' && currentRoleLower !== '';

    return (
        <div className="layout-wrapper">
            {user.loggedIn && !isPublic && (
                <header className="main-header">
                    <div className="logo" onClick={() => router.push('/products')}>
                        {pathname === '/login' ? 'ENTRANCE' : pathname === '/' ? 'register' : 'DASHBOARD'}
                    </div>
                    
                    <nav className="nav-links">
                        <button onClick={() => router.push('/products')}>Shop</button>
                        <button onClick={() => router.push('/profile')}>Profile</button>
                        
                        {showSettings && (
                            <button onClick={() => router.push('/admin')} className="admin-btn">Settings</button>
                        )}

                        <button onClick={() => router.push('/create')}>add Products</button>
                        <button onClick={() => router.push('/like')}>Likes</button>
                        
                    </nav>
                </header>
            )}

            <main className={isPublic ? 'full-page' : 'content-container'}>
                {children}
            </main>

            <style jsx global>{`
                .layout-wrapper { 
                    min-height: 100vh; 
                    display: flex; 
                    flex-direction: column; 
                    background: #f8fafc; 
                }
                .main-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 0 5%; 
                    height: 60px; 
                    background: #1e293b; 
                    color: white; 
                    position: sticky; 
                    top: 0;
                    z-index: 50;
                }
                .logo { 
                    font-size: 1rem; 
                    font-weight: bold; 
                    cursor: pointer; 
                }
                /* Исправленный контейнер навигации */
                .nav-links { 
                    display: flex; 
                    flex-direction: row; /* Явно выстраиваем в строку */
                    align-items: center; 
                    gap: 20px; 
                    height: 100%;
                }
                /* Исправленные стили для кнопок-ссылок */
                .nav-links button { 
                    background: none;
                    border: none;
                    color: #cbd5e1;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 6px 12px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    white-space: nowrap; /* Запрещаем перенос слов внутри кнопки */
                }
                .nav-links button:hover { 
                    color: white;
                    background: rgba(255, 255, 255, 0.1);
                }
                /* Кнопка админки */
                .admin-btn { 
                    background: #0070f3 !important; 
                    color: white !important; 
                }
                .admin-btn:hover { 
                    background: #0060df !important; 
                }
                /* Кнопка выхода */
                .logout-btn { 
                    color: #ef4444 !important; 
                }
                .logout-btn:hover {
                    background: rgba(239, 68, 68, 0.1) !important;
                }
                .content-container { 
                    padding: 40px 5%; 
                    width: 100%; 
                    max-width: 1400px; 
                    margin: 0 auto; 
                    box-sizing: border-box; 
                }
                .full-page { 
                    width: 100%; 
                }
            `}</style>
        </div>
    );
}