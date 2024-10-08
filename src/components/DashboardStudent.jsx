// 이 파일은 학생을 위한 대시보드 페이지를 구현합니다.
// 학생들이 이용할 수 있는 주요 기능 및 정보를 표시하는 역할을 합니다.
// React Router의 useNavigate 훅을 사용하여 다른 페이지로의 이동을 처리합니다.

import React from "react";
import { useNavigate } from "react-router-dom";
import "../ui/DashboardStudent.css";

// DashboardStudent 컴포넌트는 학생 대시보드의 기본 구조를 정의합니다.
// 현재는 메인 컨텐츠를 추가할 수 있는 빈 영역을 포함하고 있으며,
// 추후 다양한 학생 관련 기능들이 이곳에 추가될 수 있습니다.
const DashboardStudent = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-student">
      <div className="main-content">
        <div className="content">
          {/* 여기에 메인 컨텐츠를 추가 */}
        </div>
      </div>
    </div>
  );
};

export default DashboardStudent;
