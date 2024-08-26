import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');

    if (code) {
      fetch('http://localhost:5000/api/spotify/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), // POST 방식의 경우 body에 데이터를 담아서 보내야 합니다.
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem('access_token', data.access_token);
          navigate('/');
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      console.error('Authorization code is missing');
    }
  }, [navigate]);

  return (
    <div>
      <h2>로그인 처리 중...</h2>
    </div>
  );
}

export default Callback;
