import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getPosts } from "../api/boardApi";
import "./BoardPage.css";

type User = {
  email: string;
  nickname: string;
  role?: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  writer: string;
  viewCount: number;
  createdAt: string;
};

type SortType = "latest" | "views";

const BOARD_ID = 1;
const POSTS_PER_PAGE = 10;

function BoardPage() {
  const navigate = useNavigate();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [posts, setPosts] = useState<Post[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortType, setSortType] = useState<SortType>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getPosts(BOARD_ID);
        const postList: Post[] = Array.isArray(data) ? data : [data];

        setPosts(postList);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error instanceof Error ? error.message : "게시글 목록 조회 실패"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

  const handleWriteClick = () => {
    if (!currentUser) {
      alert("로그인 후 글쓰기가 가능합니다.");
      navigate("/login");
      return;
    }

    navigate("/community/write");
  };

  return (
    <div className="board-page">
      <Header />

      <main className="board-container">
        <section className="board-hero">
          <div>
            <p className="board-badge">COMMUNITY</p>
            <h1>커뮤니티</h1>
            <p>경성대 학생들과 자유롭게 이야기를 나눠보세요.</p>
          </div>

          <button type="button" className="write-button" onClick={handleWriteClick}>
            글쓰기
          </button>
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
          {isLoading ? (
            <p className="empty-text">게시글 불러오는 중...</p>
          ) : errorMessage ? (
            <p className="empty-text">{errorMessage}</p>
          ) : paginatedPosts.length === 0 ? (
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