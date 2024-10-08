// 이 파일은 학생 회원가입 폼을 구현한 React 컴포넌트입니다.
// 학생이 이름, 이메일, 비밀번호, 학교, 학년, 반, 번호 등의 정보를 입력하고
// 개인정보 수집 및 이용에 동의하고 이용약관에 동의하여 회원가입을 진행할 수 있습니다.
// 학교 목록을 불러오고, 입력된 정보의 유효성을 검사하며 오류 메시지를 표시합니다.

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InfoCheck from "./InfoCheckModal";

const SignupStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_name: "",
    student_email: "",
    student_password: "",
    student_password2: "",
    school_id: "",
    student_grade: "",
    student_class: "",
    student_number: "",
    teacher_email: "", // 선생님 이메일 추가
  });

  const [schools, setSchools] = useState([]); // 학교 목록 상태 추가
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [agree, setAgree] = useState(false);
  const [terms, setTerms] = useState(false);
  const [agreeError, setAgreeError] = useState("");
  const [termsError, setTermsError] = useState("");

  // 학교 목록 불러오기
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/student/school_list"
        );
        setSchools(response.data);
      } catch (error) {
        console.error("학교 목록 불러오기 오류:", error);
      }
    };
    fetchSchools();
  }, []);

  const validateKorean = (value) => /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/.test(value);
  const validateEmail = (value) =>
    /^[a-zA-Z0-9+\-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
  const validatePassword = (value) =>
    /^(?=.*\d)(?=.*[a-z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/.test(value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value.replace(/\s/g, ""); // 공백 제거

    if (name === "student_name" || name === "student_school") {
      filteredValue = filteredValue.replace(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ""); // 한글만 허용
    }

    // 학년, 반, 번호를 정수로 변환
    if (
      name === "student_grade" ||
      name === "student_class" ||
      name === "student_number"
    ) {
      filteredValue = parseInt(filteredValue, 10);
      if (isNaN(filteredValue)) {
        filteredValue = ""; // NaN일 경우 빈 문자열로 설정
      }
    }

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    switch (name) {
      case "student_name":
        if (!validateKorean(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            student_name: "한글로 된 이름을 입력해 주세요.",
          }));
        }
        break;
      case "student_email":
        if (!validateEmail(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            student_email: "유효한 이메일 주소를 입력해 주세요.",
          }));
        }
        break;
      case "student_password":
        if (!validatePassword(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            student_password:
              "비밀번호는 숫자, 소문자, 특수문자를 포함하여 8자리 이상이어야 합니다.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, student_password: "" }));
        }
        if (filteredValue !== formData.student_password2) {
          setErrors((prev) => ({
            ...prev,
            student_password2: "비밀번호가 일치하지 않습니다.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, student_password2: "" }));
        }
        break;
      case "student_password2":
        if (filteredValue !== formData.student_password) {
          setErrors((prev) => ({
            ...prev,
            student_password2: "비밀번호가 일치하지 않습니다.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, student_password2: "" }));
        }
        break;
      case "teacher_email":
        if (!validateEmail(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            teacher_email: "유효한 이메일 주소를 입력해 주세요.",
          }));
        }
        break;
      default:
        break;
    }
  };

  const handleSchoolChange = (e) => {
    const selectedSchoolId = e.target.value;
    setFormData((prev) => ({ ...prev, school_id: selectedSchoolId }));
    setErrors((prev) => ({ ...prev, school_id: "" }));
  };

  const handleAgreeChange = (e) => {
    setAgree(e.target.checked);
    if (e.target.checked) {
      setAgreeError("");
    }
  };

  const handleTermsChange = (e) => {
    setTerms(e.target.checked);
    if (e.target.checked) {
      setTermsError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!formData.student_name)
      newErrors.student_name = "이름을 입력해 주세요.";
    if (!formData.student_email)
      newErrors.student_email = "이메일을 입력해 주세요.";
    if (!formData.student_password)
      newErrors.student_password = "비밀번호를 입력해 주세요.";
    if (!formData.student_password2)
      newErrors.student_password2 = "비밀번호를 확인해 주세요.";
    if (formData.student_password !== formData.student_password2)
      newErrors.student_password2 = "비밀번호가 일치하지 않습니다.";
    if (!formData.school_id)
      // 학교 ID 확인
      newErrors.school_id = "학교를 선택해 주세요.";
    if (!formData.student_grade)
      newErrors.student_grade = "학년을 입력해 주세요.";
    if (!formData.student_class)
      newErrors.student_class = "반을 입력해 주세요.";
    if (!formData.student_number)
      newErrors.student_number = "번호를 입력해 주세요.";
    if (!formData.teacher_email)
      // 선생님 이메일 확인
      newErrors.teacher_email = "담임 선생님 이메일을 입력해 주세요.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (!agree) {
      setAgreeError("개인정보 수집에 동의해 주세요.");
      return;
    } else {
      setAgreeError("");
    }

    if (!terms) {
      setTermsError("이용약관에 동의해 주세요.");
      return;
    } else {
      setTermsError("");
    }

    try {
      const endpoint = "http://localhost:8000/student/sign-up"; // axios 요청 경로 수정

      console.log(formData);
      const response = await axios.post(endpoint, formData);

      if (response.status !== 201) {
        // 상태 코드를 201로 기대
        throw new Error("회원가입에 실패했습니다.");
      }

      alert("회원가입이 성공적으로 완료되었습니다.");
      navigate("/login");

      setFormData({
        student_name: "",
        student_email: "",
        student_password: "",
        student_password2: "",
        school_id: "", // 학교 ID 초기화
        student_grade: "",
        student_class: "",
        student_number: "",
        teacher_email: "", // 선생님 이메일 초기화
      });
      setAgree(false);
      setTerms(false);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("이미 가입된 이메일입니다.");
      } else {
        console.error("Error:", error);
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent("");
  };

  return (
    <div className="signup-form-container">
      <form onSubmit={handleSubmit}>
        <div className="lg-form-group">
          <label htmlFor="student_name">이름</label>
          <input
            type="text"
            id="student_name"
            name="student_name"
            value={formData.student_name}
            placeholder="이름(한글)"
            onChange={handleChange}
          />
          {errors.student_name && (
            <div className="error-message">{errors.student_name}</div>
          )}
        </div>
        <div className="lg-form-group" id="email-form">
          <label htmlFor="student_email">이메일</label>
          <input
            type="email"
            id="student_email"
            name="student_email"
            value={formData.student_email}
            placeholder="이메일"
            onChange={handleChange}
          />
          {errors.student_email && (
            <div className="error-message">{errors.student_email}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="student_password">비밀번호</label>
          <input
            type="password"
            id="student_password"
            name="student_password"
            value={formData.student_password}
            placeholder="영문, 숫자, 특수문자 포함 8자 이상 입력"
            onChange={handleChange}
          />
          {errors.student_password && (
            <div className="error-message">{errors.student_password}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="student_password2">비밀번호 확인</label>
          <input
            type="password"
            id="student_password2"
            name="student_password2"
            value={formData.student_password2}
            placeholder="비밀번호 확인"
            onChange={handleChange}
          />
          {errors.student_password2 && (
            <div className="error-message">{errors.student_password2}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="school_id">학교 이름</label>
          <select
            id="school_id"
            name="school_id"
            value={formData.school_id}
            onChange={handleSchoolChange}
          >
            <option value="">학교를 선택해 주세요</option>
            {schools.map((school) => (
              <option key={school.school_id} value={school.school_id}>
                {school.school_name}
              </option>
            ))}
          </select>
          {errors.school_id && (
            <div className="error-message">{errors.school_id}</div>
          )}
        </div>
        <div className="lg-form-group row">
          <label htmlFor="student_grade">학년</label>
          <input
            type="number"
            id="student_grade"
            name="student_grade"
            value={formData.student_grade}
            placeholder="학년"
            min={1}
            max={6}
            onChange={handleChange}
          />
          {errors.student_grade && (
            <div className="error-message">{errors.student_grade}</div>
          )}
        </div>
        <div className="lg-form-group row">
          <label htmlFor="student_class">반</label>
          <input
            type="number"
            id="student_class"
            name="student_class"
            value={formData.student_class}
            placeholder="반"
            min={1}
            onChange={handleChange}
          />
          {errors.student_class && (
            <div className="error-message">{errors.student_class}</div>
          )}
        </div>
        <div className="lg-form-group row">
          <label htmlFor="student_number">번호</label>
          <input
            type="number"
            id="student_number"
            name="student_number"
            value={formData.student_number}
            placeholder="번호"
            min={1}
            onChange={handleChange}
          />
          {errors.student_number && (
            <div className="error-message">{errors.student_number}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="teacher_email">담임 선생님 이메일</label>
          <input
            type="email"
            id="teacher_email"
            name="teacher_email"
            value={formData.teacher_email}
            placeholder="teacher@example.com"
            onChange={handleChange}
          />
          {errors.teacher_email && (
            <div className="error-message">{errors.teacher_email}</div>
          )}
        </div>
        <div className="info-check">
          <label>
            <input
              type="checkbox"
              checked={agree}
              onChange={handleAgreeChange}
            />
            개인정보 수집이용 동의
            <button type="button" onClick={() => openModal("privacy")}>
              확인
            </button>
          </label>
          {agreeError && <div className="error-message">{agreeError}</div>}
        </div>
        <div className="info-check">
          <label>
            <input
              type="checkbox"
              checked={terms}
              onChange={handleTermsChange}
            />
            이용약관 동의
            <button type="button" onClick={() => openModal("terms")}>
              확인
            </button>
          </label>
          {termsError && <div className="error-message">{termsError}</div>}
        </div>
        <button type="submit" className="login-button">
          회원가입
        </button>
        <div className="signup-link">
          계정이 있나요? <a href="/login">로그인</a>
        </div>
      </form>
      <InfoCheck
        isOpen={modalOpen}
        closeModal={closeModal}
        content={modalContent}
      />
    </div>
  );
};

export default SignupStudent;
