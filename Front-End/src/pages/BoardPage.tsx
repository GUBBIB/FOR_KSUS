import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "./BoardPage.css";

type Post = {
  id: number;
  title: string;
  content: string;
  writer: string;
  writerEmail: string;
  viewCount: number;
  createdAt: string;
};

type SortType = "latest" | "views";

const POSTS_PER_PAGE = 10;

function BoardPage() {
  const [posts] = useState<Post[]>(() => {
    return JSON.parse(localStorage.getItem("posts") || "[]");
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortType, setSortType] = useState<SortType>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedPosts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    const filtered = posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(keyword) ||
        post.content.toLowerCase().includes(keyword) ||
        post.writer.toLowerCase().includes(keyword)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortType === "views") {
        return b.viewCount - a.viewCount;
      }

      const dateDiff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      if (dateDiff !== 0) {
        return dateDiff;
      }

      return b.id - a.id;
    });
  }, [posts, searchKeyword, sortType]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = filteredAndSortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleChangeSort = (nextSortType: SortType) => {
    setSortType(nextSortType);
    setCurrentPage(1);
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="board-page">
      <Header />

      <main className="board-container">
        <section className="board-hero">
          <div>
            <p className="board-badge">COMMUNITY</p>
          </div>

          <Link to="/community/write" className="write-button">
            글쓰기
          </Link>
        </section>

        <section className="board-toolbar">
          <div className="sort-tabs">
            <button
              type="button"
              className={sortType === "views" ? "active" : ""}
              onClick={() => handleChangeSort("views")}
            >
              조회순
            </button>

            <span>|</span>

            <button
              type="button"
              className={sortType === "latest" ? "active" : ""}
              onClick={() => handleChangeSort("latest")}
            >
              최신순
            </button>
          </div>

          <input
            className="board-search"
            placeholder="검색어를 입력하세요"
            value={searchKeyword}
            onChange={handleChangeSearch}
          />
        </section>

        <section className="post-list-card">
          {paginatedPosts.length === 0 ? (
            <p className="empty-text">게시글이 없습니다.</p>
          ) : (
            <ul className="post-list">
              {paginatedPosts.map((post) => (
                <li key={post.id} className="post-item">
                  <Link to={`/community/posts/${post.id}`}>
                    <h3>{post.title}</h3>
                  </Link>

                  <p>{post.content}</p>

                  <div className="post-meta">
                    <span>{post.writer}</span>
                    <span>조회수 {post.viewCount}</span>
                    <span>{post.createdAt}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                type="button"
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              다음
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default BoardPage;