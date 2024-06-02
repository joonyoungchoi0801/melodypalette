import React from 'react';
import './SignupPopup.css';
function SignupPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="signup-popup-overlay">
      <div className="signup-popup">
        <button className="close-button" onClick={onClose}>X</button>
        <h2 className='signup'>회원가입</h2>
        <form>
          <div className="form-group">
            <label htmlFor="signup-username">ID(Email)</label>
            <div className="input-button-group">
              <input type="text" id="signup-username" name="username" />
              <button type="button" className="check-duplicate-button">중복확인</button>
              <button type="button" className="send-email-code-button">인증 번호 전송</button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email-code">이메일 인증 번호</label>
            <div className="input-button-group">
              <input type="text" id="email-code" name="email-code" />
              <button type="button" className="verify-email-code-button">인증 확인</button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">비밀번호</label>
            <input type="password" id="signup-password" name="password" />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">비밀번호 확인</label>
            <input type="password" id="confirm-password" name="confirm-password" />
          </div>
          <div className="form-group">
            <label htmlFor="user-name">사용자 이름</label>
            <input type="text" id="user-name" name="user-name" />
          </div>
          <button type="submit" className="signup-button">회원가입</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPopup;