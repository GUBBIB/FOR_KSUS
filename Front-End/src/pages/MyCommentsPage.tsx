import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getPosts } from "../api/boardApi";
import { getComments } from "../api/commentApi";
import "./UserPage.css";

type User = {
  email: string;
  nickname: string;
};

type Post = {
  id: number;
  title: string;
};

type Comment = {
  id: number;
  postId: number;
  content: string;
  writer: string;
  createdAt: string;
};

const BOARD_ID = 1;

function MyCommentsPage() {
  const navigate = useNavigate();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [myComments, setMyComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const fetchMyComments = async () => {
      try {
        setIsLoading(true);

        const postData = await getPosts(BOARD_ID);
        const posts: Post[] = Array.isArray(postData) ? postData : [postData];

        const commentGroups = await Promise.all(
          posts.map(async (post) => {
            const commentData = await getComments(BOARD_ID, post.id);
            const comments = Array.isArray(commentData)
              ? commentData
              : [commentData];

            return comments.map((comment) => ({
              ...comment,
              postId: post.id,
            }));
          })
        );

        const allComments = commentGroups.flat();

        const filtered = allComments
          .filter((comment) => comment.writer === currentUser.nickname)
          .sort((a, b) => b.id - a.id);

        setMyComments(filtered);
      } catch (error) {
        console.error(error);
        alert("내 댓글 조회 실패");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyComments();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="user-page">
        <Header />
        <main className="user-container">
          <section className="user-hero-card">
            <h1>내 댓글</h1>
            <p>로그인 후 내가 쓴 댓글을 확인할 수 있습니다.</p>
            <button onClick={() => navigate("/login")}>로그인하러 가기</button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="user-page">
      <Header />

      <main className="user-container">
        <section className="user-hero-card">
          <p className="user-badge">MY COMMENTS</p>
          <h1>내 댓글</h1>
          <p>내가 작성한 댓글을 확인할 수 있습니다.</p>
        </section>

        <section className="user-card">
          <h2>댓글 {myComments.length}개</h2>

          {isLoading ? (
            <p className="empty-text">댓글 불러오는 중...</p>
          ) : myComments.length === 0 ? (
            <p className="empty-text">아직 작성한 댓글이 없습니다.</p>
          ) : (
            <ul className="activity-list">
              {myComments.map((comment) => (
                <li key={comment.id}>
                  <strong>{comment.writer}</strong>{" "}
                  <span>{comment.content}</span>

                  <div>
                    <small>{comment.createdAt}</small>{" "}
                    <Link to={`/community/posts/${comment.postId}`}>
                      원문 보기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default MyCommentsPage;