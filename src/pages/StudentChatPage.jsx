// StudentChatPage 컴포넌트는 학생의 상담 기록을 보여주고, 새로운 상담을 시작할 수 있는 페이지입니다.
// 페이지 레이아웃과 상담 기록 컴포넌트를 포함하며, 상담 시작 버튼을 통해 챗봇 페이지로 이동할 수 있습니다.

import React from "react";
import ChatLogStudent from "../components/ChatLogStudent.jsx";
import PageLayout from "../components/PageLayout.jsx";
import "../ui/StudentChatPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const StudentChatPage = () => {
  const navigate = useNavigate();
  const { userEmail } = useAuth();

  // 상담을 시작하는 함수, 사용자의 이메일과 상태를 가지고 챗봇 페이지로 이동
  const handleStartChat = (chat_id, chat_student_email, chat_status) => {
    navigate("/chatbot", {
      state: {
        chat_id,
        chat_student_email,
        chat_status,
      },
    });
  };

  return (
    <PageLayout>
      <div className="chat-title">
        <div className="chat-page-name">상담 기록</div>
        <button
          className="chat-btn"
          onClick={() => handleStartChat(1, userEmail, 0)} // chat_id: 임의
        >
          상담하기
        </button>
      </div>
      <div className="chat-line"></div>
      <ChatLogStudent />
    </PageLayout>
  );
};

export default StudentChatPage;
