import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import "./Header.css";

type User = {
  email: string;
  nickname: string;
  role?: string;
};

function Header() {
  const navigate = useNavigate();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const handleLogout = async () => {
    try {
      await logout(); // (변경됨)
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("currentUser");
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  return (
    <header className="site-header">
      <Link to="/" className="site-logo">
        FOR KSUS
      </Link>

      <div className="header-actions">
        {currentUser ? (
          <>
            <Link to="/profile">{currentUser.nickname}님</Link>

            <button type="button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/register">회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;