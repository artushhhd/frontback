'use client';

import { useState, useEffect } from 'react';
import './products.css';

export default function Products() {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://127.0.0.1:8000/api/user', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setCurrentUserId(data.id))
      .catch(() => localStorage.removeItem('token'));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories', { headers: { Accept: 'application/json' } })
      .then(res => res.ok ? res.json() : [])
      .then(json => setCategories(json.data || json))
      .catch(() => setCategories([]));

    fetch('http://127.0.0.1:8000/api/products', { headers: { Accept: 'application/json' } })
      .then(res => res.ok ? res.json() : { data: [] })
      .then(json => setList(json.data || json))
      .catch(() => setList([]));
  }, []);

  const handleLike = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to like products');

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}/like`, {
        method: 'POST',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setList(prev => prev.map(item => {
          if (item.id !== productId) return item;
          const hasLiked = item.likes?.some(l => l.user_id === currentUserId);
          return {
            ...item,
            likes: hasLiked
              ? item.likes.filter(l => l.user_id !== currentUserId)
              : [...(item.likes || []), { user_id: currentUserId }]
          };
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onRemove = async (id) => {
    if (!confirm('Delete this product?')) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
      });
      if (res.ok) setList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredList = list.filter(item => {
    const title = item.title?.toLowerCase() || '';
    const desc = item.description?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    if (!title.includes(query) && !desc.includes(query)) return false;

    if (selectedCategory) {
      if (item.category_id === selectedCategory) return true;
      
      const activeCat = categories.find(c => c.id === selectedCategory);
      const slug = activeCat?.slug?.toLowerCase() || '';
      
      if (slug === 'new') {
        return title.includes('new') || desc.includes('new') || title.includes('numquam');
      }
      if (slug === 'sale' || slug === 'skidka') {
        return title.includes('sale') || title.includes('skidka') || desc.includes('sale') || item.price < 100;
      }

      return false;
    }

    return true;
  });

  return (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search products by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px 15px', width: '100%', maxWidth: '500px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
        />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setSelectedCategory(null)}
            style={{ padding: '10px 24px', background: selectedCategory === null ? '#6366f1' : '#1e293b', color: 'white', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem' }}
          >
            All Products
          </button>

          {categories.map(cat => {
            const slug = cat.slug?.toLowerCase();
            let btnBg = selectedCategory === cat.id ? '#6366f1' : '#1e293b';
            
            if (selectedCategory !== cat.id) {
              if (slug === 'sale' || slug === 'skidka') btnBg = '#ef4444';
              if (slug === 'new') btnBg = '#10b981';
            }

            return (
              <button 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat.id)}
                style={{ padding: '10px 24px', background: btnBg, color: 'white', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem' }}
              >
                {slug === 'skidka' ? 'Sale' : cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="products-grid">
        {filteredList.map((item) => {
          const isLiked = item.likes?.some(l => l.user_id === currentUserId);

          return (
            <div key={item.id} className="product-card">
              <div className="product-image-wrapper">
                {item.image ? <img src={item.image} alt={item.title} className="product-image" /> : <div className="product-image-placeholder">No Photo</div>}
              </div>

              <div className="product-content">
                {(item.category || selectedCategory) && (
                  <span style={{ alignSelf: 'flex-start', fontSize: '0.75rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', color: '#475569', fontWeight: 'bold', marginBottom: '8px' }}>
                    {item.category?.name === 'skidka' ? 'Sale' : (item.category?.name || categories.find(c => c.id === selectedCategory)?.name)}
                  </span>
                )}
                
                <h2 className="product-title">{item.title}</h2>
                <p className="seller-badge">Seller: {item.user?.name || 'Unknown'}</p>
                <p className="product-description">{item.description}</p>
                
                <div className="product-footer">
                  <span className="product-price">${item.price}</span>
                  <div className="flex gap-2 align-center">
                    <button onClick={() => handleLike(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.4rem' }}>
                      {isLiked ? '❤️' : '🤍'}
                      <span style={{ fontSize: '0.9rem', marginLeft: '5px' }}>{item.likes?.length || 0}</span>
                    </button>

                    <button className="buy-button" disabled={item.stock <= 0}>Buy</button>
                    
                    {currentUserId && item.user_id === currentUserId && (
                      <button onClick={() => onRemove(item.id)} className="delete-button">🗑️</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <p style={{ textAlign: 'center', width: '100%', color: '#666', padding: '40px 0' }}>No products found</p>
        )}
      </div>
    </div>
  );
}