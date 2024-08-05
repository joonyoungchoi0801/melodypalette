import React, { useState } from 'react';
import './SignupPopup.css';

function SignupPopup({ isOpen, onClose, openLoginPopup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [message, setMessage] = useState('');

  const sendEmailCode = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-email-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('인증 번호가 이메일로 전송되었습니다.');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('서버 오류');
    }
  };

  const verifyEmailCode = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: emailCode }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('서버 오류');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('회원가입 성공!');
        openLoginPopup(); // 로그인 팝업 열기
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('서버 오류');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="signup-popup-overlay">
      <div className="signup-popup">
        <button className="close-button" onClick={onClose}>X</button>
        <h2 className='signup'>회원가입</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="signup-username">ID(Email)</label>
            <div className="input-button-group">
              <input 
                type="text" 
                id="signup-username" 
                name="username" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <button type="button" className="send-email-code-button" onClick={sendEmailCode}>인증 번호 전송</button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email-code">이메일 인증 번호</label>
            <div className="input-button-group">
              <input 
                type="text" 
                id="email-code" 
                name="email-code" 
                value={emailCode} 
                onChange={(e) => setEmailCode(e.target.value)} 
              />
              <button type="button" className="verify-email-code-button" onClick={verifyEmailCode}>인증 확인</button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">비밀번호</label>
            <input 
              type="password" 
              id="signup-password" 
              name="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">비밀번호 확인</label>
            <input 
              type="password" 
              id="confirm-password" 
              name="confirm-password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="user-name">사용자 이름</label>
            <input 
              type="text" 
              id="user-name" 
              name="user-name" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <button type="submit" className="signup-button">회원가입</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default SignupPopup;
