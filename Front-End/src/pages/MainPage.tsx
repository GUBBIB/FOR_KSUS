import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getBusStops, getNextBus } from "../api/busApi";
import { getPosts } from "../api/boardApi";
import { getNotices } from "../api/noticeApi";
import {
  getBuildings,
  getClassrooms,
  getClassroomTimetable,
} from "../api/classroomApi";
import "./MainPage.css";

type Notice = {
  id: number;
  title: string;
  content?: string;
  writer?: string;
  viewCount?: number;
  createdAt: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  writer: string;
  viewCount: number;
  createdAt: string;
};

type BusStop = {
  id: number;
  name: string;
};

type NextBus = {
  departureTime: string;
  remainingMinutes: number;
};

type BusInfo = {
  stop: BusStop;
  nextBus: NextBus | null;
  errorMessage?: string;
};

type Building = {
  id: number;
  name: string;
  fullName: string;
};

type Classroom = {
  id: number;
  roomNumber: string;
  fullName: string;
};

type Timetable = {
  lectureName: string;
  professor: string;
  dayOfWeek: number;
  startTime: number;
  endTime: number;
};

type EmptyClassroom = {
  buildingId: number;
  classroomId: number;
  fullName: string;
};

const BOARD_ID = 1;

const getTodayNumber = () => {
  const day = new Date().getDay();

  if (day === 0 || day === 6) {
    return 1;
  }

  return day;
};

const getCurrentTimeNumber = () => {
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");

  return Number(`${hour}${minute}`);
};

const getBusProgress = (remainingMinutes: number) => {
  return Math.max(0, Math.min(100, ((20 - remainingMinutes) / 20) * 100));
};

function MainPage() {
  const [latestNotices, setLatestNotices] = useState<Notice[]>([]);
  const [isNoticeLoading, setIsNoticeLoading] = useState(false);
  const [noticeError, setNoticeError] = useState("");

  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [isPopularPostLoading, setIsPopularPostLoading] = useState(false);
  const [popularPostError, setPopularPostError] = useState("");

  const [busInfos, setBusInfos] = useState<BusInfo[]>([]);
  const [busError, setBusError] = useState("");
  const [isBusLoading, setIsBusLoading] = useState(false);

  const [emptyClassrooms, setEmptyClassrooms] = useState<EmptyClassroom[]>([]);
  const [isClassroomLoading, setIsClassroomLoading] = useState(false);
  const [classroomError, setClassroomError] = useState("");

  useEffect(() => {
    const fetchLatestNotices = async () => {
      try {
        setIsNoticeLoading(true);
        setNoticeError("");

        const data = await getNotices();
        const noticeList: Notice[] = Array.isArray(data) ? data : [data];

        const latestTwoNotices = [...noticeList]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 2);

        setLatestNotices(latestTwoNotices);
      } catch (error) {
        console.error(error);

        setNoticeError(
          error instanceof Error
            ? error.message
            : "최신 공지사항을 불러오지 못했습니다."
        );
      } finally {
        setIsNoticeLoading(false);
      }
    };

    fetchLatestNotices();
  }, []);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        setIsPopularPostLoading(true);
        setPopularPostError("");

        const data = await getPosts(BOARD_ID);
        const postList: Post[] = Array.isArray(data) ? data : [data];

        const topThreePosts = [...postList]
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, 3);

        setPopularPosts(topThreePosts);
      } catch (error) {
        console.error(error);

        setPopularPostError(
          error instanceof Error
            ? error.message
            : "인기 게시글을 불러오지 못했습니다."
        );
      } finally {
        setIsPopularPostLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  useEffect(() => {
    const fetchBusInfo = async () => {
      try {
        setIsBusLoading(true);
        setBusError("");

        const stopsData = await getBusStops();
        const stopList: BusStop[] = Array.isArray(stopsData)
          ? stopsData
          : [stopsData];

        const firstTwoStops = stopList.slice(0, 2);

        if (firstTwoStops.length === 0) {
          setBusError("등록된 정류장이 없습니다.");
          setBusInfos([]);
          return;
        }

        const nextBusResults = await Promise.all(
          firstTwoStops.map(async (stop) => {
            try {
              const nextBus = await getNextBus(stop.id);

              return {
                stop,
                nextBus,
              };
            } catch (error) {
              console.error(error);

              return {
                stop,
                nextBus: null,
                errorMessage:
                  error instanceof Error
                    ? error.message
                    : "다음 버스 정보를 불러오지 못했습니다.",
              };
            }
          })
        );

        setBusInfos(nextBusResults);
      } catch (error) {
        console.error(error);

        setBusError(
          error instanceof Error
            ? error.message
            : "버스 정보를 불러오지 못했습니다."
        );

        setBusInfos([]);
      } finally {
        setIsBusLoading(false);
      }
    };

    fetchBusInfo();
  }, []);

  useEffect(() => {
    const fetchEmptyClassrooms = async () => {
      try {
        setIsClassroomLoading(true);
        setClassroomError("");

        const todayNumber = getTodayNumber();
        const currentTimeNumber = getCurrentTimeNumber();

        const buildingData = await getBuildings();
        const buildingList: Building[] = Array.isArray(buildingData)
          ? buildingData
          : [buildingData];

        const foundEmptyClassrooms: EmptyClassroom[] = [];

        for (const building of buildingList) {
          if (foundEmptyClassrooms.length >= 3) break;

          const classroomData = await getClassrooms(building.id);
          const classroomList: Classroom[] = Array.isArray(classroomData)
            ? classroomData
            : [classroomData];

          for (const classroom of classroomList) {
            if (foundEmptyClassrooms.length >= 3) break;

            const timetableData = await getClassroomTimetable(
              building.id,
              classroom.id
            );

            const timetableList: Timetable[] = Array.isArray(timetableData)
              ? timetableData
              : [timetableData];

            const hasLectureNow = timetableList.some((lecture) => {
              return (
                lecture.dayOfWeek === todayNumber &&
                lecture.startTime <= currentTimeNumber &&
                currentTimeNumber < lecture.endTime
              );
            });

            if (!hasLectureNow) {
              foundEmptyClassrooms.push({
                buildingId: building.id,
                classroomId: classroom.id,
                fullName: classroom.fullName,
              });
            }
          }
        }

        setEmptyClassrooms(foundEmptyClassrooms);
      } catch (error) {
        console.error(error);

        setClassroomError(
          error instanceof Error
            ? error.message
            : "빈 강의실 정보를 불러오지 못했습니다."
        );
      } finally {
        setIsClassroomLoading(false);
      }
    };

    fetchEmptyClassrooms();
  }, []);

  return (
    <div className="main-page">
      <Header />

      <main className="main-container">
        <section className="map-hero-card">
          <div className="map-hero-text">
            <p className="hero-badge">CAMPUS MAP</p>
            <h1>공대 맵보기</h1>
            <p>
              공과대학 주변 건물, 주차장, 흡연장, 편의시설 위치를
              확인하세요.
            </p>
          </div>

          <Link to="/engineering-map" className="map-preview">
            <img src="/images/engineering-map.png" alt="공대 캠퍼스 맵" />
          </Link>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-card bus-card">
            <div className="card-header">
              <h2>🚌 셔틀버스 정보</h2>
              <Link to="/bus">상세보기</Link>
            </div>

            {isBusLoading ? (
              <p className="empty-text">버스 정보 조회 중...</p>
            ) : busError ? (
              <p className="empty-text">{busError}</p>
            ) : busInfos.length === 0 ? (
              <p className="empty-text">표시할 셔틀버스 정보가 없습니다.</p>
            ) : (
              <div className="main-bus-list">
                {busInfos.map((busInfo, index) => {
                  const progress = busInfo.nextBus
                    ? getBusProgress(busInfo.nextBus.remainingMinutes)
                    : 0;

                  return (
                    <div key={busInfo.stop.id} className="main-bus-item">
                      <div className="bus-route">
                        <strong>
                          {index + 1}. {busInfo.stop.name}
                        </strong>

                        {busInfo.nextBus ? (
                          <span>
                            {busInfo.nextBus.remainingMinutes}분 후 도착
                          </span>
                        ) : (
                          <span>운행 종료</span>
                        )}
                      </div>

                      <div className="progress-line">
                        <div
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      {busInfo.nextBus ? (
                        <p className="sub-text">
                          다음 출발 시간: {busInfo.nextBus.departureTime}
                        </p>
                      ) : (
                        <p className="sub-text">
                          {busInfo.errorMessage ||
                            "오늘 운행이 종료되었거나 다음 버스 정보가 없습니다."}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          <article className="dashboard-card classroom-card">
            <div className="card-header">
              <h2>🏫 빈 강의실 찾기</h2>
              <Link to="/classrooms">조회하기</Link>
            </div>

            {isClassroomLoading ? (
              <p className="empty-text">빈 강의실 조회 중...</p>
            ) : classroomError ? (
              <p className="empty-text">{classroomError}</p>
            ) : emptyClassrooms.length === 0 ? (
              <p className="empty-text">현재 비어있는 강의실이 없습니다.</p>
            ) : (
              <div className="room-list">
                {emptyClassrooms.map((classroom) => (
                  <Link
                    key={classroom.classroomId}
                    to={`/classrooms/${classroom.buildingId}/${classroom.classroomId}`}
                    className="room-link"
                  >
                    <strong>{classroom.fullName}</strong>
                    <span>사용 가능</span>
                  </Link>
                ))}
              </div>
            )}
          </article>

          <article className="dashboard-card notice-card">
            <div className="card-header">
              <h2>📢 최신 공지사항</h2>
              <Link to="/notices">더보기</Link>
            </div>

            {isNoticeLoading ? (
              <p className="empty-text">최신 공지사항 조회 중...</p>
            ) : noticeError ? (
              <p className="empty-text">{noticeError}</p>
            ) : latestNotices.length === 0 ? (
              <p className="empty-text">등록된 공지사항이 없습니다.</p>
            ) : (
              <ul>
                {latestNotices.map((notice) => (
                  <li key={notice.id}>
                    <Link to={`/notices/${notice.id}`}>{notice.title}</Link>
                    <span>{notice.createdAt}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="dashboard-card community-card">
            <div className="card-header">
              <h2>🔥 인기 커뮤니티 글</h2>
              <Link to="/community">더보기</Link>
            </div>

            {isPopularPostLoading ? (
              <p className="empty-text">인기 게시글 조회 중...</p>
            ) : popularPostError ? (
              <p className="empty-text">{popularPostError}</p>
            ) : popularPosts.length === 0 ? (
              <p className="empty-text">아직 인기글이 없습니다.</p>
            ) : (
              <ul>
                {popularPosts.map((post) => (
                  <li key={post.id}>
                    <Link to={`/community/posts/${post.id}`}>{post.title}</Link>
                    <span>조회수 {post.viewCount}</span>
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

export default MainPage;