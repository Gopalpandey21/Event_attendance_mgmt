import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // FIX: 1. Import useAuth

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold login errors
  const navigate = useNavigate();
  const { login } = useAuth(); // FIX: 2. Get the login function from context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await fetch('http://localhost:5000/api/users/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server sends an error (e.g., wrong password, not an admin)
        throw new Error(data.message || 'Login failed.');
      }

      // FIX: 3. Save the admin's data to the global context
      login(data);

      // Redirect to the admin dashboard upon successful login
      navigate('/admin/dashboard');

    } catch (err) {
      // Set the error message to display to the user
      setError(err.message);
    }
  };
  
  // --- Styles (no changes) ---
  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa' },
    formWrapper: { display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '350px' },
    header: { textAlign: 'center', marginBottom: '1rem', color: '#343a40' },
    input: { padding: '0.8rem', borderRadius: '5px', border: '1px solid #ced4da', fontSize: '16px' },
    button: { padding: '0.8rem', cursor: 'pointer', backgroundColor: '#343a40', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px' },
    error: { color: 'red', textAlign: 'center', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.formWrapper}>
        <h2 style={styles.header}>Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
        {/* Display the error message if it exists */}
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default AdminLoginPage;