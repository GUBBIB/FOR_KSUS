import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const getTodayDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function NoticeWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const noticeId = searchParams.get("noticeId");
  const isEditMode = Boolean(noticeId);

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const isAdmin =
    currentUser?.email === ADMIN_EMAIL || currentUser?.role === "ADMIN";

  const notices: Notice[] = JSON.parse(localStorage.getItem("notices") || "[]");

  const editNotice = notices.find((notice) => notice.id === Number(noticeId));

  const [form, setForm] = useState({
    title: editNotice?.title || "",
    content: editNotice?.content || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    if (isEditMode) {
      if (!editNotice) {
        alert("수정할 공지사항을 찾을 수 없습니다.");
        navigate("/notices");
        return;
      }

      const updatedNotices = notices.map((notice) =>
        notice.id === editNotice.id
          ? {
              ...notice,
              title: form.title,
              content: form.content,
            }
          : notice
      );

      localStorage.setItem("notices", JSON.stringify(updatedNotices));

      alert("공지사항 수정 완료");
      navigate(`/notices/${editNotice.id}`);
      return;
    }

    const newNotice: Notice = {
      id: Date.now(),
      title: form.title,
      content: form.content,
      writer: "관리자",
      writerEmail: ADMIN_EMAIL,
      createdAt: getTodayDate(),
    };

    localStorage.setItem("notices", JSON.stringify([newNotice, ...notices]));

    alert("공지사항 작성 완료");
    navigate("/notices");
  };

  if (!isAdmin) {
    return (
      <div className="notice-page">
        <Header />

        <main className="notice-container">
          <section className="notice-hero">
            <div>
              <p className="notice-badge">NOTICE</p>
              <h1>접근 제한</h1>
              <p>관리자만 접근할 수 있는 페이지입니다.</p>
            </div>

            <button
              type="button"
              className="notice-write-button"
              onClick={() => navigate("/notices")}
            >
              공지사항으로 이동
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="notice-page">
      <Header />

      <main className="notice-container">
        <section className="notice-hero">
          <div>
            <p className="notice-badge">NOTICE</p>

          </div>
        </section>

        <section className="notice-form-card">
          <form onSubmit={handleSubmit}>
            <input
              name="title"
              placeholder="공지사항 제목"
              value={form.title}
              onChange={handleChange}
            />

            <textarea
              name="content"
              placeholder="공지사항 내용"
              value={form.content}
              onChange={handleChange}
            />

            <button type="submit">{isEditMode ? "수정" : "작성"}</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default NoticeWritePage;