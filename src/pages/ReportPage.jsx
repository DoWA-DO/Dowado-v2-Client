import React, { useEffect, useState } from "react";
import "../ui/Report.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

const ReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportData, chat_session_id } = location.state || {}; // 상담 결과 데이터를 가져옴
  const { userType, authToken } = useAuth(); // userType 추가 및 authToken 포함
  const [fetchedReportData, setFetchedReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (reportData) {
      setFetchedReportData(reportData);
      setLoading(false);
      return;
    }

    if (!chat_session_id) {
      setError("session_id를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        const response = await axios.get("http://localhost:8000/report/content", {
          params: { session_id: chat_session_id },
          headers: { Authorization: `Bearer ${authToken}` },
        });

        setFetchedReportData(response.data);
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.data.detail}`);
        } else if (error.request) {
          setError("서버로부터 응답이 없습니다. 다시 시도해 주세요.");
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [chat_session_id, authToken, reportData]);


  const handleBackClick = async () => {
    try {
      console.log("back click");
      console.log("User type:", userType);
    } catch (error) {
      console.error("Error handling back click:", error);
    } finally {
      if (userType === "faculty") {
        navigate("/studentlog");
      } else if (userType === "student") {
        navigate("/studentchat");
      }
    }
  };


  const displayReportData = reportData || fetchedReportData;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="report-container">
      <div className="report-header">
        <button className="back-btn" onClick={handleBackClick}>
          <FaArrowLeft size="20" />
        </button>
        <h1>진로 추천 보고서</h1>
      </div>

      {displayReportData && (
        <div className="report-content">
          <div className="section">
            <h2>추천 직업군</h2>
            <p className="job-title">{displayReportData.prediction}</p>
          </div>

          <div className="section">
            <h2>연관 직업</h2>
            {Array.isArray(displayReportData.relatedJobs) ? (
              displayReportData.relatedJobs.length > 0 ? (
                displayReportData.relatedJobs.map((job, index) => (
                  <div key={index} className="related-job">
                    <p className="job-title">{job.title}</p>
                    <p className="job-info">{job.info}</p>
                  </div>
                ))
              ) : (
                <p>관련된 직업 정보가 없습니다.</p>
              )
            ) : (
              <p>데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
            )}
          </div>

          <div className="section">
            <h2>연관 전공</h2>
            {Array.isArray(displayReportData.relatedMajors) ? (
              displayReportData.relatedJobs.length > 0 ? (
                displayReportData.relatedMajors.map((major, index) => (
                  <div key={index} className="related-major">
                    <p className="major-title">{major.major}</p>
                    <p className="major-info">{major.info}</p>
                  </div>
                ))
              ) : (
                <p>관련된 전공 정보가 없습니다.</p>
              )
            ) : (
              <p>데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
