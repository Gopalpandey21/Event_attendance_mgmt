import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State for form toggle
  const [isNewUser, setIsNewUser] = useState(false);

  // Form fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error state
  const [error, setError] = useState('');

  const handleToggle = () => {
    setError('');
    setIsNewUser(prev => !prev);
    // Reset all fields
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- Signup Flow ---
    if (isNewUser) {
      if (!name || !email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong!');
        }

        console.log('Signup successful:', data);
        alert('Account created successfully! Please log in.');
        handleToggle();
        return; // <-- THE FIX: This stops the function from continuing to the login block

      } catch (err) {
        setError(err.message);
      }

    } else {
      // --- Login Flow ---
      if (!email || !password) {
        setError('Please fill in both email and password.');
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed.');
        }

        login(data);
        navigate('/events/dashboard');

      } catch (err) {
        setError(err.message);
      }
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '8px 0',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '10px',
      marginTop: '12px',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    toggleText: {
      marginTop: '15px',
      textAlign: 'center',
    },
    error: {
      color: 'red',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>{isNewUser ? 'Create Account' : 'Login'}</h2>

      <form onSubmit={handleSubmit}>
        {isNewUser && (
          <input
            type="text"
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isNewUser && (
          <input
            type="password"
            placeholder="Confirm Password"
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button type="submit" style={styles.button}>
          {isNewUser ? 'Sign Up' : 'Login'}
        </button>

        {error && <div style={styles.error}>{error}</div>}
      </form>

      <div style={styles.toggleText}>
        {isNewUser ? (
          <>
            Already have an account?{' '}
            <button type="button" onClick={handleToggle}>
              Login
            </button>
          </>
        ) : (
          <>
            New user?{' '}
            <button type="button" onClick={handleToggle}>
              Create account
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;