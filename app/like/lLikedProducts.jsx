'use client';

import { useState, useEffect } from 'react';
import '../products/products.css';

export default function LikedProducts() {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userRes = await fetch('http://127.0.0.1:8000/api/user', {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const userData = await userRes.json();
        setUserId(userData.id);
        const prodRes = await fetch('http://127.0.0.1:8000/api/products', {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const prodData = await prodRes.json();
        setItems(prodData.data || []);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const likedItems = items.filter(item => 
    item.likes?.some(like => like.user_id === userId)
  );

  if (loading) return <div className="liked-container">Loading...</div>;

  return (
    <div className="liked-container">
      <h1>Products you liked</h1>
      
      {likedItems.length > 0 ? (
        <div className="products-grid">
          {likedItems.map((item) => (
            <div key={item.id} className="product-card">
              <div className="product-image-wrapper">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="product-image" />
                ) : (
                  <div className="product-image-placeholder">No Photo</div>
                )}
              </div>
              <div className="product-content">
                <h2 className="product-title">{item.title}</h2>
                <p className="product-price">${item.price}</p>
                <div className="product-footer">
                   <span className="liked-badge">❤️ you liked this product</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">You haven't liked any products yet 🤍</p>
      )}
    </div>
  );
}