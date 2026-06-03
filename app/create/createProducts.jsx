'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './CProducts.css';

export default function CreateProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    price: '', 
    stock: '', 
    image: '' 
  });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/products', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/products');
        router.refresh();
      } else {
        const data = await res.json();
        alert(res.status === 401 ? 'Session expired, please log in again' : (data.message || 'Validation error'));
      }
    } catch (err) {
      alert('server error or network issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={submit} className="product-form">
        <h2 className="form-title">add Products</h2>
        
        <div className="input-group">
          {['title', 'description', 'price', 'stock', 'image'].map((field) => (
            <div key={field} className="field-wrapper">
              <label className="field-label">
                {field === 'image' ? 'Image URL' : 
                 field === 'title' ? 'Title' :
                 field === 'description' ? 'Description' :
                 field === 'price' ? 'Price' : 'In Stock'}
              </label>
              <input
                name={field}
                type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                placeholder={`enter ${field}...`}
                required
                className="form-input"
                onChange={update}
              />
            </div>
          ))}
        </div>

        {form.image && (
          <div className="image-preview">
            <p className="text-xs text-gray-400 mb-2">Preview:</p>
            <img src={form.image} alt="Preview" onError={(e) => e.target.style.display='none'} />
          </div>
        )}

        <button disabled={loading} className="submit-button">
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </form>
    </div>
  );
}