import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import "./PostWritePage.css";

type User = {
  email: string;
  nickname: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  writer: string;
  writerEmail: string;
  viewCount: number;
  createdAt: string;
};

const getTodayDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function PostWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editPostId = searchParams.get("postId");
  const isEditMode = Boolean(editPostId);

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const posts: Post[] = JSON.parse(localStorage.getItem("posts") || "[]");
  const editPost = posts.find((post) => post.id === Number(editPostId));

  const [form, setForm] = useState({
    title: editPost?.title || "",
    content: editPost?.content || "",
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

    if (!currentUser) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    if (isEditMode) {
      if (!editPost) {
        alert("수정할 게시글을 찾을 수 없습니다.");
        navigate("/community");
        return;
      }

      if (editPost.writerEmail !== currentUser.email) {
        alert("본인이 작성한 게시글만 수정할 수 있습니다.");
        navigate("/community");
        return;
      }

      const updatedPosts = posts.map((post) =>
        post.id === editPost.id
          ? {
              ...post,
              title: form.title,
              content: form.content,
            }
          : post
      );

      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      alert("게시글 수정 완료");
      navigate(`/community/posts/${editPost.id}`);
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      title: form.title,
      content: form.content,
      writer: currentUser.nickname,
      writerEmail: currentUser.email,
      viewCount: 0,
      createdAt: getTodayDate(),
    };

    localStorage.setItem("posts", JSON.stringify([newPost, ...posts]));
    alert("게시글 작성 완료");
    navigate("/community");
  };

  return (
    <div className="write-page">
      <Header />

      <main className="write-container">
        <form className="blog-editor" onSubmit={handleSubmit}>
          <input
            className="blog-title-input"
            name="title"
            placeholder="제목"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            className="blog-content-input"
            name="content"
            placeholder="내용을 입력하세요."
            value={form.content}
            onChange={handleChange}
          />

          <div className="write-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/community")}
            >
              취소
            </button>

            <button type="submit" className="save-button">
              {isEditMode ? "수정 저장" : "저장"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default PostWritePage;