// SignupPage 컴포넌트는 사용자가 교직원 또는 학생으로 회원가입할 수 있는 폼을 제공합니다.
// 사용자가 선택한 사용자 유형에 따라 다른 회원가입 폼을 표시합니다.

import React, { useState } from "react";
import UserTypeSelector from "../components/UserTypeSelector";
import SignupFaculty from "../components/SignupFaculty";
import SignupStudent from "../components/SignupStudent";

const SignupPage = () => {
  const [userType, setUserType] = useState("teacher"); // 기본 사용자 유형을 '교직원'으로 설정

  // 사용자 유형 변경 시 호출되는 함수
  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  return (
    <div className="lg-container">
      <div className="lg-form">
        <h2>회원가입</h2>
        <UserTypeSelector userType={userType} onChange={handleUserTypeChange} />
        {/* 사용자 유형에 따라 다른 회원가입 폼 표시 */}
        {userType === "teacher" && <SignupFaculty />}
        {userType === "student" && <SignupStudent />}
      </div>
    </div>
  );
};

export default SignupPage;
