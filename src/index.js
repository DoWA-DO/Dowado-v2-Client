import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext"; // AuthProvider 추가

/* 페이지 */
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardStudentPage from "./pages/DashboardStudentPage";
import DashboardFacultyPage from "./pages/DashboardFacultyPage";
import ChatbotPage from "./pages/ChatbotPage";
import HomePage from "./pages/HomePage";
import StudentLogPage from "./pages/StudentLogPage";
import StudentChatPage from "./pages/StudentChatPage";
import ReportPage from "./pages/ReportPage";
import ChatDetailPage from "./pages/ChatDetailPage";
import MypageFaculty from "./pages/MypageFaculty";
import MypageStudent from "./pages/MypageStudent";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        {" "}
        {/* AuthProvider를 Router 내부로 이동 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboardstudent" element={<DashboardStudentPage />} />
          <Route path="/dashboardfaculty" element={<DashboardFacultyPage />} />
          <Route path="/studentlog" element={<StudentLogPage />} />
          <Route path="/studentlog/:id" element={<StudentLogPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/studentchat" element={<StudentChatPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/chatbotdetail" element={<ChatDetailPage />} />
          <Route path="/mypagestudent" element={<MypageStudent />} />
          <Route path="/mypageFaculty" element={<MypageFaculty />} />
        </Routes>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
