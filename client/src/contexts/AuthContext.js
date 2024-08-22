import React, { createContext, useState, useContext } from 'react';

// Context 생성
const AuthContext = createContext();

// Context 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  const setProfile = (profile) => {
    setUserProfile(profile);
  };

  const logout = () => {
    setUserProfile(null);
    window.location.href = 'http://localhost:5000/api/spotify/logout';
  };

  return (
    <AuthContext.Provider value={{ userProfile, setProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context를 사용하는 커스텀 훅
export const useAuth = () => useContext(AuthContext);
