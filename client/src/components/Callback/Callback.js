import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Callback.css'

function Callback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');

    fetch('http://localhost:5000/api/spotify/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${err.error}`);
          });
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('access_token', data.access_token);
        login(data.access_token);
        navigate('/');
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
  }, [login, navigate]);

  return (
    <div className="callback-container">
      <h2>로그인 처리 중...</h2>
    </div>
  );
}

export default Callback;
