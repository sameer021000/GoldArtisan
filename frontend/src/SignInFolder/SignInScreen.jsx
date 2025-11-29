// SignInScreen.jsx
import './SignInScreenCSS.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignInScreen = () => {
  // API base: set REACT_APP_API_BASE in Vercel env for production, fallback to localhost
  const apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:7000';

  const EyeOpenIcon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeClosedIcon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.8 21.8 0 015.06-7.94"></path>
      <path d="M1 1l22 22"></path>
      <path d="M9.53 9.53a3 3 0 014.24 4.24"></path>
    </svg>
  );

  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    phone: '',
    password: ''
  });

  const [showPw, setShowPw] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // null | true | false
  const [output, setOutput] = useState('');

  // validators (phone same as SignUp; password required only)
  const validators = {
    phone: v => {
      if (!v || !v.toString().trim()) return 'Phone number is required.';
      const digits = v.replace(/\D/g, '');
      if (digits.length < 10) return 'Enter a valid 10-digit phone number.';
      if (digits.length > 10) return 'Enter only the 10-digit mobile number (do not include +91).';
      return '';
    },
    password: v => {
      if (!v) return 'Password is required.';
      return '';
    }
  };

  const getValidityAttrs = (field) => {
    const val = form[field];
    const err = errors[field];
    if (err && err.length) return { 'aria-invalid': 'true', 'aria-valid': 'false' };
    if (val && !err) return { 'aria-invalid': 'false', 'aria-valid': 'true' };
    return { 'aria-invalid': 'false', 'aria-valid': 'false' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    const validator = validators[name];
    if (validator) {
      const err = validator(value);
      setErrors(prev => ({ ...prev, [name]: err }));
    }
  };

  const validateAll = () => {
    const next = {};
    Object.keys(validators).forEach(key => {
      next[key] = validators[key](form[key]);
    });
    setErrors(next);
    const isValid = Object.values(next).every(v => v === '');
    return { isValid, next };
  };

  const mapField = (field) => {
    // reuse same ID mapping convention as SignUpScreen
    switch (field) {
      case 'phone': return 3;
      case 'password': return 5;
      default: return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOutput('');
    setSuccess(null);

    const { isValid, next } = validateAll();

    if (!isValid) {
      // focus first invalid input
      const firstInvalid = Object.keys(next).find(k => next[k]);
      if (firstInvalid) {
        const id = `inputId${mapField(firstInvalid)}`;
        const el = document.getElementById(id);
        if (el) el.focus();
      }
      return;
    }

    const digitsOnlyPhone = form.phone.replace(/\D/g, '');
    const payload = {
      phoneNumberFFEnd: digitsOnlyPhone,
      passwordFFEnd: form.password
    };

    setLoading(true);

    try {
      // endpoint is configurable; update path if your backend uses different route
      const response = await axios.post(`${apiBase}/Operations/unVerifiedGASignInPath`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response?.data?.success) {
        setSuccess(true);
        setOutput(response.data.message || 'Signed in successfully.');
        setTimeout(() => navigate('/HomeScreenPath', { replace: true }), 600);
      } else {
        setSuccess(false);
        setOutput(response?.data?.message || 'Sign in failed.');
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      if (err?.response) {
        setSuccess(false);
        setOutput(serverMsg || `Server error: ${err.response.status}`);
      } else if (err?.request) {
        setSuccess(false);
        setOutput('No response from server. It may be sleeping or unreachable.');
      } else {
        setSuccess(false);
        setOutput(err.message || 'An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="divId1" className="signup-wrap">
      <h2 id="h2Id1" className="title">Artisan Sign In</h2>

      <form id="formId1" onSubmit={handleSubmit} noValidate className="signup-form">

        {/* PHONE */}
        <label id="labelId3" className="field-label">
          <div className="label-row">
            <span>Phone number</span>
            <span className="field-icon" aria-hidden="true">{!errors.phone && form.phone ? '✓' : (errors.phone ? '⚠' : '')}</span>
          </div>

          <div id="phoneWrapId" className="phone-wrap">
            <span id="phonePrefixId" className="phone-prefix" aria-hidden="true">+91</span>
            <input
              id="inputId3"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number (10 digits)"
              inputMode="tel"
              minLength={10}
              maxLength={10}
              {...getValidityAttrs('phone')}
              className={errors.phone ? 'input error' : 'input phone-input'}
            />
          </div>
        </label>
        <div id="help_inputId3" className="helper">Enter the 10-digit mobile number only. Example: 9876543210</div>
        <div id="err_inputId3" className="err" role="alert" aria-live="polite">{errors.phone}</div>

        {/* PASSWORD */}
        <label id="labelId5" className="field-label">
          <div className="label-row">
            <span>Password</span>
            <span className="field-icon" aria-hidden="true">{!errors.password && form.password ? '✓' : (errors.password ? '⚠' : '')}</span>
          </div>
          <div id="pwWrap" className="pw-wrap">
            <input
              id="inputId5"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              type={showPw ? 'text' : 'password'}
              maxLength={64}
              {...getValidityAttrs('password')}
              className={errors.password ? 'input error' : 'input'}
            />
            <button
              type="button"
              id="eyeId1"
              aria-label={showPw ? 'Hide password' : 'Show password'}
              onClick={() => setShowPw(s => !s)}
              className="pw-eye-btn"
            >
              {showPw ? EyeOpenIcon : EyeClosedIcon}
            </button>
          </div>
        </label>
        <div id="help_inputId5" className="helper">Enter the password associated with your account.</div>
        <div id="err_inputId5" className="err" role="alert" aria-live="polite">{errors.password}</div>

        <div className="submit-row">
          <button id="btnId1" type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <div id="signInHint">
          Don't have an account?&nbsp;
          <button
            id="signInSpan"
            type="button"
            onClick={() => navigate('/SignUpPath')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/SignUpPath'); }}
            aria-label="Go to Sign Up"
          >
            SignUp
          </button>
        </div>

        {/* server output */}
        {success !== null && (
          <div
            id="serverOutputId"
            className={`server-msg ${success ? 'success' : 'error'}`}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {output}
          </div>
        )}
      </form>
    </div>
  );
};

export default SignInScreen;
