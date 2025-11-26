// SignUpScreen.jsx
import './SignUpScreenCSS.css';
import React, { useState } from 'react';

const SignUpScreen = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [pwStrength, setPwStrength] = useState(''); // '', 'Weak', 'Medium', 'Strong'
  const [pwScore, setPwScore] = useState(0); // 0-4
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // validators
  const validators = {
    // Validate raw input: no whitespace anywhere, only ASCII letters, single word
    firstName: v => {
      const raw = v || '';
      if (!raw) return 'First name is required.';
      if (/\s/.test(raw)) return 'First name must be a single word with no spaces.';
      // /^[A-Za-z]+$/ allows only English letters; change to /^\p{L}+$/u for unicode letters (accents)
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
    email: v => {
      if (!v.trim()) return 'Email is required.';
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v) ? '' : 'Enter a valid email address.';
    },
    password: v => {
      if (!v) return 'Password is required.';
      if (v.length < 6) return 'Password must be at least 6 characters.';
      return '';
    },
    confirmPassword: (v, all) => {
      if (!v) return 'Please confirm your password.';
      if (v !== all.password) return "Passwords don't match.";
      return '';
    }
  };

  // asses password strength
  const assessPassword = (pw) => {
    if (!pw) {
      setPwStrength('');
      setPwScore(0);
      return;
    }
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    setPwScore(score);
    if (score <= 1) setPwStrength('Weak');
    else if (score <= 3) setPwStrength('Medium');
    else setPwStrength('Strong');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    // live validation for this field
    const validator = validators[name];
    if (validator) {
      const err = name === 'confirmPassword' ? validator(value, newForm) : validator(value);
      setErrors(prev => ({ ...prev, [name]: err }));
    }

    // update password strength and revalidate confirm password if needed
    if (name === 'password') {
      assessPassword(value);
      // revalidate confirm
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
      // focus first invalid input (use current errors after validateAll)
      const firstInvalid = Object.keys(errors).find(k => errors[k]);
      if (firstInvalid) {
        const id = `inputId${mapField(firstInvalid)}`;
        const el = document.getElementById(id);
        if (el) el.focus();
      }
      return;
    }
    // submit placeholder
    console.log('SignUp data:', form);
    alert('Form submitted (check console).');
  };

  const mapField = (field) => {
    switch (field) {
      case 'firstName': return 1;
      case 'lastName': return 2;
      case 'phone': return 3;
      case 'email': return 4;
      case 'password': return 5;
      case 'confirmPassword': return 6;
      default: return '';
    }
  };

  // helper to compute progress width and color
  const pwPercent = Math.min(100, (pwScore / 4) * 100);
  const pwColor = pwScore <= 1 ? '#ff7b7b' : (pwScore <= 3 ? '#ffd36b' : '#7ef08d');

  // set aria-valid / aria-invalid attributes for inputs
  const getValidityAttrs = (field) => {
    const val = form[field];
    const err = errors[field];
    if (err && err.length) {
      return { 'aria-invalid': 'true', 'aria-valid': 'false' };
    }
    if (val && !err) {
      return { 'aria-invalid': 'false', 'aria-valid': 'true' };
    }
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

        {/* PHONE */}
        <label id="labelId3">
          Phone number
          <span id="icon_inputId3" aria-hidden="true">{!errors.phone && form.phone ? '✓' : (errors.phone ? '⚠' : '')}</span>
          <input
            id="inputId3"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone number"
            inputMode="tel"
            minLength={10}
            maxLength={10}
            {...getValidityAttrs('phone')}
            />
        </label>
        <div id="help_inputId3">Do not include country code</div>
        <div id="err_inputId3" role="alert" aria-live="polite">{errors.phone}</div>

        {/* EMAIL */}
        <label id="labelId4">
          Email
          <span id="icon_inputId4" aria-hidden="true">{!errors.email && form.email ? '✓' : (errors.email ? '⚠' : '')}</span>
          <input
            id="inputId4"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            {...getValidityAttrs('email')}
            />
        </label>
        <div id="help_inputId4">We'll send account-related emails to this address.</div>
        <div id="err_inputId4" role="alert" aria-live="polite">{errors.email}</div>

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
              {...getValidityAttrs('password')}
              />
            {/* eye button */}
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
        <div id="help_inputId5">Min 6 characters. Use upper, numbers, symbols for stronger passwords.</div>

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
