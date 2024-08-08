import React, { useState } from 'react';
import './LoginPopup.css';

function LoginPopup({ isOpen, onClose, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('로그인 성공!');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('서버 오류');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <button className="close-button" onClick={onClose}>X</button>
        <h2 className='login'>로그인</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">ID(Email)</label>
            <input type="text" id="login-username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input type="password" id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="login-button">로그인</button>
          <button type="submit" className="join-button" onClick={switchToSignup}>회원가입</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default LoginPopup;