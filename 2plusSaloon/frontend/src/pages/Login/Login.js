import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import toast from 'react-hot-toast';
export default function Login() {
  const [form, setForm] = useState({ username: 'admin', password: 'password' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const handle = async e => {
    e.preventDefault(); setLoading(true);
    try { await login(form.username, form.password); nav('/dashboard'); toast.success('Welcome back!'); }
    catch { toast.error('Invalid credentials'); }
    finally { setLoading(false); }
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-circle"><i className="bi bi-scissors"/></div>
          <h4 className="fw-bold mb-1">Elegance Salon</h4>
          <p className="text-muted small">Management System v1.0</p>
        </div>
        <form onSubmit={handle}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person"/></span>
              <input className="form-control" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required/>
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock"/></span>
              <input type="password" className="form-control" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
            </div>
          </div>
          <button className="btn btn-primary w-100 py-2 fw-600" disabled={loading}>
            {loading?<span className="spinner-border spinner-border-sm me-2"/>:<i className="bi bi-box-arrow-in-right me-2"/>}
            {loading?'Signing in...':'Sign In'}
          </button>
        </form>
        <div className="text-center mt-3">
          <small className="text-muted">Default: admin / password</small>
        </div>
      </div>
    </div>
  );
}
