import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import "./AuthPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // (변경됨) 임시 관리자 로그인
    if (email === "admin@ks.ac.kr" && password === "1234") {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: "admin@ks.ac.kr",
          nickname: "관리자",
          role: "ADMIN",
        })
      );

      alert("관리자 로그인 성공");
      navigate("/");
      return;
    }

    try {
      await login({
        email,
        password,
      });

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email,
          nickname: email.split("@")[0],
          role: "USER",
        })
      );

      alert("로그인 성공");
      navigate("/");
    } catch (error) {
      console.error(error);

      // (변경됨) 백엔드 미연결 상태에서도 일반 유저 테스트 가능
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email,
          nickname: email.split("@")[0],
          role: "USER",
        })
      );

      alert("백엔드 미연결 상태로 임시 로그인 처리되었습니다.");
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          FOR KSUS
        </Link>

        <p className="auth-subtitle">경성대학교 통합 서비스</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>이메일</label>

            <input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>

            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="arrow-button">
            →
          </button>
        </form>

        <div className="auth-footer">
          <span>계정이 없으신가요?</span>

          <Link to="/register">회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;