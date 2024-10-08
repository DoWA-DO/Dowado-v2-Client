// 이 파일은 React에서 인증 컨텍스트를 제공하는 코드입니다. 
// 사용자 유형, 인증 토큰, 이메일 등을 관리하고, 이를 하위 컴포넌트에 전달하여 인증 관련 상태를 유지합니다.

import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// AuthContext를 생성하여 전역적으로 사용 가능한 상태로 만들기
const AuthContext = createContext();

// AuthProvider 컴포넌트는 인증 관련 상태를 관리하고, 하위 컴포넌트에 제공
export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 사용자 유형: 'faculty' 또는 'student'
  const [authToken, setAuthToken] = useState(""); // 사용자 인증 토큰
  const [userEmail, setUserEmail] = useState(""); // 사용자 이메일
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 사용자 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");
    const type = localStorage.getItem("userType"); // 사용자 유형 가져오기
    if (token) {
      setAuthToken(token); // 가져온 토큰 설정
    }
    if (email) {
      setUserEmail(email); // 가져온 이메일 설정
    }
    if (type) {
      setUserType(type); // 사용자 유형 설정
    }
  }, []);

  // authToken이 변경될 때마다 로컬 스토리지에 저장하거나 제거
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  // userEmail이 변경될 때마다 로컬 스토리지에 저장하거나 제거
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail);
    } else {
      localStorage.removeItem("userEmail");
    }
  }, [userEmail]);

  // userType이 변경될 때마다 로컬 스토리지에 저장하거나 제거
  useEffect(() => {
    if (userType) {
      localStorage.setItem("userType", userType);
    } else {
      localStorage.removeItem("userType");
    }
  }, [userType]);

  // 로그아웃 함수: 모든 인증 정보를 초기화하고 로그인 페이지로 이동
  const logout = () => {
    setAuthToken("");
    setUserEmail("");
    setUserType(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userType");
    navigate("/"); // 로그인 페이지로 이동
  };

  return (
    <AuthContext.Provider
      value={{
        userType,
        setUserType,
        authToken,
        setAuthToken,
        userEmail,
        setUserEmail,
        logout, // 로그아웃 함수 제공
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅을 통해 AuthContext에 쉽게 접근 가능
export const useAuth = () => useContext(AuthContext);
