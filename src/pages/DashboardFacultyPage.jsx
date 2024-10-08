// 이 파일은 DashboardFacultyPage 컴포넌트로, 교직원 대시보드를 렌더링하는 페이지 컴포넌트입니다.
// PageLayout 컴포넌트를 사용하여 페이지의 기본 레이아웃을 설정하고, 그 안에 DashboardFaculty 컴포넌트를 포함시킵니다.
// 이를 통해 교직원에게 필요한 기능을 제공하는 대시보드를 화면에 표시합니다.

import React from "react";
import DashboardFaculty from "../components/DashboardFaculty.jsx";
import "../ui/DashboardFaculty.css";
import PageLayout from "../components/PageLayout.jsx";

const DashboardFacultyPage = () => {
  return (
    <PageLayout>
      <div className="dashboard">
        <DashboardFaculty />
      </div>
    </PageLayout>
  );
};

export default DashboardFacultyPage;
