// 이 파일은 ChatbotPage 컴포넌트로, 사용자와 챗봇 간의 대화를 처리하는 기능을 포함하고 있습니다.
// 사용자 입력을 받아 챗봇에 전송하고, 챗봇의 응답을 화면에 표시합니다. 또한, 사용자는 대화 내용을 저장하거나,
// 보고서를 생성할 수 있습니다. UI는 메시지 입력창과 메시지 표시 영역, 로딩 상태 등을 관리합니다.

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../ui/Chatbot.css";
import { FaArrowUp, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../components/AuthContext";
import { PulseLoader, PuffLoader } from "react-spinners";


const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);              // 챗봇과의 대화를 저장하는 상태
  const [input, setInput] = useState("");                    // 사용자 입력을 관리하는 상태
  const [sessionId, setSessionId] = useState(null);          // 챗봇 세션 ID를 저장하는 상태
  const [loading, setLoading] = useState(false);             // 메시지 로딩 상태
  const [reportLoading, setReportLoading] = useState(false); // 보고서 생성 로딩 상태
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { authToken, userType } = useAuth();
  const location = useLocation();

  // 챗봇 세션 생성
  const createChatbotSession = useCallback(async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/careerchat/new-session",
        null,
        {
          headers: { Authorization: `Bearer ${authToken}`, },
          params: { token: authToken, },
        }
      );
      console.log("Session creation response:", response.data);
      return response.data.session_id;
    } catch (error) {
      console.error("Error creating chatbot session:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  }, [authToken]);


  // 기존 채팅 세션 가져오기 
  const fetchChatHistory = useCallback(async (sessionId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/careerchat/chat/content`,
        {
          headers: { Authorization: `Bearer ${authToken}`, },
          params: { session_id: sessionId, },
        }
      );

      // 서버에서 받아온 데이터가 JSON 형식의 문자열이라면 파싱
      const chatData = JSON.parse(response.data.chat_content);

      // 각 쿼리와 응답을 분리하여 메시지 배열에 추가
      const formattedMessages = chatData.map(({ query, response }) => [
        {
          text: query,
          isBot: false,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) // 현재 시간으로 설정
        },
        {
          text: response,
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) // 현재 시간으로 설정
        }
      ]).flat(); // 이중 배열을 평탄화하여 하나의 배열로 만듦

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  }, [authToken]);



  useEffect(() => {
    const initiateChatSession = async () => {
      try {
        if (location.state && location.state.chat_session_id) {
          const sessionId = location.state.chat_session_id;
          setSessionId(sessionId);
          await fetchChatHistory(sessionId); // 이전 대화 내용 불러오기
        } else if (!sessionId) {
          // 새로운 세션 생성
          const newSessionId = await createChatbotSession();
          setSessionId(newSessionId);
        }
      } catch (error) {
        console.error("Error initiating chat session:", error);
      }
    };

    if (authToken) {
      console.log("Auth Token found: ", authToken);
      initiateChatSession();
    } else {
      console.error("Auth token is missing");
    }
  }, [authToken, location.state, sessionId, createChatbotSession, fetchChatHistory]);



  // 챗봇에게 쿼리 전송
  const createChatbotMessage = async (sessionId, inputQuery) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/careerchat/chat",
        {},
        {
          headers: { Authorization: `Bearer ${authToken}`, },
          params: {
            session_id: sessionId,
            input_query: inputQuery,
            token: authToken,
          },
        }
      );
      return response.data.response; // 챗봇의 응답 텍스트 반환
    } catch (error) {
      console.error("Error creating chatbot message:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  };


  // 채팅 기록 저장
  const saveChatlog = async (sessionId) => {
    try {
      console.log("sessionid: ", sessionId);
      await axios.post(
        "http://localhost:8000/careerchat/save-chatlog",
        null,
        {
          headers: { Authorization: `Bearer ${authToken}`, },
          params: {
            session_id: sessionId,
            token: authToken,
          },
        });
    } catch (error) {
      console.error("Error saving chat log:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  };


  // 레포트 생성 
  const getReport = async (sessionId) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/report/predict",
        null,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          params: { session_id: sessionId }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting report:", error);
      throw error;
    }
  };


  // 
  const handleSendMessage = async () => {
    if (input.trim() !== "") {
      const userMessage = {
        text: input,
        isBot: false,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      setLoading(true); // 메시지 로딩 시작

      try {
        const botResponse = await createChatbotMessage(sessionId, input); // 챗봇에 메시지 전송
        const botMessage = {
          text: botResponse,
          isBot: true,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error sending message to chatbot:", error);
      } finally {
        setLoading(false); // 메시지 로딩 종료
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // 메시지 화면 자동 스크롤
  }, [messages]);


  // 
  const handleSaveChatlog = async () => {
    try {
      await saveChatlog(sessionId); // 대화 로그 저장
    } catch (error) {
      console.error("Error saving chat log:", error);
    }
  };


  // 
  const handleReportClick = async () => {
    try {
      setReportLoading(true);
      const reportData = await getReport(sessionId); // 진로 추천 데이터 요청
      navigate("/report", { state: { reportData } }); // Report 페이지로 이동
    } catch (error) {
      console.error("Error getting report:", error);
    } finally {
      setReportLoading(false); // 로딩 종료
    }
  };


  //
  const handleInputChange = (e) => {
    setInput(e.target.value); // 사용자 입력 상태 업데이트
  };

  //
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(); // Enter 키로 메시지 전송
    }
  };

  //
  const handleBackClick = async () => {
    try {
      console.log("back click");
      await handleSaveChatlog(); // 뒤로 가기 전에 대화 로그 저장
    } catch (error) {
      console.error("Error saving chat log on back click:", error);
    } finally {
      if (userType === "faculty") {
        navigate("/studentlog"); // 교직원의 경우 학생 로그 페이지로 이동
      } else if (userType === "student") {
        navigate("/studentchat"); // 학생의 경우 학생 채팅 페이지로 이동
      }
    }
  };


  // 
  return (
    <div className="chatbot-container">
      {reportLoading && (
        <div className="loading-overlay">
          <PuffLoader color="#36d7b7" size={150} />
        </div>
      )}
      <div className={`chatbot-header ${reportLoading ? "hidden" : ""}`}>
        <button className="back-btn" onClick={handleBackClick}>
          <FaArrowLeft size="20" />
        </button>
        <button
          className="report-btn"
          onClick={handleReportClick}
          disabled={reportLoading}
        >
          레포트 생성
        </button>
      </div>
      <div className={`chatbot-messages ${reportLoading ? "hidden" : ""}`}>
        <div className="chatbot-messages-wrapper">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-wrapper ${msg.isBot ? "bot" : "user"}`}
            >
              <div className={`message ${msg.isBot ? "bot" : "user"}`}>
                <div className="text" style={{ whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </div>
              </div>
              <div className={`time ${msg.isBot ? "bot-time" : "user-time"}`}>
                {msg.time}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-wrapper bot">
              <div className="message bot">
                <PulseLoader color="white" size="10px" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      <div
        className={`chatbot-input-container ${reportLoading ? "hidden" : ""}`}
      >
        <textarea
          type="text"
          className="chatbot-input"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows="1"
        />
        <button className="chatbot-send-button" onClick={handleSendMessage}>
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
