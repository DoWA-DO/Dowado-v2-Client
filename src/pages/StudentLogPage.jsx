// StudentLogPage 컴포넌트는 교직원이 학생들의 상담 기록을 검색하고 조회할 수 있는 페이지입니다.
// 필터링 및 검색 기능을 제공하며, 검색된 결과는 ChatLogFaculty 컴포넌트를 통해 표시됩니다.

import React, { useState } from "react";
import ChatLogFaculty from "../components/ChatLogFaculty";
import "../ui/StudentLogPage.css";
import PageLayout from "../components/PageLayout";

// Search 컴포넌트는 이름 또는 아이디로 학생의 상담 기록을 검색할 수 있는 검색 폼을 제공합니다.
const Search = ({ onSubmit }) => {
  const [filterType, setFilterType] = useState("name");
  const [filterValue, setFilterValue] = useState("");

  // 검색 폼 제출 시 호출되는 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(filterType, filterValue);
  };

  // 엔터 키를 눌렀을 때도 검색을 수행하도록 설정
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  // 검색어 변경 시 상태 업데이트
  const handleChange = (e) => {
    setFilterValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="sl-search-form">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="sl-select"
      >
        <option className="sl-option" value="name">
          이름
        </option>
        <option className="sl-option" value="email">
          아이디
        </option>
      </select>
      <input
        name="filter"
        className="sl-input"
        placeholder={`학생 ${filterType === "name" ? "이름" : "아이디"} 입력`}
        value={filterValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="sl-search-btn">
        검색
      </button>
    </form>
  );
};

// StudentLogPage 컴포넌트는 검색 기능과 검색 결과를 포함하는 페이지 레이아웃을 렌더링합니다.
const StudentLogPage = () => {
  const [filterType, setFilterType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  // 검색 폼 제출 시 호출되어 상태를 업데이트하는 함수
  const handleSearchSubmit = (type, term) => {
    setFilterType(type);
    setSearchTerm(term);
  };

  return (
    <PageLayout>
      <div className="student-chat-title">
        <div className="sl-page-name">학생상담기록</div>
      </div>
      <div className="sl-line"></div>
      <Search onSubmit={handleSearchSubmit} />
      <ChatLogFaculty filterType={filterType} searchTerm={searchTerm} />
    </PageLayout>
  );
};

export default StudentLogPage;
