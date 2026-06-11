import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getNotices } from "../api/noticeApi";
import "./NoticePage.css";

type User = {
  email: string;
  nickname: string;
  role?: string;
};

type Notice = {
  id: number;
  title: string;
  content: string;
  writer: string;
  viewCount: number;
  createdAt: string;
};

type SortType = "latest" | "oldest";

const NOTICES_PER_PAGE = 10;

function NoticePage() {
  const navigate = useNavigate();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const isAdmin = currentUser?.role === "ADMIN";

  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortType, setSortType] = useState<SortType>("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getNotices();
        const noticeList: Notice[] = Array.isArray(data) ? data : [data];

        setNotices(noticeList);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error instanceof Error ? error.message : "공지사항 조회 실패"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const filteredAndSortedNotices = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    const filtered = notices.filter((notice) => {
      return (
        notice.title.toLowerCase().includes(keyword) ||
        notice.content.toLowerCase().includes(keyword) ||
        notice.writer.toLowerCase().includes(keyword)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortType === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notices, searchKeyword, sortType]);

  const totalPages = Math.ceil(
    filteredAndSortedNotices.length / NOTICES_PER_PAGE
  );

  const paginatedNotices = filteredAndSortedNotices.slice(
    (currentPage - 1) * NOTICES_PER_PAGE,
    currentPage * NOTICES_PER_PAGE
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
    <div className="notice-page">
      <Header />

      <main className="notice-container">
        <section className="notice-hero">
          <div>
            <p className="notice-badge">NOTICE</p>
            <h1>공지사항</h1>
            <p>FOR KSUS의 중요한 안내와 업데이트를 확인하세요.</p>
          </div>

          {isAdmin && (
            <button
              type="button"
              className="notice-write-button"
              onClick={() => navigate("/notices/write")}
            >
              공지 작성
            </button>
          )}
        </section>

        <section className="notice-toolbar">
          <div className="sort-tabs">
            <button
              type="button"
              className={sortType === "latest" ? "active" : ""}
              onClick={() => handleChangeSort("latest")}
            >
              최신순
            </button>

            <span>|</span>

            <button
              type="button"
              className={sortType === "oldest" ? "active" : ""}
              onClick={() => handleChangeSort("oldest")}
            >
              오래된순
            </button>
          </div>

          <input
            className="notice-search"
            placeholder="공지사항 검색"
            value={searchKeyword}
            onChange={handleChangeSearch}
          />
        </section>

        <section className="notice-list-card">
          {isLoading ? (
            <p className="empty-text">공지사항 불러오는 중...</p>
          ) : errorMessage ? (
            <p className="empty-text">{errorMessage}</p>
          ) : paginatedNotices.length === 0 ? (
            <p className="empty-text">공지사항이 없습니다.</p>
          ) : (
            <ul className="notice-list">
              {paginatedNotices.map((notice) => (
                <li key={notice.id} className="notice-item">
                  <Link to={`/notices/${notice.id}`}>
                    <h3>{notice.title}</h3>
                  </Link>

                  <p>{notice.content}</p>

                  <div className="notice-meta">
                    <span>{notice.writer}</span>
                    <span>조회수 {notice.viewCount}</span>
                    <span>{notice.createdAt}</span>
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

export default NoticePage;