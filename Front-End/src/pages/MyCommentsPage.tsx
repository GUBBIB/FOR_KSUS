import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./UserPage.css";

type User = {
  email: string;
  nickname: string;
};

type Comment = {
  id: number;
  postId: number;
  content: string;
  writer: string;
  writerEmail: string;
  createdAt: string;
};

type Reply = {
  id: number;
  postId: number;
  commentId: number;
  content: string;
  writer: string;
  writerEmail: string;
  createdAt: string;
};

function MyCommentsPage() {
  const navigate = useNavigate();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const comments: Comment[] = JSON.parse(
    localStorage.getItem("comments") || "[]"
  );

  const replies: Reply[] = JSON.parse(localStorage.getItem("replies") || "[]");

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

  const myComments = comments.filter(
    (comment) => comment.writerEmail === currentUser.email
  );

  const myReplies = replies.filter(
    (reply) => reply.writerEmail === currentUser.email
  );

  return (
    <div className="user-page">
      <Header />

      <main className="user-container">
        <section className="user-hero-card">
          <p className="user-badge">MY COMMENTS</p>
          <h1>내 댓글</h1>
          <p>내가 작성한 댓글과 대댓글을 한 번에 확인할 수 있습니다.</p>
        </section>

        <section className="user-grid">
          <article className="user-card">
            <h2>댓글 {myComments.length}개</h2>

            {myComments.length === 0 ? (
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
          </article>

          <article className="user-card">
            <h2>대댓글 {myReplies.length}개</h2>

            {myReplies.length === 0 ? (
              <p className="empty-text">아직 작성한 대댓글이 없습니다.</p>
            ) : (
              <ul className="activity-list">
                {myReplies.map((reply) => (
                  <li key={reply.id}>
                    <strong>{reply.writer}</strong>{" "}
                    <span>{reply.content}</span>

                    <div>
                      <small>{reply.createdAt}</small>{" "}
                      <Link to={`/community/posts/${reply.postId}`}>
                        원문 보기
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}

export default MyCommentsPage;