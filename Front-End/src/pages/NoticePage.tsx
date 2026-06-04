import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
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
  writerEmail: string;
  createdAt: string;
};

type SortType = "latest" | "oldest";

const ADMIN_EMAIL = "admin@ks.ac.kr";
const NOTICES_PER_PAGE = 10;

const defaultNotices: Notice[] = [
  {
    id: 1,
    title: "[필독] FOR KSUS 이용 안내",
    content:
      "FOR KSUS는 경성대 학생들을 위한 커뮤니티 서비스입니다. 서로 존중하며 이용해주세요.",
    writer: "관리자",
    writerEmail: ADMIN_EMAIL,
    createdAt: "2026-06-05",
  },
  {
    id: 2,
    title: "[공지] 커뮤니티 이용 규칙",
    content:
      "욕설, 비방, 도배성 게시글은 삭제될 수 있습니다. 건전한 커뮤니티 문화를 함께 만들어주세요.",
    writer: "관리자",
    writerEmail: ADMIN_EMAIL,
    createdAt: "2026-06-05",
  },
];

function NoticePage() {
  const navigate = useNavigate();

  const currentUser: User | null = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const isAdmin =
    currentUser?.email === ADMIN_EMAIL || currentUser?.role === "ADMIN";

  const savedNotices = localStorage.getItem("notices");

  if (!savedNotices) {
    localStorage.setItem("notices", JSON.stringify(defaultNotices));
  }

  const notices: Notice[] = savedNotices
    ? JSON.parse(savedNotices)
    : defaultNotices;

  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortType, setSortType] = useState<SortType>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedNotices = useMemo(() => {
    const keyword = searchKeyword.toLowerCase();

    const filtered = notices.filter((notice) => {
      return (
        notice.title.toLowerCase().includes(keyword) ||
        notice.content.toLowerCase().includes(keyword) ||
        notice.writer.toLowerCase().includes(keyword)
      );
    });

    return filtered.sort((a, b) => {
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
          {paginatedNotices.length === 0 ? (
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