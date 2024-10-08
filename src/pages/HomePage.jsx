// 이 파일은 HomePage 컴포넌트로, 웹 애플리케이션의 메인 페이지를 구성합니다.
// 'Home' 컴포넌트를 불러와서 페이지의 주요 콘텐츠를 구성하며, 'home-container' 클래스를 사용하여 스타일을 적용합니다.
// 이 페이지는 사용자가 처음 접속할 때 보여지는 랜딩 페이지로, 주요 기능과 정보를 소개합니다.

import React from "react";
import "../ui/Home.css";
import Home from "../components/Home";

const HomePage = () => {
  return (
    <div className="home-container">
      <Home />
    </div>
  );
};

export default HomePage;
