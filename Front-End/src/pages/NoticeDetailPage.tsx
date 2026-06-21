import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { deleteNotice, getNoticeDetail } from "../api/noticeApi";
import { getMyProfile } from "../api/userApi";
import "./NoticePage.css";

type User = {
  email: string;
  nickname: string;
  name: string;
  role: "USER" | "ADMIN";
};

type Notice = {
  id: number;
  title: string;
  content: string;
  writer: string;
  viewCount: number;
  createdAt: string;
};

function NoticeDetailPage() {
  const navigate = useNavigate();
  const { noticeId } = useParams();

  const [isAdmin, setIsAdmin] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user: User = await getMyProfile();
        setIsAdmin(user.role === "ADMIN");
      } catch {
        setIsAdmin(false);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchNotice = async () => {
      if (!noticeId) return;

      try {
        setIsLoading(true);
        setErrorMessage("");

        const data: Notice = await getNoticeDetail(Number(noticeId));
        setNotice(data);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error instanceof Error ? error.message : "공지사항 조회 실패"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [noticeId]);

  const handleDeleteNotice = async () => {
    if (!isAdmin) {
      alert("관리자만 공지사항을 삭제할 수 있습니다.");
      return;
    }

    if (!notice) return;

    if (!window.confirm("공지사항을 삭제하시겠습니까?")) return;

    try {
      await deleteNotice(notice.id);

      alert("공지사항 삭제 완료");
      navigate("/notices");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "공지사항 삭제 실패");
    }
  };

  if (isLoading) {
    return (
      <div className="notice-page">
        <Header />

        <main className="notice-container">
          <section className="notice-detail-card">
            <p className="empty-text">공지사항 불러오는 중...</p>
          </section>
        </main>
      </div>
    );
  }

  if (errorMessage || !notice) {
    return (
      <div className="notice-page">
        <Header />

        <main className="notice-container">
          <section className="notice-detail-card">
            <p className="empty-text">
              {errorMessage || "공지사항을 찾을 수 없습니다."}
            </p>

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
            <span>조회수: {notice.viewCount}</span>
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