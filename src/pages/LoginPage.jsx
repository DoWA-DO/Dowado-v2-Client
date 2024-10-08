// 이 파일은 LoginPage 컴포넌트로, 웹 애플리케이션의 로그인 페이지를 구성합니다.
// 'LoginForm' 컴포넌트를 사용하여 사용자가 로그인할 수 있는 폼을 제공하며,
// 'lg-container'와 'lg-form' 클래스를 사용하여 페이지의 레이아웃과 스타일을 정의합니다.
// 사용자는 이 페이지에서 이메일과 비밀번호를 입력하여 애플리케이션에 로그인할 수 있습니다.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/Login.css";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="lg-container">
      <div className="lg-form">
        <h2>로그인</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
