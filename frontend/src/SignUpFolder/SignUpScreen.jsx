// SignUpScreen.jsx
import './SignUpScreenCSS.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpScreen = () => {
  // API base: set REACT_APP_API_BASE in Vercel env for production, fallback to localhost
  const apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:7000';

  const navigate = useNavigate();

  useEffect(() =>
  {
    // Check if token exists
    const token = localStorage.getItem('GoldArtisanToken');
    if (token)
    {
      navigate('/HomeScreenPath', { replace: true });
    }
  }, [navigate]);

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

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [pwStrength, setPwStrength] = useState('');
  const [pwScore, setPwScore] = useState(0); // 0-4
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // extra UI/submit states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // null | true | false
  const [output, setOutput] = useState('');
  const [savedData, setSavedData] = useState(null);

  const validators = {
    firstName: v => {
      const raw = v || '';
      if (!raw) return 'First name is required.';
      if (/\s/.test(raw)) return 'First name must be a single word with no spaces.';
      if (!/^[A-Za-z]+$/.test(raw)) return 'First name must contain letters only (no digits/symbols).';
      return '';
    },
    lastName: v => {
      const raw = v || '';
      if (!raw) return 'Last name is required.';
      if (/\s/.test(raw)) return 'Last name must be a single word with no spaces.';
      if (!/^[A-Za-z]+$/.test(raw)) return 'Last name must contain letters only (no digits/symbols).';
      return '';
    },
    phone: v => {
      if (!v.trim()) return 'Phone number is required.';
      const digits = v.replace(/\D/g, '');
      if (digits.length < 10) return 'Enter a valid 10-digit phone number.';
      if (digits.length > 10) return 'Enter only the 10-digit mobile number (do not include +91).';
      return '';
    },
    password: v => {
      if (!v) return 'Password is required.';
      if (v.length < 6) return 'Password must be at least 6 characters.';
      if (v.length > 15) return 'Password must be at most 15 characters.';
      const hasUpper = /[A-Z]/.test(v);
      const hasLower = /[a-z]/.test(v);
      const hasDigit = /[0-9]/.test(v);
      const hasSpecial = /[^A-Za-z0-9]/.test(v);
      if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
        return 'Password must include uppercase, lowercase, number and special character.';
      }
      return '';
    },
    confirmPassword: (v, all) => {
      if (!v) return 'Please confirm your password.';
      if (v !== all.password) return "Passwords don't match.";
      return '';
    }
  };

  // assess password strength
  const assessPassword = (pw) => {
    if (!pw) {
      setPwStrength('');
      setPwScore(0);
      return;
    }

    const length = pw.length;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasDigit = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);

    if (!hasUpper || !hasLower || !hasDigit || !hasSpecial || length < 6) {
      setPwStrength('Weak');
      setPwScore(1);
      return;
    }

    if (length === 6) {
      setPwStrength('Medium');
      setPwScore(2);
      return;
    }

    if (length >= 7 && length <= 10) {
      setPwStrength('Strong');
      setPwScore(3);
      return;
    }

    if (length >= 11 && length <= 15) {
      setPwStrength('Very Strong');
      setPwScore(4);
      return;
    }

    setPwStrength('Weak');
    setPwScore(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    const validator = validators[name];
    if (validator) {
      const err = name === 'confirmPassword' ? validator(value, newForm) : validator(value);
      setErrors(prev => ({ ...prev, [name]: err }));
    }

    if (name === 'password') {
      assessPassword(value);
      // revalidate confirm password as password changed
      const confirmErr = validators.confirmPassword(newForm.confirmPassword, newForm);
      setErrors(prev => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  // validate all fields and return {isValid, next}
  const validateAll = () => {
    const next = {};
    Object.keys(validators).forEach(key => {
      next[key] = key === 'confirmPassword'
        ? validators[key](form.confirmPassword, form)
        : validators[key](form[key]);
    });
    setErrors(next);
    const isValid = Object.values(next).every(v => v === '');
    return { isValid, next };
  };

  const mapField = (field) => {
    switch (field) {
      case 'firstName': return 1;
      case 'lastName': return 2;
      case 'phone': return 3;
      case 'password': return 5;
      case 'confirmPassword': return 6;
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

    // prepare payload: phone as digits (10-digit)
    const digitsOnlyPhone = form.phone.replace(/\D/g, '');
    const payload = {
      firstNameFFEnd: form.firstName.trim(),
      lastNameFFEnd: form.lastName.trim(),
      phoneNumberFFEnd: digitsOnlyPhone,
      passwordFFEnd: form.password
    };

    setLoading(true);

    try {
      const response = await axios.post(`${apiBase}/Operations/unVerifiedGASignUpPath`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response?.data?.success) {
        setSuccess(true);
        setOutput(response.data.message || 'Saved successfully.');
        setSavedData(response.data.data || null);

        // navigate after a short delay so user sees the success (optional)
        setTimeout(() => {
          navigate('/HomeScreenPath', { replace: true });
        }, 700);
      } else {
        setSuccess(false);
        setOutput(response?.data?.message || 'Operation failed.');
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      if (serverMsg && serverMsg.includes('Phone Number already existed')) {
        setSuccess(false);
        setOutput(serverMsg);
      } else if (err?.response) {
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

  // pwScore -> display percent and color
  const pwPercent = Math.round(Math.min(100, (pwScore / 4) * 100));
  const pwColor = pwScore <= 1 ? '#ff7b7b' : (pwScore === 2 ? '#ffd36b' : (pwScore === 3 ? '#ffb36b' : '#7ef08d'));

  const getValidityAttrs = (field) => {
    const val = form[field];
    const err = errors[field];
    if (err && err.length) return { 'aria-invalid': 'true', 'aria-valid': 'false' };
    if (val && !err) return { 'aria-invalid': 'false', 'aria-valid': 'true' };
    return { 'aria-invalid': 'false', 'aria-valid': 'false' };
  };

  return (
    <div id="divId1" className="signup-wrap">
      <h2 id="h2Id1" className="title">Artisan Sign Up</h2>

      <form id="formId1" onSubmit={handleSubmit} noValidate className="signup-form">

        {/* FIRST NAME */}
        <label id="labelId1" className="field-label">
          <div className="label-row">
            <span>First name</span>
            <span className="field-icon" aria-hidden="true">{!errors.firstName && form.firstName ? '✓' : (errors.firstName ? '⚠' : '')}</span>
          </div>
          <input
            id="inputId1"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
            {...getValidityAttrs('firstName')}
            className={errors.firstName ? 'input error' : 'input'}
          />
        </label>
        <div id="help_inputId1" className="helper">Enter your given name (letters only, single word — no spaces)</div>
        <div id="err_inputId1" className="err" role="alert" aria-live="polite">{errors.firstName}</div>

        {/* LAST NAME */}
        <label id="labelId2" className="field-label">
          <div className="label-row">
            <span>Last name</span>
            <span className="field-icon" aria-hidden="true">{!errors.lastName && form.lastName ? '✓' : (errors.lastName ? '⚠' : '')}</span>
          </div>
          <input
            id="inputId2"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
            {...getValidityAttrs('lastName')}
            className={errors.lastName ? 'input error' : 'input'}
          />
        </label>
        <div id="help_inputId2" className="helper">Enter your family name (letters only, single word — no spaces)</div>
        <div id="err_inputId2" className="err" role="alert" aria-live="polite">{errors.lastName}</div>

        {/* PHONE with +91 prefix shown */}
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
              maxLength={15}
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
        <div id="help_inputId5" className="helper">Password must be 6–15 chars and include uppercase, lowercase, a number and a special character.</div>

        {/* password strength */}
        <div id="pwStrength" className="pw-strength" aria-live="polite">{pwStrength ? `Strength: ${pwStrength}` : ''}</div>
        <div id="pwStrengthBarWrap" className="pw-bar-wrap" aria-hidden="true">
          <div id="pwStrengthBar" className="pw-bar" style={{ width: `${pwPercent}%`, backgroundColor: pwColor }} />
        </div>
        <div id="err_inputId5" className="err" role="alert" aria-live="polite">{errors.password}</div>

        {/* CONFIRM PASSWORD */}
        <label id="labelId6" className="field-label">
          <div className="label-row">
            <span>Confirm password</span>
            <span className="field-icon" aria-hidden="true">{!errors.confirmPassword && form.confirmPassword ? '✓' : (errors.confirmPassword ? '⚠' : '')}</span>
          </div>
          <div className="pw-wrap">
            <input
              id="inputId6"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              type={showConfirmPw ? 'text' : 'password'}
              {...getValidityAttrs('confirmPassword')}
              className={errors.confirmPassword ? 'input error' : 'input'}
            />
            <button
              type="button"
              id="eyeId2"
              aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
              onClick={() => setShowConfirmPw(s => !s)}
              className="pw-eye-btn"
            >
              {showConfirmPw ? EyeOpenIcon : EyeClosedIcon}
            </button>
          </div>
        </label>
        <div id="help_inputId6" className="helper">Re-type the password to confirm.</div>
        <div id="err_inputId6" className="err" role="alert" aria-live="polite">{errors.confirmPassword}</div>

        <div className="submit-row">
          <button id="btnId1" type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        <div id="signInHint">
          Already have an account?&nbsp;
          <button
            id="signInSpan"
            type="button"
            onClick={() => navigate('/SignInPath')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/SignInPath'); }}
            aria-label="Go to Sign In"
          >
            SignIn
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

export default SignUpScreen;
