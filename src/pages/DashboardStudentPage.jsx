// 이 파일은 DashboardStudentPage 컴포넌트로, 학생 대시보드를 렌더링하는 페이지 컴포넌트입니다.
// PageLayout 컴포넌트를 사용하여 페이지의 기본 레이아웃을 설정하고, 그 안에 DashboardStudent 컴포넌트를 포함시킵니다.
// 이를 통해 학생에게 필요한 기능과 정보를 제공하는 대시보드를 화면에 표시합니다.

import React from "react";
import DashboardStudent from "../components/DashboardStudent.jsx";
import "../ui/DashboardStudent.css";
import PageLayout from "../components/PageLayout.jsx";

const DashboardStudentPage = () => {
  return (
    <PageLayout>
      <div className="dashboard">
        <DashboardStudent />
      </div>
    </PageLayout>
  );
};

export default DashboardStudentPage;
