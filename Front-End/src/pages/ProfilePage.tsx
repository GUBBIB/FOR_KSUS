import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./UserPage.css";

type User = {
  email: string;
  nickname: string;
};

type Post = {
  id: number;
  writerEmail: string;
};

type Comment = {
  id: number;
  writerEmail: string;
};

type Reply = {
  id: number;
  writerEmail: string;
};

function ProfilePage() {
  const navigate = useNavigate();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const posts: Post[] = JSON.parse(localStorage.getItem("posts") || "[]");
  const comments: Comment[] = JSON.parse(localStorage.getItem("comments") || "[]");
  const replies: Reply[] = JSON.parse(localStorage.getItem("replies") || "[]");

  if (!currentUser) {
    return (
      <div className="user-page">
        <Header />
        <main className="user-container">
          <section className="user-hero-card">
            <h1>프로필</h1>
            <p>로그인 후 프로필을 확인할 수 있습니다.</p>
            <button onClick={() => navigate("/login")}>로그인하러 가기</button>
          </section>
        </main>
      </div>
    );
  }

  const myPosts = posts.filter((post) => post.writerEmail === currentUser.email);
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
          <p className="user-badge">MY PROFILE</p>
          <h1>{currentUser.nickname}님</h1>
          <p>{currentUser.email}</p>
        </section>

        <section className="user-grid">
          <article className="user-card">
            <h2>내 활동 요약</h2>

            <div className="stat-list">
              <div>
                <strong>{myPosts.length}</strong>
                <span>작성한 글</span>
              </div>

              <div>
                <strong>{myComments.length}</strong>
                <span>작성한 댓글</span>
              </div>

              <div>
                <strong>{myReplies.length}</strong>
                <span>작성한 대댓글</span>
              </div>
            </div>
          </article>

          <article className="user-card">
            <h2>바로가기</h2>

            <div className="quick-links">
              <Link to="/myposts">내 게시글 보기</Link>
              <Link to="/mycomments">내 댓글 보기</Link>
              <Link to="/community">커뮤니티로 이동</Link>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;