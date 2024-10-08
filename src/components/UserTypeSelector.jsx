// 이 파일은 사용자가 "교직원" 또는 "학생" 중 하나를 선택할 수 있는 사용자 유형 선택 컴포넌트입니다.
// 라디오 버튼을 통해 사용자는 자신의 역할을 선택하며, 선택된 값은 `userType` 상태로 관리됩니다.
// 선택 변경 시 `onChange` 핸들러가 호출되어 부모 컴포넌트에서 처리됩니다.

import React from "react";

const UserTypeSelector = ({ userType, onChange }) => {
  return (
    <div className="user-type-group">
      <label>
        <input
          type="radio"
          value="teacher"
          checked={userType === "teacher"}
          onChange={onChange}
        />
        교직원
      </label>
      <label>
        <input
          type="radio"
          value="student"
          checked={userType === "student"}
          onChange={onChange}
        />
        학생
      </label>
    </div>
  );
};

export default UserTypeSelector;
