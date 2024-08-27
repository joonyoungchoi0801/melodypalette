import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('access_token', data.access_token);
        login(data.access_token);
        navigate('/');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [login, navigate]);

  return (
    <div>
      <h2>로그인 처리 중...</h2>
    </div>
  );
}

export default Callback;