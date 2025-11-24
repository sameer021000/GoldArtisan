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

  const [pwStrength, setPwStrength] = useState(''); // 'Weak' | 'Medium' | 'Strong' | ''

  // simple validators
  const validators = {
    firstName: value => value.trim() ? '' : 'First name is required.',
    lastName: value => value.trim() ? '' : 'Last name is required.',
    phone: value => {
      if (!value.trim()) return 'Phone number is required.';
      const digits = value.replace(/\D/g, '');
      if (digits.length < 7) return 'Enter a valid phone number.';
      return '';
    },
    email: value => {
      if (!value.trim()) return 'Email is required.';
      // Basic email regex
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(value) ? '' : 'Enter a valid email address.';
    },
    password: value => {
      if (!value) return 'Password is required.';
      if (value.length < 6) return 'Password must be at least 6 characters.';
      return '';
    },
    confirmPassword: (value, all) => {
      if (!value) return 'Please confirm your password.';
      if (value !== all.password) return "Passwords don't match.";
      return '';
    }
  };

  // compute password strength
  const assessPasswordStrength = (pw) => {
    if (!pw) return '';
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return 'Weak';
    if (score === 2 || score === 3) return 'Medium';
    return 'Strong';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    // Validate this field live
    const validator = validators[name];
    if (validator) {
      const error = name === 'confirmPassword' ? validator(value, newForm) : validator(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    // update password strength if password changed
    if (name === 'password') {
      setPwStrength(assessPasswordStrength(value));
      // re-validate confirmPassword (in case user already filled it)
      const confirmError = validators.confirmPassword(form.confirmPassword, { ...newForm, password: value });
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validators).forEach(key => {
      const validator = validators[key];
      newErrors[key] = key === 'confirmPassword'
        ? validator(form.confirmPassword, form)
        : validator(form[key]);
    });
    setErrors(newErrors);
    // return whether there is any error
    return Object.values(newErrors).every(v => v === '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) {
      // focus the first error field (optional)
      const firstError = Object.keys(errors).find(k => errors[k]);
      if (firstError) {
        const el = document.querySelector(`#inputId${mapFieldToNumber(firstError)}`);
        if (el) el.focus();
      }
      return;
    }
    // submit (placeholder)
    console.log('SignUp data:', form);
    alert('Form submitted (check console)');
  };

  // small helper to map field name to id number suffix used in JSX
  const mapFieldToNumber = (field) => {
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

  return (
    <div id="divId1">
      <h2 id="h2Id1">Artisan Sign Up</h2>

      <form id="formId1" onSubmit={handleSubmit} noValidate>
        {/* First name */}
        <label id="labelId1">
          First name
          <input
            id="inputId1"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name" />
        </label>
        <div id="help_inputId1" aria-hidden="true">Enter your given name.</div>
        <div id="err_inputId1" role="alert" aria-live="polite">{errors.firstName}</div>

        {/* Last name */}
        <label id="labelId2">
          Last name
          <input
            id="inputId2"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name" />
        </label>
        <div id="help_inputId2" aria-hidden="true">Enter your family name.</div>
        <div id="err_inputId2" role="alert" aria-live="polite">{errors.lastName}</div>

        {/* Phone */}
        <label id="labelId3">
          Phone number
          <input
            id="inputId3"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone number"
            inputMode="tel" />
        </label>
        <div id="help_inputId3" aria-hidden="true">Include country code if applicable.</div>
        <div id="err_inputId3" role="alert" aria-live="polite">{errors.phone}</div>

        {/* Email */}
        <label id="labelId4">
          Email
          <input
            id="inputId4"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email" />
        </label>
        <div id="help_inputId4" aria-hidden="true">We'll send account-related emails to this address.</div>
        <div id="err_inputId4" role="alert" aria-live="polite">{errors.email}</div>

        {/* Password */}
        <label id="labelId5">
          Password
          <input
            id="inputId5"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type="password" />
        </label>
        <div id="help_inputId5" aria-hidden="true">Min 6 characters. Use upper, numbers, symbols for stronger passwords.</div>
        <div id="pwStrength" aria-hidden="true">{pwStrength ? `Strength: ${pwStrength}` : ''}</div>
        <div id="err_inputId5" role="alert" aria-live="polite">{errors.password}</div>

        {/* Confirm password */}
        <label id="labelId6">
          Confirm password
          <input
            id="inputId6"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            type="password" />
        </label>
        <div id="help_inputId6" aria-hidden="true">Re-type the password to confirm.</div>
        <div id="err_inputId6" role="alert" aria-live="polite">{errors.confirmPassword}</div>

        <button id="btnId1" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignUpScreen;
