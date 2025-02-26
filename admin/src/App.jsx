import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = () => {
    const correctUsername = 'StyleShop';
    const correctPassword = 'U05CS22S';

    if (credentials.username === correctUsername && credentials.password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div>
      <Navbar />
      {!isAuthenticated ? (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '50px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '10px', 
          padding: '20px', 
          border: '1px solid #ccc', 
          borderRadius: '10px', 
          width: '300px', 
          margin: 'auto', 
          backgroundColor: '#f9f9f9' 
        }}>
          <h2 style={{ color: '#333' }}>Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            style={{ padding: '8px', width: '90%', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            style={{ padding: '8px', width: '90%', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button 
            onClick={handleLogin} 
            style={{ 
              padding: '10px', 
              width: '100%', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <Admin />
      )}
    </div>
  );
};

export default App;