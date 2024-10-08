import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import UserTypeSelector from "./UserTypeSelector";

const LoginForm = () => {
  const [userType, setUserType] = useState(
    () => localStorage.getItem("rememberedUserType") || "teacher"
  );
  const [username, setUsername] = useState(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedUserType = localStorage.getItem("rememberedUserType");
    return rememberedEmail && rememberedUserType === userType
      ? rememberedEmail
      : "";
  });
  const [password, setPassword] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [pwErrorMessage, setPwErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem("rememberMe") === "true"
  );
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setUserType: setAuthUserType,
    setAuthToken,
    setUserEmail,
  } = useAuth();

  useEffect(() => {
    const handleUserTypeChange = (e) => {
      setUserType(e.target.value);
      setUsername("");
      setErrorMessage("");
    };

    const handleEmailChange = (e) => {
      setUsername(e.target.value);
      setEmailErrorMessage("");
    };

    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
      setPwErrorMessage("");
    };

    const handleRememberMeChange = (e) => {
      setRememberMe(e.target.checked);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailErrorMessage("");
    setPwErrorMessage("");
    setErrorMessage("");

    if (!username) {
      setEmailErrorMessage("이메일을 입력해주세요.");
      return;
    }

    if (!password) {
      setPwErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        new URLSearchParams({
          username: username,  // 변경된 부분
          password: password,
          scope: userType,  // scope를 userType으로 설정
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        const token = response.data.access_token;
        const userEmail = username;

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", username);
          localStorage.setItem("rememberedUserType", userType);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedUserType");
          localStorage.removeItem("rememberMe");
        }

        setAuthUserType(userType);
        setAuthToken(token);
        setUserEmail(userEmail);
        localStorage.setItem("userEmail", userEmail);

        if (userType === "teacher") {
          navigate("/studentlog");
        } else if (userType === "student") {
          navigate("/studentchat");
        }
      }
    } catch (error) {
      setPassword("");
      setErrorMessage("이메일과 비밀번호를 확인해주세요!");
      console.error("Login failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <UserTypeSelector
        userType={userType}
        onChange={(e) => setUserType(e.target.value)}
      />
      <div className="lg-form-group">
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="user@example.com"
          value={username}  // 변경된 부분
          onChange={(e) => setUsername(e.target.value)}  // 변경된 부분
        />
        {emailErrorMessage && (
          <p className="error-message">{emailErrorMessage}</p>
        )}
      </div>
      <div className="lg-form-group">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {pwErrorMessage && <p className="error-message">{pwErrorMessage}</p>}
      </div>
      <div className="user-type-group">
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          이메일 기억하기
        </label>
      </div>
      <button type="submit" className="login-button">
        Login
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="signup-link">
        처음이신가요? <a href="/signup">회원가입</a>
      </div>
    </form>
  );
};

export default LoginForm;
