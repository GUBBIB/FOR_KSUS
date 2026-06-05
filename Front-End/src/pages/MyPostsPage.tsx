import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./UserPage.css";

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

function MyPostsPage() {
  const navigate = useNavigate();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const posts: Post[] = JSON.parse(localStorage.getItem("posts") || "[]");

  if (!currentUser) {
    return (
      <div className="user-page">
        <Header />
        <main className="user-container">
          <section className="user-hero-card">
            <h1>내 게시글</h1>
            <p>로그인 후 내가 쓴 글을 확인할 수 있습니다.</p>
            <button onClick={() => navigate("/login")}>로그인하러 가기</button>
          </section>
        </main>
      </div>
    );
  }

  const myPosts = posts.filter((post) => post.writerEmail === currentUser.email);

  return (
    <div className="user-page">
      <Header />

      <main className="user-container">
        <section className="user-hero-card">
          <p className="user-badge">MY POSTS</p>
          <h1>내 게시글</h1>
          <p>{currentUser.nickname}님이 작성한 게시글을 모아봤습니다.</p>
        </section>

        <section className="user-card">
          <div className="section-header">
            <h2>작성한 글 {myPosts.length}개</h2>

            <Link to="/community/write" className="action-link">
              글쓰기
            </Link>
          </div>

          {myPosts.length === 0 ? (
            <p className="empty-text">아직 작성한 글이 없습니다.</p>
          ) : (
            <ul className="activity-list">
              {myPosts.map((post) => (
                <li key={post.id}>
                  <Link to={`/community/posts/${post.id}`}>
                    <strong>{post.title}</strong>
                  </Link>

                  <p>{post.content}</p>

                  <small>
                    조회수 {post.viewCount} / 작성일 {post.createdAt}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default MyPostsPage;