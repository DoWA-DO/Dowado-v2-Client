// 이 파일은 React를 사용하여 학생 상담 기록을 테이블로 표시하는 기능을 구현한 코드입니다.
// 상담 기록은 교사의 이메일과 검색 조건에 따라 필터링됩니다.
// 테이블은 react-table 라이브러리를 사용하여 구현되었으며, 페이지네이션 및 정렬 기능을 포함합니다.

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  useGlobalFilter,
  useSortBy,
  useTable,
  usePagination,
} from "react-table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../ui/ChatLog.css";
import { useAuth } from "../components/AuthContext";

// Table 컴포넌트는 상담 기록 데이터를 표 형태로 렌더링합니다.
const Table = ({ columns, data, navigate, userEmail }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageCount,
    state: { pageIndex },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } }, // 페이지 초기 상태 설정
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const buttonsToShow = 5; // 페이지 네이션 버튼 수

  // 페이지네이션 버튼 계산 함수
  const calculatePageButtons = useCallback(() => {
    const totalButtons = Math.min(buttonsToShow, pageCount);
    const start = Math.max(0, pageIndex - Math.floor(totalButtons / 2));
    return Array.from({ length: totalButtons }, (_, i) => start + i);
  }, [pageCount, pageIndex]);

  const pageButtons = useMemo(() => calculatePageButtons(), [calculatePageButtons]);

  return (
    <div className="sl-table-container">
      <div className="sl-table-wrapper">
        <table className="sl-table" {...getTableProps()}>
          <thead className="sl-table-head">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {column.canSort &&
                      column.Header !== "상담기록" &&
                      column.Header !== "레포트" ? ( // 상담기록과 레포트 컬럼에는 정렬 기능 비활성화
                      column.isSorted ? (
                        column.isSortedDesc ? (
                          <FaSortDown style={{ marginLeft: "5px" }} />
                        ) : (
                          <FaSortUp style={{ marginLeft: "5px" }} />
                        )
                      ) : (
                        <FaSort style={{ marginLeft: "5px" }} />
                      )
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="sl-table-body" {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>
                      {cell.column.id === "chat-log" ? ( // 상담기록 버튼
                        <button
                          className="log-btn"
                          onClick={() =>
                            navigate("/chatbotdetail", {
                              state: {
                                chat_session_id: row.original.chat.chat_session_id, // session_id 전달
                                chat_student_email: row.original.chat.student_email,
                                chat_status: row.original.chat.chat_status,
                                userType: "faculty",
                              },
                            })
                          }
                        >
                          상담기록 확인
                        </button>
                      ) : cell.column.id === "report" ? ( // 레포트 버튼
                        <button
                          className="log-btn"
                          onClick={() =>
                            navigate("/report", {
                              state: { chat_session_id: row.original.chat.chat_session_id, },
                            })
                          }
                        >
                          레포트 확인
                        </button>
                      ) : (
                        cell.render("Cell")
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="sl-pagination">
        <button
          className="sl-arrow-btn"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          className="sl-arrow-btn"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>
        {pageButtons.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => gotoPage(pageNumber)}
            className={`sl-page-btn ${pageIndex === pageNumber ? "active" : ""}`}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button
          className="sl-arrow-btn"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>
        <button
          className="sl-arrow-btn"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

// ChatLogFaculty 컴포넌트는 필터와 검색어를 기반으로 학생 상담 기록을 가져와서 Table 컴포넌트에 전달합니다.
const ChatLogFaculty = ({ filterType, searchTerm }) => {
  const navigate = useNavigate();
  const { userEmail, authToken } = useAuth();
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 학생 상담 기록을 가져오는 함수
  const fetchStudents = useCallback(
    async (filterType, search) => {
      try {
        // 검색어가 없으면 전체 조회, 검색어가 있으면 검색 수행
        const endpoint = search ? "search-chatlogs" : "chatlogs";
        const response = await axios.get(
          `http://localhost:8000/report/teacher/${endpoint}`,
          {
            params: {
              teacher_email: userEmail,
              search_type: filterType,  // 검색 타입 파라미터 이름 확인
              search_query: search || "",  // 검색어가 없을 때 빈 문자열 전달
            },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setFilteredStudents(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setFilteredStudents([]);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [userEmail, authToken]
  );

  // 컴포넌트가 마운트될 때와 검색 조건이 변경될 때마다 학생 상담 기록을 다시 가져옴
  useEffect(() => {
    if (userEmail) {
      fetchStudents(filterType, searchTerm);
    }
  }, [userEmail, filterType, searchTerm, fetchStudents]);

  const columns = useMemo(
    () => [
      {
        Header: "상담일시",
        accessor: "chat.chat_date",
        Cell: ({ value }) => {
          const date = new Date(value);
          const formattedDate = date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          return <span>{formattedDate}</span>;
        },
      },

      {
        Header: "이메일",
        accessor: "chat.student_email", // 이메일 필드
      },
      {
        Header: "이름",
        accessor: "student_name", // 이름 필드
      },
      {
        Header: "상담기록",
        accessor: "chat-log",
        disableSortBy: true,
        Cell: ({ row }) => (
          <button
            className="log-btn"
            onClick={() =>
              navigate("/chatbotdetail", {
                state: {
                  chat_session_id: row.original.chat.chat_session_id, // session_id 전달
                  chat_student_email: row.original.chat.student_email,
                  chat_status: row.original.chat.chat_status,
                  userType: "faculty",
                },
              })
            }
          >
            상담기록 확인
          </button>
        ),
      },
      {
        Header: "레포트",
        accessor: "report",
        disableSortBy: true,
        Cell: ({ row }) => (
          <button
            className="log-btn"
            onClick={() =>
              navigate("/report", {
                state: {
                  chat_session_id: row.original.chat.chat_session_id,
                },
              })
            }
          >
            레포트 확인
          </button>
        ),
      },
    ],
    [navigate]
  );

  return (
    <>
      {loading ? (
        <div className="sl-messages">Loading...</div>
      ) : error ? (
        <div className="sl-messages">Error: {error}</div>
      ) : filteredStudents.length === 0 ? (
        <div className="sl-messages">상담 내역이 없습니다.</div>
      ) : (
        <Table
          columns={columns}
          data={filteredStudents}
          navigate={navigate}
          userEmail={userEmail}
        />
      )}
    </>
  );
};

export default ChatLogFaculty;

