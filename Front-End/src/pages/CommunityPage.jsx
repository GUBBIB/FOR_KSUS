import { useEffect, useState } from "react";
import { getBoards, getPosts, createPost } from "../api/communityApi";

function CommunityPage() {
  const [boards, setBoards] = useState([]);
  const [posts, setPosts] = useState([]);

  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    getBoards()
      .then((res) => {
        setBoards(res.data);

        if (res.data.length > 0) {
          setSelectedBoardId(res.data[0].id);
        }
      })
      .catch((err) => console.error("게시판 조회 실패:", err));
  }, []);

  useEffect(() => {
    if (!selectedBoardId) return;

    getPosts(selectedBoardId)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setPosts(data);
      })
      .catch(() => setPosts([]));
  }, [selectedBoardId]);

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      await createPost(selectedBoardId, {
        title,
        content,
      });

      setTitle("");
      setContent("");

      const res = await getPosts(selectedBoardId);
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setPosts(data);
    } catch (err) {
      console.error("게시글 작성 실패:", err);
      alert("로그인이 필요하거나 작성 권한이 없습니다.");
    }
  };

  return (
    <section className="card">
      <h2>커뮤니티</h2>
      <p className="desc">게시판 API와 게시글 API가 연결되는 화면입니다.</p>

      <div className="community-head">
        <select
          value={selectedBoardId}
          onChange={(e) => setSelectedBoardId(e.target.value)}
        >
          {boards.map((board) => (
            <option key={board.id} value={board.id}>
              {board.title}
            </option>
          ))}
        </select>
      </div>

      <div className="write-box">
        <input
          placeholder="게시글 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="게시글 내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={handleCreatePost}>글쓰기</button>
      </div>

      <div className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="post-item" key={post.id}>
              <strong>{post.title}</strong>
              <p>{post.content}</p>
              <span>
                작성자: {post.writer} · 조회수: {post.viewCount}
              </span>
            </div>
          ))
        ) : (
          <p className="desc">게시글이 없습니다.</p>
        )}
      </div>
    </section>
  );
}

export default CommunityPage;