// 이 파일은 이메일 인증 기능을 구현한 React 컴포넌트입니다.
// 사용자는 이메일을 입력하고 인증 코드를 받아서 이메일 인증을 수행할 수 있습니다.
// 이메일 인증 코드를 입력하고 서버에서 발송된 코드와 일치하는지 확인하여 인증 상태를 업데이트합니다.

import React, { useState } from "react";
import axios from "axios";

const EmailAuthComponent = ({ email, setEmail, setIsVerified }) => {
  const [inputVerificationCode, setInputVerificationCode] = useState("");
  const [generatedVerificationCode, setGeneratedVerificationCode] =
    useState("");
  const [emailError, setEmailError] = useState(""); // 이메일 오류 메시지 상태
  const [verificationError, setVerificationError] = useState("");

  // 이메일 유효성 검사를 위한 정규식
  const validateEmail = (value) =>
    /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);

  // 이메일 인증을 처리하는 함수
  const handleEmailAuth = async () => {
    if (!email) {
      setEmailError("이메일을 입력해 주세요.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("유효한 이메일 주소를 입력해 주세요.");
      return;
    }
    try {
      console.log("Sending email to:", email);
      const response = await axios.post(
        "http://localhost:8000/api/v1/mail/send_email",
        { to_email: email }
      );

      if (response.status !== 200) {
        throw new Error("이메일 인증에 실패했습니다.");
      }

      setGeneratedVerificationCode(response.data.verification_code);
      alert("인증 이메일이 발송되었습니다.");
      setEmailError(""); // 성공 시 에러 메시지 초기화
    } catch (error) {
      console.error("Email Auth Error:", error);
      setEmailError("이메일 인증 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  // 인증 코드 입력 처리 함수
  const handleVerificationCodeChange = (e) => {
    setInputVerificationCode(e.target.value);
  };

  // 인증 코드 제출 처리 함수
  const handleVerificationCodeSubmit = (e) => {
    e.preventDefault();
    if (inputVerificationCode === generatedVerificationCode) {
      setIsVerified(true);
      setVerificationError(""); // 성공 시 에러 메시지 초기화
      alert("이메일 인증이 완료되었습니다.");
    } else {
      setIsVerified(false);
      setVerificationError("인증 코드가 올바르지 않습니다.");
    }
  };

  return (
    <>
      <div className="lg-form-group" id="email-form">
        <label htmlFor="teacher_email">이메일</label>
        <div className="email-input">
          <input
            type="email"
            id="teacher_email"
            name="teacher_email"
            value={email}
            placeholder="user@example.com"
            onChange={(e) => {
              setEmail(e.target.value);
              if (!validateEmail(e.target.value)) {
                setEmailError("유효한 이메일 주소를 입력해 주세요.");
              } else {
                setEmailError("");
              }
            }}
            onBlur={() => {
              if (!email) {
                setEmailError("이메일을 입력해 주세요.");
              }
            }}
          />
          <button type="button" onClick={handleEmailAuth}>
            이메일 인증
          </button>
        </div>
        {emailError && <div className="error-message">{emailError}</div>}
      </div>
      <div className="lg-form-group">
        <label htmlFor="verification-code">인증번호</label>
        <div className="email-input">
          <input
            type="text"
            id="verification-code"
            name="verification-code"
            value={inputVerificationCode}
            placeholder="인증번호"
            onChange={handleVerificationCodeChange}
          />
          <button type="button" onClick={handleVerificationCodeSubmit}>
            인증 확인
          </button>
        </div>
        {verificationError && (
          <div className="error-message">{verificationError}</div>
        )}
      </div>
    </>
  );
};

export default EmailAuthComponent;
