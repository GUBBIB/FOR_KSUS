import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import "./NoticePage.css";

type User = {
  email: string;
  nickname: string;
  role?: string;
};

type Notice = {
  id: number;
  title: string;
  content: string;
  writer: string;
  writerEmail: string;
  createdAt: string;
};

const ADMIN_EMAIL = "admin@ks.ac.kr";

function NoticeDetailPage() {
  const navigate = useNavigate();
  const { noticeId } = useParams();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const isAdmin =
    currentUser?.email === ADMIN_EMAIL || currentUser?.role === "ADMIN";

  const notices: Notice[] = JSON.parse(localStorage.getItem("notices") || "[]");

  const notice = notices.find((item) => item.id === Number(noticeId));

  const handleDeleteNotice = () => {
    if (!isAdmin) {
      alert("관리자만 공지사항을 삭제할 수 있습니다.");
      return;
    }

    if (!notice) return;

    if (!window.confirm("공지사항을 삭제하시겠습니까?")) return;

    const updatedNotices = notices.filter((item) => item.id !== notice.id);

    localStorage.setItem("notices", JSON.stringify(updatedNotices));

    alert("공지사항 삭제 완료");
    navigate("/notices");
  };

  if (!notice) {
    return (
      <div className="notice-page">
        <Header />

        <main className="notice-container">
          <section className="notice-detail-card">
            <p>공지사항을 찾을 수 없습니다.</p>
            <button onClick={() => navigate("/notices")}>목록으로</button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="notice-page">
      <Header />

      <main className="notice-container">
        <section className="notice-detail-card">
          <p className="notice-badge">NOTICE</p>

          <h1>{notice.title}</h1>

          <div className="notice-meta">
            <span>작성자: {notice.writer}</span>
            <span>작성일: {notice.createdAt}</span>
          </div>

          <hr />

          <p className="notice-content">{notice.content}</p>

          <div className="notice-detail-actions">
            <button onClick={() => navigate("/notices")}>목록으로</button>

            {isAdmin && (
              <>
                <button
                  onClick={() => navigate(`/notices/write?noticeId=${notice.id}`)}
                >
                  수정
                </button>

                <button onClick={handleDeleteNotice}>삭제</button>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default NoticeDetailPage;