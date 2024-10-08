// 이 파일은 사용자가 과거 챗봇과의 대화 내용을 확인할 수 있는 인터페이스를 제공합니다.
// 이 컴포넌트는 주어진 session_id와 chat_student_email, chat_status를 기반으로 서버에서 대화 기록을 가져와서 화면에 표시합니다.
// 사용자는 이전 화면으로 돌아갈 수 있으며, 사용자 유형에 따라 다른 페이지로 리디렉션됩니다.

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ui/Chatbot.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ChatbotDetailPage = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { userType: contextUserType } = useAuth();
  const { chat_session_id, chat_student_email, userType } = location.state || {};
  const finalUserType = userType || contextUserType;

  useEffect(() => {
    if (chat_session_id && chat_student_email) {
      fetchChatContent(chat_session_id);
    }
  }, [chat_session_id, chat_student_email]);

  const fetchChatContent = async (sessionId) => {
    try {
      const response = await axios.get(`http://localhost:8000/careerchat/chat/content`, {
        params: { session_id: sessionId, },
      });
      const chatData = JSON.parse(response.data.chat_content);
      const formattedMessages = [];

      // 각 쿼리와 응답을 분리하여 메시지 배열에 추가
      chatData.forEach(({ query, response }) => {
        formattedMessages.push({ text: query, isBot: false });
        formattedMessages.push({ text: response, isBot: true });
      });

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching chat content:", error);
    }
  };

  const handleBackClick = () => {
    if (userType === "faculty") {
      navigate("/studentlog"); // 교직원용 상담 기록 목록 페이지
    } else if (userType === "student") {
      navigate("/studentchat"); // 학생용 상담 기록 목록 페이지
    } else {
      navigate("/"); // 기본 경로
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <button className="back-btn" onClick={handleBackClick}>
          <FaArrowLeft size="20" />
        </button>
      </div>
      <div className="chatbot-messages">
        <div className="chatbot-messages-wrapper">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chatbot-message-wrapper ${msg.isBot ? "bot" : "user"}`}
            >
              <div className={`chatbot-message ${msg.isBot ? "bot" : "user"}`}>
                <div className="text" style={{ whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatbotDetailPage;
