import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login({ email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-left">

        <h1 className="auth-title">Welcome to Alphagnito</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle" />
              {error}
            </div>
          )}

          <div className="form-group">
            <div className={`floating-label-wrap ${form.email ? 'has-value' : ''}`}>
              <input
                className={`form-control ${error ? 'error' : ''}`}
                type="email"
                name="email"
                id="login-email"
                placeholder=" "
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <label htmlFor="login-email" className="floating-label">Email address</label>
            </div>
          </div>

          <div className="form-group">
            <div className={`floating-label-wrap ${form.password ? 'has-value' : ''}`}>
              <div className="input-icon-wrap">
                <input
                  className={`form-control ${error ? 'error' : ''}`}
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  id="login-password"
                  placeholder=" "
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <label htmlFor="login-password" className="floating-label">Password</label>
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPw(v => !v)}
                  tabIndex={-1}
                >
                  <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="form-row-inline">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="link-btn">Forgot password?</Link>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in...</> : 'Login'}
          </button>

        </form>
      </div>

      <div className="auth-right">
      </div>
    </div>
  );
};

export default Login;
