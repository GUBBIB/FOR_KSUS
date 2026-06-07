import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getMyPosts } from "../api/userApi";
import "./UserPage.css";

type Post = {
  id: number;
  title: string;
  content: string;
  writer: string;
  viewCount: number;
  createdAt: string;
};

function MyPostsPage() {
  const navigate = useNavigate();

  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setIsLoading(true);

        const data = await getMyPosts();
        const postList: Post[] = Array.isArray(data) ? data : [data];

        setMyPosts(postList);
      } catch (error) {
        console.error(error);
        alert("로그인 후 내가 쓴 글을 확인할 수 있습니다.");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPosts();
  }, [navigate]);

  return (
    <div className="user-page">
      <Header />

      <main className="user-container">
        <section className="user-hero-card">
          <p className="user-badge">MY POSTS</p>
          <h1>내 게시글</h1>
          <p>내가 작성한 게시글을 확인할 수 있습니다.</p>
        </section>

        <section className="user-card">
          <div className="section-header">
            <h2>작성한 글 {myPosts.length}개</h2>

            <Link to="/community/write" className="action-link">
              글쓰기
            </Link>
          </div>

          {isLoading ? (
            <p className="empty-text">게시글 불러오는 중...</p>
          ) : myPosts.length === 0 ? (
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