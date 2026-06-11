import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import {
  createNotice,
  getNoticeDetail,
  updateNotice,
} from "../api/noticeApi";
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
  viewCount: number;
  createdAt: string;
};

function NoticeWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const noticeId = searchParams.get("noticeId");
  const isEditMode = Boolean(noticeId);

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const isAdmin = currentUser?.role === "ADMIN";

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      alert("관리자만 공지사항을 작성할 수 있습니다.");
      navigate("/notices");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const fetchEditNotice = async () => {
      if (!noticeId) return;

      try {
        setIsLoading(true);

        const data: Notice = await getNoticeDetail(Number(noticeId));

        setForm({
          title: data.title,
          content: data.content,
        });
      } catch (error) {
        console.error(error);
        alert(error instanceof Error ? error.message : "공지사항 조회 실패");
        navigate("/notices");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEditNotice();
  }, [noticeId, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      alert("관리자만 공지사항을 작성할 수 있습니다.");
      navigate("/notices");
      return;
    }

    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      if (isEditMode && noticeId) {
        const updatedNotice: Notice = await updateNotice(Number(noticeId), {
          title: form.title,
          content: form.content,
        });

        alert("공지사항 수정 완료");
        navigate(`/notices/${updatedNotice.id}`);
        return;
      }

      await createNotice({
        title: form.title,
        content: form.content,
      });

      alert("공지사항 작성 완료");
      navigate("/notices");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "요청 실패");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="notice-page">
      <Header />

      <main className="notice-container">
        <section className="notice-hero">
          <div>
            <p className="notice-badge">NOTICE</p>
            <h1>{isEditMode ? "공지사항 수정" : "공지사항 작성"}</h1>
            <p>공지사항 제목과 내용을 입력해주세요.</p>
          </div>
        </section>

        <section className="notice-form-card">
          <form onSubmit={handleSubmit}>
            <input
              name="title"
              placeholder="공지사항 제목"
              value={form.title}
              onChange={handleChange}
              disabled={isLoading}
            />

            <textarea
              name="content"
              placeholder="공지사항 내용"
              value={form.content}
              onChange={handleChange}
              disabled={isLoading}
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "저장 중..." : isEditMode ? "수정" : "작성"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default NoticeWritePage;