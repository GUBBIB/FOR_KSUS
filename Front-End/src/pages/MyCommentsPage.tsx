import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getMyComments } from "../api/userApi";
import "./UserPage.css";

type Comment = {
  id: number;
  content: string;
  writer: string;
  createdAt: string;
};

function MyCommentsPage() {
  const [myComments, setMyComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMyComments = async () => {
      try {
        setIsLoading(true);

        const data = await getMyComments();
        const commentList: Comment[] = Array.isArray(data) ? data : [data];

        setMyComments(commentList);
      } catch (error) {
        console.error(error);
        alert("로그인 후 내가 쓴 댓글을 확인할 수 있습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyComments();
  }, []);

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
                    <small>{comment.createdAt}</small>
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