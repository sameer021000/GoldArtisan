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

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation example (you can extend)
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // For now just log; later you'll hook this to backend API
    console.log('SignUp data:', form);
    alert('Form submitted (check console)');
  };

  return (
    <div id="divId1">
      <h2 id="h2Id1">Artisan Sign Up</h2>
      <form id="formId1" onSubmit={handleSubmit} className="signup-form">
        <label id="labelId1">
          First name
          <input id="inputId1" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" />
        </label>

        <label id="labelId2">
          Last name
          <input id="inputId2" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" />
        </label>

        <label id="labelId3">
          Phone number
          <input id="inputId3" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" inputMode="tel" />
        </label>

        <label id="labelId4">
          Email
          <input id="inputId4" name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
        </label>

        <label id="labelId5">
          Password
          <input id="inputId5" name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" />
        </label>

        <label id="labelId6">
          Confirm password
          <input id="inputId6" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" type="password" />
        </label>

        <button id="btnId1" type="submit" className="signup-button">Submit</button>
      </form>
    </div>
  );
};

export default SignUpScreen;
