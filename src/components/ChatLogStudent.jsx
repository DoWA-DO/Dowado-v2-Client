import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  useGlobalFilter,
  useSortBy,
  useTable,
  usePagination,
} from "react-table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../ui/ChatLog.css";

const Table = ({ columns, data, navigate, onContinueChat }) => {
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
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const buttonsToShow = 5;
  const pageButtons = useMemo(() => {
    const totalButtons = Math.min(buttonsToShow, pageCount);
    const start = Math.max(0, pageIndex - Math.floor(totalButtons / 2));
    return Array.from({ length: totalButtons }, (_, i) => start + i);
  }, [pageCount, pageIndex]);

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
                      column.Header !== "레포트" ? (
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
                      {cell.column.id === "chat-log" ? (
                        <button
                          className="log-btn"
                          onClick={() =>
                            navigate("/chatbotdetail", {
                              state: {
                                chat_session_id: row.original.chat.chat_session_id,
                                chat_student_email: row.original.chat.student_email,
                                chat_status: row.original.chat.chat_status,
                                userType: "student",
                              },
                            })
                          }
                        >
                          상담기록 확인
                        </button>
                      ) : cell.column.id === "report" ? (
                        <button
                          className="log-btn"
                          onClick={() => {
                            if (!row.original.chat.chat_status) {
                              onContinueChat(row.original.chat.chat_session_id, row.original.chat.student_email);
                            } else {
                              navigate("/report", {
                                state: {
                                  chat_session_id: row.original.chat.chat_session_id,
                                },
                              });
                            }
                          }}
                        >
                          {row.original.chat.chat_status ? "레포트 확인" : "상담 이어하기"}
                        </button>
                      ) : (
                        <Link
                          to={`/students/${row.original.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {cell.render("Cell")}
                        </Link>
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
            className={`sl-page-btn ${pageIndex === pageNumber ? "active" : ""
              }`}
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

const ChatLogStudent = () => {
  const navigate = useNavigate();
  const { userEmail, authToken } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/report/student/chatlogs",
          {
            headers: { Authorization: `Bearer ${authToken}` },
            params: { email: userEmail },
          }
        );
        setStudents(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [userEmail, authToken]);

  const handleContinueChat = useCallback(
    async (sessionId, studentEmail) => {
      try {
        console.log("Sending session_id:", sessionId);
        const response = await axios.post(
          "http://localhost:8000/careerchat/continue-chat",
          null,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            params: {
              session_id: sessionId
            },
          }
        );
        navigate("/chatbot", {
          state: {
            chat_session_id: response.data.new_session_id,
            chat_student_email: studentEmail,
            chat_status: false,
          },
        });
      } catch (error) {
        console.error("Error continuing chat:", error);
      }
    },
    [authToken, navigate]
  );

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
        accessor: "chat.student_email",
      },
      {
        Header: "이름",
        accessor: "student_name",
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
                  chat_session_id: row.original.chat.chat_session_id,
                  chat_student_email: row.original.chat.student_email,
                  chat_status: row.original.chat.chat_status,
                  userType: "student",
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
            onClick={async () => {
              if (!row.original.chat.chat_status) {
                handleContinueChat(
                  row.original.chat.chat_session_id,
                  row.original.chat.student_email
                );
              } else {
                navigate("/report", {
                  state: { chat_session_id: row.original.chat.chat_session_id, },
                });
              }
            }}
          >
            {row.original.chat.chat_status ? "레포트 확인" : "상담 이어하기"}
          </button>
        ),
      },
    ],
    [navigate, handleContinueChat]
  );

  return (
    <>
      {loading ? (
        <div className="sl-messages">Loading...</div>
      ) : error ? (
        <div className="sl-messages">Error: {error}</div>
      ) : students.length === 0 ? (
        <div className="sl-messages">상담 내역이 없습니다.</div>
      ) : (
        <Table columns={columns} data={students} navigate={navigate} onContinueChat={handleContinueChat} />
      )}
    </>
  );
};

export default ChatLogStudent;
