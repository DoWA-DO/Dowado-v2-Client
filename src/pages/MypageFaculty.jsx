// 이 파일은 MypageFaculty 컴포넌트로, 교직원이 자신의 정보를 조회하고 수정할 수 있는 마이페이지를 구성합니다.
// 프로필 사진 변경, 비밀번호 변경, 그리고 교직원의 기본 정보를 보여주는 기능을 포함하고 있으며, 
// 'AuthContext'를 사용하여 인증 토큰을 통해 교직원의 정보를 가져옵니다.

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ui/Mypage.css";
import { useAuth } from "../components/AuthContext";
import { IoPersonCircleOutline } from "react-icons/io5";
import ChangePassword from "../components/ChangePasswordModal";
import PageLayout from "../components/PageLayout";

const MypageFaculty = () => {
  const { authToken } = useAuth(); // 인증 토큰을 가져오는 useAuth 훅 사용
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [teacher, setTeacher] = useState({
    teacher_email: "",
    teacher_name: "",
    teacher_school: "",
    teacher_grade: 0,
    teacher_class: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 교직원 정보 가져오기
    const fetchTeacherInfo = async () => {
      if (authToken) {
        try {
          const response = await axios.post(
            "http://localhost:8000/teacher/read",
            null,
            {
              params: {
                token: authToken,
              },
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setTeacher(response.data);
        } catch (error) {
          console.error("Failed to fetch teacher info:", error);
          setErrorMessage("Failed to fetch teacher info.");
        }
      }
    };

    fetchTeacherInfo();
  }, [authToken]);

  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (currentPassword === newPassword) {
      setErrorMessage("현재 비밀번호와 새 비밀번호가 같습니다.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrorMessage(
        "비밀번호는 숫자, 소문자, 특수문자를 포함하여 8자리 이상이어야 합니다."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.put("http://localhost:8000/teacher/update", null, {
        params: {
          token: authToken,
          teacher_grade: teacher.teacher_grade,
          teacher_class: teacher.teacher_class,
          teacher_name: teacher.teacher_name,
          teacher_password: currentPassword,
          teacher_new_password: newPassword,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("");
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to change password:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("현재 비밀번호가 일치하지 않습니다.");
      } else {
        setErrorMessage("비밀번호 변경에 실패했습니다.");
      }
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleProfilePictureSubmit = async (e) => {
    e.preventDefault();
    if (profilePicture) {
      const formData = new FormData();
      formData.append("in_files", profilePicture);

      try {
        const response = await axios.post(
          "http://localhost:8000/file/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const fileUrls = response.data.fileUrls;
        if (fileUrls && fileUrls.length > 0) {
          const fileUrl = fileUrls[0];
          const fileName = fileUrl.split("/").pop();
          setTeacher((prevTeacher) => ({
            ...prevTeacher,
            profilePicture: `http://localhost:8000/file/images/${fileName}`,
          }));
          setProfilePicture(null);
          alert("프로필 사진이 성공적으로 변경되었습니다.");
        } else {
          alert("파일 URL을 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("프로필 사진 변경에 실패했습니다.", error);
        alert("프로필 사진 변경에 실패했습니다.");
      }
    }
  };

  return (
    <PageLayout>
      <div className="mp-page-name">마이페이지</div>
      <div className="mp-line"></div>
      <div className="mypage-forms">
        <div className="mp-form-section center">
          <div className="mp-profile">
            {teacher.profilePicture ? (
              <img
                src={teacher.profilePicture}
                alt="Profile"
                className="mp-profile-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-profile.png";
                }}
              />
            ) : (
              <IoPersonCircleOutline className="mp-profile-img" />
            )}
          </div>
        </div>
        <div className="mp-form-section">
          <h4>이름</h4>
          <div className="user-info">{teacher.teacher_name}</div>
        </div>
        <div className="mp-form-line"></div>
        <div className="mp-form-section">
          <h4>이메일</h4>
          <div className="user-info">{teacher.teacher_email}</div>
        </div>
        <div className="mp-form-line"></div>
        <div className="mp-form-section">
          <h4>소속</h4>
          <div className="user-info school">
            {teacher.teacher_school} {teacher.teacher_grade}학년{" "}
            {teacher.teacher_class}반
          </div>
        </div>
        <div className="mp-form-line"></div>
        <div className="mp-form-section">
          <h4>비밀번호</h4>
          <button type="button" onClick={() => setShowModal(true)}>
            변경
          </button>
        </div>
        <div className="mp-form-line"></div>
        <div className="mp-form-section">
          <h4>프로필 사진 변경</h4>
          <form
            onSubmit={handleProfilePictureSubmit}
            className="profile-picture-form"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              required
              className="profile-picture-input"
            />
            <button type="submit">업로드</button>
          </form>
        </div>
        <ChangePassword
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handlePasswordChange}
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setCurrentPassword={setCurrentPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          errorMessage={errorMessage}
        />
      </div>
    </PageLayout>
  );
};

export default MypageFaculty;
