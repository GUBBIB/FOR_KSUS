import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, requestVerify, verifyCode } from "../api/auth";
import "./AuthPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [isCodeStep, setIsCodeStep] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    nickname: "",
    code: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "email") {
      setIsCodeStep(false);
      setIsVerified(false);
    }
  };

  const isSchoolEmail = form.email.endsWith("@ks.ac.kr");

  const handleRequestVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.name || !form.nickname) {
      alert("이메일, 비밀번호, 이름, 닉네임을 모두 입력해주세요.");
      return;
    }

    if (!isSchoolEmail) {
      alert("학교 이메일(@ks.ac.kr)만 사용할 수 있습니다.");
      return;
    }

    try {
      await requestVerify({ email: form.email });

      alert("학교 이메일로 인증 코드가 발송되었습니다.");
      setIsCodeStep(true);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("인증 코드 요청 실패");
      }
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code) {
      alert("인증 코드를 입력해주세요.");
      return;
    }

    try {
      await verifyCode({
        email: form.email,
        code: form.code,
      });

      setIsVerified(true);

      await register({
        email: form.email,
        password: form.password,
        name: form.name,
        nickname: form.nickname,
      });

      alert("회원가입 완료");
      navigate("/login");
    } catch (error) {
      console.error(error);
      setIsVerified(false);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("회원가입 실패");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          FOR KSUS
        </Link>

        <p className="auth-subtitle">경성대학교 통합 서비스</p>

        {!isCodeStep ? (
          <form onSubmit={handleRequestVerify}>
            <div className="input-group">
              <label>학교 이메일</label>

              <input
                name="email"
                type="email"
                placeholder="학교 이메일(@ks.ac.kr)"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>비밀번호</label>

              <input
                name="password"
                type="password"
                placeholder="비밀번호 입력"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>이름</label>

              <input
                name="name"
                placeholder="이름 입력"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>닉네임</label>

              <input
                name="nickname"
                placeholder="닉네임 입력"
                value={form.nickname}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="arrow-button">
              →
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister}>
            <div className="input-group">
              <label>학교 이메일</label>

              <input value={form.email} disabled />
            </div>

            <div className="input-group">
              <label>인증 코드</label>

              <input
                name="code"
                placeholder="인증 코드 입력"
                value={form.code}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="arrow-button">
              →
            </button>

            <button
              type="button"
              className="text-button"
              onClick={() => {
                setIsCodeStep(false);
                setIsVerified(false);
              }}
            >
              이메일 다시 입력
            </button>
          </form>
        )}

        {isVerified && <p className="success-message">학교 이메일 인증 완료</p>}

        <div className="auth-footer">
          <span>이미 계정이 있으신가요?</span>
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;