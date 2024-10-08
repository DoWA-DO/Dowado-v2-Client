// 이 파일은 Home 컴포넌트를 정의하며, 타이핑 애니메이션과 함께 'DoWA:DO' 서비스의 시작 페이지를 제공합니다.
// 사용자에게 '시작하기' 버튼을 클릭하여 로그인 페이지로 이동하도록 안내합니다.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(""); // 타이핑 애니메이션을 위한 상태 추가

  // 텍스트 타이핑 애니메이션을 처리하는 useEffect 훅
  useEffect(() => {
    const writeText = (text) => {
      let lines = text.split("\n");
      let currentLine = 0;
      let currentText = "";

      // 애니메이션 효과를 위해 일정 간격으로 텍스트 추가
      const interval = setInterval(() => {
        if (currentLine < lines.length) {
          currentText += lines[currentLine].charAt(0); // 한 글자씩 추가
          setContent(currentText); // 상태 업데이트
          lines[currentLine] = lines[currentLine].substring(1);
          if (lines[currentLine].length === 0) {
            currentLine++;
            currentText += "\n"; // 줄바꿈 추가
          }
        } else {
          clearInterval(interval); // 모든 텍스트가 입력되면 애니메이션 종료
        }
      }, 80);

      return () => clearInterval(interval);
    };

    writeText(`
도와도와 함께 진로 상담을 해보세요!`); // 타이핑 애니메이션으로 표시할 텍스트
  }, []);

  // '시작하기' 버튼 클릭 시 호출되는 함수
  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="inner">
        <div className="home-logo-container">
          <img
            src={`${process.env.PUBLIC_URL}/DoWADo_logo.png`}
            alt="Logo"
            className="home-logo"
          />
        </div>
        <div className="home-content-container">
          <h2 className="home-title">DoWA:DO</h2>
          <div className="home-content">{content}|</div>
          <button className="start-btn" onClick={handleClick}>
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
