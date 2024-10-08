// 이 파일은 교직원을 위한 대시보드 페이지를 구현합니다.
// 주요 기능으로는 공문서 작성과 학생 관리 페이지로의 네비게이션이 포함되어 있습니다.
// 각각의 기능은 별도의 컴포넌트로 구성되어 있으며, React Router의 useNavigate 훅을 사용하여 페이지 간 이동을 처리합니다.

import React from "react";
import { useNavigate } from "react-router-dom";
import "../ui/DashboardFaculty.css";

// Feature1 컴포넌트는 '공문서 작성' 기능을 제공하며, 해당 페이지로 이동하는 버튼을 포함하고 있습니다.
const Feature1 = () => {
  const navigate = useNavigate();
  return (
    <div className="feature feature1">
      <div className="content">
        <h2>공문서 작성을 쉽고 간편하게</h2>
        <button
          className="action-button"
          onClick={() => navigate("/facultydocument")}
        >
          바로가기
        </button>
      </div>
      <img
        src={`${process.env.PUBLIC_URL}/image.webp`}
        alt="Dynamic Typing Background"
        className="background-image"
      />
    </div>
  );
};

// Feature2 컴포넌트는 '학생 관리' 기능과 로그아웃 버튼을 제공합니다.
// 로그아웃 버튼을 클릭하면 메인 페이지로 이동합니다.
const Feature2 = () => {
  const navigate = useNavigate();
  return (
    <div className="feature feature2">
      <div className="feature2-header">
        <a className="logout-link" onClick={() => navigate("/")}>
          로그아웃
        </a>
      </div>
      <h2>학생 관리</h2>
      <button
        className="action-button"
        onClick={() => navigate("/studentmanagement")}
      >
        바로가기
      </button>
    </div>
  );
};

// DashboardFaculty 컴포넌트는 교직원을 위한 대시보드를 구성하며, 
// 각 기능을 나타내는 컴포넌트들을 포함합니다.
const DashboardFaculty = () => {
  return (
    <div className="dashboard-faculty">
      <div className="main-content">
        <div className="content">{/* 여기에 메인 컨텐츠를 추가 */}</div>
      </div>
    </div>
  );
};

export default DashboardFaculty;
