// 이 파일은 React에서 비밀번호 변경을 위한 모달 컴포넌트를 정의한 코드입니다.
// 사용자로부터 현재 비밀번호와 새 비밀번호를 입력받아 비밀번호 변경 요청을 처리합니다.

import React from "react";
import "../ui/ChangePasswordModal.css"; // 모달 스타일을 적용하기 위해 CSS 파일을 가져옴

// ChangePassword 컴포넌트 정의
const ChangePassword = ({
  show, // 모달의 표시 여부를 결정
  onClose, // 모달을 닫는 함수
  onSubmit, // 비밀번호 변경을 처리하는 함수
  currentPassword, // 현재 비밀번호
  newPassword, // 새로운 비밀번호
  confirmPassword, // 새로운 비밀번호 확인
  setCurrentPassword, // 현재 비밀번호 상태를 업데이트하는 함수
  setNewPassword, // 새로운 비밀번호 상태를 업데이트하는 함수
  setConfirmPassword, // 비밀번호 확인 상태를 업데이트하는 함수
  errorMessage, // 오류 메시지
}) => {
  // 모달이 표시되지 않으면 null 반환
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times; {/* 모달을 닫는 버튼 */}
        </button>
        <h2>비밀번호 변경</h2>
        <form onSubmit={onSubmit}> {/* 비밀번호 변경 폼 */}
          <div className="cp-form-group">
            <label htmlFor="currentPassword">현재 비밀번호</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="cp-form-group">
            <label htmlFor="newPassword">새로운 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="cp-form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className="cp-error-message">{errorMessage}</p>}
          <button type="submit" className="submit-button">
            변경
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
