import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import AlphagnitoLogo from '../components/AlphagnitoLogo';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(errs => ({ ...errs, [e.target.name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.mobile.trim()) errs.mobile = 'Mobile number is required.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authAPI.register(form);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-left" style={{ maxWidth: 540, padding: '40px 80px' }}>
        <div className="auth-logo">
          <AlphagnitoLogo size={36} />
          <span>Alphagnito</span>
        </div>

        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Fill in the details below to get started</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {serverError && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-circle" />
              {serverError}
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <i className="fas fa-check-circle" />
              {success}
            </div>
          )}

          <div className="form-group">
            <input
              className={`form-control ${errors.name ? 'error' : ''}`}
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="form-group">
            <input
              className={`form-control ${errors.email ? 'error' : ''}`}
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-group">
            <input
              className={`form-control ${errors.mobile ? 'error' : ''}`}
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
            />
            {errors.mobile && <div className="error-text">{errors.mobile}</div>}
          </div>

          <div className="form-group">
            <div className="input-icon-wrap">
              <input
                className={`form-control ${errors.password ? 'error' : ''}`}
                type={showPw ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              <button type="button" className="toggle-pw" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <div className="form-group">
            <div className="input-icon-wrap">
              <input
                className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                type={showCpw ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <button type="button" className="toggle-pw" onClick={() => setShowCpw(v => !v)} tabIndex={-1}>
                <i className={`fas ${showCpw ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
            {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating account...</> : 'Register'}
          </button>

          <div className="form-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>

      <div className="auth-right">
        <svg className="brand-hexagon" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 10 L176 55 L176 145 L100 190 L24 145 L24 55 Z"
            fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <path d="M68 76 L100 58 L100 96 L76 110 Z" fill="#60a5fa" opacity="0.9" />
          <path d="M100 96 L100 58 L132 76 L124 110 Z" fill="#8b5cf6" opacity="0.9" />
          <path d="M68 124 L76 110 L100 96 L100 142 Z" fill="#3b82f6" opacity="0.85" />
          <path d="M132 124 L100 142 L100 96 L124 110 Z" fill="#7c3aed" opacity="0.85" />
        </svg>
      </div>
    </div>
  );
};

export default Register;
