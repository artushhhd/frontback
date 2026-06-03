"use client";

export default function AdminLayout({ 
  data, 
  currentUser, 
  onTerminateUser, 
  onTerminateProduct, 
  canManageProducts 
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER */}
        <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-black tracking-tighter">ADMIN_CORE</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
              Active Session: <span className="text-indigo-600">{currentUser.role}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase text-emerald-500">System Live</span>
          </div>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="stat-card">
            <p className="stat-label">Total Accounts</p>
            <p className="stat-value">{data.stats?.users_count ?? 0}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Inventory Size</p>
            <p className="stat-value">{data.stats?.products_count ?? 0}</p>
          </div>
        </div>

        {/* USERS MANAGEMENT */}
        <div className="table-container">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">User_Database</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-th">User Identity</th>
                <th className="table-th">Access Role</th>
                <th className="table-th"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.users.map((u) => (
                <tr key={u.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-slate-800">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`badge ${
                      u.role === 'superAdmin' ? 'badge-super' : 
                      u.role === 'admin' ? 'badge-admin' : 'badge-user'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {u.id !== currentUser.id ? (
                      <button 
                        onClick={() => onTerminateUser(u.id)}
                        className="terminate-btn"
                      >
                        TERMINATE
                      </button>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-200 uppercase">Self</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PRODUCTS MANAGEMENT */}
        <div className="table-container">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Inventory_Control</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-th">Product Details</th>
                <th className="table-th">Pricing</th>
                <th className="table-th"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.products.map((p) => (
                <tr key={p.id} className="group hover:bg-slate-50/50">
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-slate-800">{p.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">SKU_ID: {p.id}</div>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-600">
                    ${p.price}
                  </td>
                  <td className="px-8 py-5 text-right">
                    {canManageProducts && (
                      <button 
                        onClick={() => onTerminateProduct(p.id)}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600"
                      >
                        DELETE_ITEM
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}