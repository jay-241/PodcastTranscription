import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';
function Registration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleRegistration = async (e) => {
    e.preventDefault();

    // Replace 'YOUR_API_ENDPOINT' with the actual URL of your API Gateway endpoint.
    const apiUrl = `${process.env.REACT_APP_API}/users`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'register',
          email: email,
          name: name,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage(data.message);
        navigate('/');
        // You can redirect the user to their account dashboard or another page here.
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('An error occurred during registration.');
    }
  };

  return (
    <div className="registration-container">
      <h1 className="registration-heading">User Registration</h1>
      <form className="registration-form" onSubmit={handleRegistration}>
        <label className="registration-label" htmlFor="name">
          Name:
        </label>
        <input
          className="registration-input"
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
  
        <label className="registration-label" htmlFor="email">
          Email:
        </label>
        <input
          className="registration-input"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
  
        <label className="registration-label" htmlFor="password">
          Password:
        </label>
        <input
          className="registration-input"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
  
        <button className="registration-button" type="submit">
          Register
        </button>
      </form>
  
      <div className="registration-message">{message}</div>
    </div>
  );
  
}

export default Registration;
