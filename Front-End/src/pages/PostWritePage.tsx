import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { createPost, getPostDetail, updatePost } from "../api/boardApi";
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
  viewCount: number;
  createdAt: string;
};

const BOARD_ID = 1;

function PostWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editPostId = searchParams.get("postId");
  const isEditMode = Boolean(editPostId);

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchEditPost = async () => {
      if (!editPostId) return;

      try {
        setIsLoading(true);

        const data: Post = await getPostDetail(BOARD_ID, Number(editPostId));

        setForm({
          title: data.title,
          content: data.content,
        });
      } catch (error) {
        console.error(error);
        alert(error instanceof Error ? error.message : "게시글 조회 실패");
        navigate("/community");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEditPost();
  }, [editPostId, navigate]);

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

    if (!currentUser) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      if (isEditMode && editPostId) {
        const updatedPost: Post = await updatePost(
          BOARD_ID,
          Number(editPostId),
          {
            title: form.title,
            content: form.content,
          }
        );

        alert("게시글 수정 완료");
        navigate(`/community/posts/${updatedPost.id}`);
        return;
      }

      await createPost(BOARD_ID, {
        title: form.title,
        content: form.content,
      });

      alert("게시글 작성 완료");
      navigate("/community");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "요청 실패");
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

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
            disabled={isLoading}
          />

          <textarea
            className="blog-content-input"
            name="content"
            placeholder="내용을 입력하세요."
            value={form.content}
            onChange={handleChange}
            disabled={isLoading}
          />

          <div className="write-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/community")}
              disabled={isLoading}
            >
              취소
            </button>

            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? "저장 중..." : isEditMode ? "수정 저장" : "저장"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default PostWritePage;