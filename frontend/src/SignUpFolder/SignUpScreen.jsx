// SignUpScreen.jsx
import './SignUpScreenCSS.css';
import React, { useState } from 'react';

const SignUpScreen = () => {
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
  const [pwScore, setPwScore] = useState(0); // 0-4 mapped to percent
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

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
      if (digits.length < 10) return 'Enter a valid phone number.';
      return '';
    },
    password: v => {
      if (!v) return 'Password is required.';
      if (v.length < 6) return 'Password must be at least 6 characters.';
      if (v.length > 15) return 'Password must be at most 15 characters.';
      // required categories
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

  // assess password strength according to the rules you requested
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

    // If any required category missing or too short -> Weak
    if (!hasUpper || !hasLower || !hasDigit || !hasSpecial || length < 6) {
      setPwStrength('Weak');
      setPwScore(1);
      return;
    }

    // All categories present here; decide Medium/Strong/Very Strong by length
    if (length === 6) {
      setPwStrength('Medium');
      setPwScore(2);
      return;
    }

    // Interpret "Strong - >7<11" as length 7..10 (inclusive)
    if (length >= 7 && length <= 10) {
      setPwStrength('Strong');
      setPwScore(3);
      return;
    }

    // length 11..15 (max allowed) -> Very Strong
    if (length >= 11 && length <= 15) {
      setPwStrength('Very Strong');
      setPwScore(4);
      return;
    }

    // Fallback: treat anything else as Weak
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

  const validateAll = () => {
    const next = {};
    Object.keys(validators).forEach(key => {
      next[key] = key === 'confirmPassword'
        ? validators[key](form.confirmPassword, form)
        : validators[key](form[key]);
    });
    setErrors(next);
    return Object.values(next).every(v => v === '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) {
      // focus first invalid input using updated errors
      const firstInvalid = Object.keys(errors).find(k => errors[k]);
      if (firstInvalid) {
        const id = `inputId${mapField(firstInvalid)}`;
        const el = document.getElementById(id);
        if (el) el.focus();
      }
      return;
    }
    // Prepare submission (note: backend might expect full +91 prefix — you can prepend on send)
    console.log('SignUp data:', form);
    alert('Form submitted (check console).');
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

  // map pwScore [0..4] → percent and color
  const pwPercent = Math.min(100, (pwScore / 4) * 100);
  const pwColor = pwScore <= 1 ? '#ff7b7b' : (pwScore === 2 ? '#ffd36b' : (pwScore === 3 ? '#ffd36b' : '#7ef08d'));

  const getValidityAttrs = (field) => {
    const val = form[field];
    const err = errors[field];
    if (err && err.length) return { 'aria-invalid': 'true', 'aria-valid': 'false' };
    if (val && !err) return { 'aria-invalid': 'false', 'aria-valid': 'true' };
    return { 'aria-invalid': 'false', 'aria-valid': 'false' };
  };

  return (
    <div id="divId1">
      <h2 id="h2Id1">Artisan Sign Up</h2>

      <form id="formId1" onSubmit={handleSubmit} noValidate>

        {/* FIRST NAME */}
        <label id="labelId1">
          First name
          <span id="icon_inputId1" aria-hidden="true">{!errors.firstName && form.firstName ? '✓' : (errors.firstName ? '⚠' : '')}</span>
          <input
            id="inputId1"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
            {...getValidityAttrs('firstName')}
          />
        </label>
        <div id="help_inputId1">Enter your given name (letters only, single word — no spaces)</div>
        <div id="err_inputId1" role="alert" aria-live="polite">{errors.firstName}</div>

        {/* LAST NAME */}
        <label id="labelId2">
          Last name
          <span id="icon_inputId2" aria-hidden="true">{!errors.lastName && form.lastName ? '✓' : (errors.lastName ? '⚠' : '')}</span>
          <input
            id="inputId2"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
            {...getValidityAttrs('lastName')}
          />
        </label>
        <div id="help_inputId2">Enter your family name (letters only, single word — no spaces)</div>
        <div id="err_inputId2" role="alert" aria-live="polite">{errors.lastName}</div>

        {/* PHONE with fixed +91 prefix */}
        <label id="labelId3">
          Phone number
          <span id="icon_inputId3" aria-hidden="true">{!errors.phone && form.phone ? '✓' : (errors.phone ? '⚠' : '')}</span>

          <div id="phoneWrapId">
            <span id="phonePrefixId" aria-hidden="true">+91</span>

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
            />
          </div>
        </label>
        <div id="help_inputId3">Enter the 10-digit mobile number only (do not type +91). Example: 9876543210</div>
        <div id="err_inputId3" role="alert" aria-live="polite">{errors.phone}</div>

        {/* PASSWORD */}
        <label id="labelId5">
          Password
          <span id="icon_inputId5" aria-hidden="true">{!errors.password && form.password ? '✓' : (errors.password ? '⚠' : '')}</span>
          <div id="pwWrap" style={{ position: 'relative' }}>
            <input
              id="inputId5"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              type={showPw ? 'text' : 'password'}
              maxLength={15}
              {...getValidityAttrs('password')}
            />
            <button
              type="button"
              id="eyeId1"
              aria-label={showPw ? 'Hide password' : 'Show password'}
              onClick={() => setShowPw(s => !s)}
            >
              {showPw ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </label>
        <div id="help_inputId5">
          Password must be 6–15 chars and include uppercase, lowercase, a number and a special character.
        </div>

        {/* password strength meter */}
        <div id="pwStrength" aria-live="polite">
          {pwStrength ? `Strength: ${pwStrength}` : ''}
        </div>
        <div id="pwStrengthBarWrap" aria-hidden="true">
          <div id="pwStrengthBar" style={{ width: `${pwPercent}%`, backgroundColor: pwColor }} />
        </div>
        <div id="err_inputId5" role="alert" aria-live="polite">{errors.password}</div>

        {/* CONFIRM PASSWORD */}
        <label id="labelId6">
          Confirm password
          <span id="icon_inputId6" aria-hidden="true">{!errors.confirmPassword && form.confirmPassword ? '✓' : (errors.confirmPassword ? '⚠' : '')}</span>
          <div style={{ position: 'relative' }}>
            <input
              id="inputId6"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              type={showConfirmPw ? 'text' : 'password'}
              {...getValidityAttrs('confirmPassword')}
            />
            <button
              type="button"
              id="eyeId2"
              aria-label={showConfirmPw ? 'Hide password' : 'Show password'}
              onClick={() => setShowConfirmPw(s => !s)}
            >
              {showConfirmPw ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </label>
        <div id="help_inputId6">Re-type the password to confirm.</div>
        <div id="err_inputId6" role="alert" aria-live="polite">{errors.confirmPassword}</div>

        <button id="btnId1" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignUpScreen;
