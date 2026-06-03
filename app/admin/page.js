"use client";

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import AdminLayout from './admin';

const api = axios.create({ 
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Accept': 'application/json' }
});

export default function AdminPage() {
  const [data, setData] = useState({ stats: null, users: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({ id: null, role: '' });

  // ЗАГРУЗКА ДАННЫХ
  const loadData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return setLoading(false);
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const profileRes = await api.get('/profile', config);
      setCurrentUser(profileRes.data);

      const [statsRes, usersRes, prodRes] = await Promise.all([
        api.get('/admin/stats', config),
        api.get('/admin/users', config),
        api.get('/products', config)
      ]);

      setData({
        stats: statsRes.data.stats,
        users: usersRes.data.items || [],
        products: prodRes.data.data || prodRes.data || []
      });
    } catch (err) {
      console.error("Ошибка при инициализации данных:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ (С ПРОВЕРКОЙ ОШИБОК)
  const handleTerminateUser = async (id) => {
    if (!confirm("Вы уверены? Действие удалит аккаунт навсегда.")) return;
    
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/admin/users/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      // Локально обновляем список
      setData(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== id),
        stats: { ...prev.stats, users_count: prev.stats.users_count - 1 }
      }));
    } catch (err) {
      console.error("Ошибка удаления:", err.response);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Доступ запрещен (403)";
      alert(`ОШИБКА СЕРВЕРА: ${errorMsg}`);
    }
  };

  // УДАЛЕНИЕ ТОВАРА
  const handleTerminateProduct = async (id) => {
    if (!confirm("Удалить товар?")) return;
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/admin/products/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setData(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== id),
        stats: { ...prev.stats, products_count: prev.stats.products_count - 1 }
      }));
    } catch (err) {
      alert("Не удалось удалить товар");
    }
  };

  const canManageProducts = ['moderator', 'admin', 'superadmin'].includes(currentUser.role?.toLowerCase());

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Syncing...</p>
      </div>
    </div>
  );

  return (
    <AdminLayout 
      data={data}
      currentUser={currentUser}
      onTerminateUser={handleTerminateUser}
      onTerminateProduct={handleTerminateProduct}
      canManageProducts={canManageProducts}
    />
  );
}