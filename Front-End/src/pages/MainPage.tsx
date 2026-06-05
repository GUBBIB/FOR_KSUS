import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getBusStops, getNextBus } from "../api/busApi";
import {
  getBuildings,
  getClassrooms,
  getClassroomTimetable,
} from "../api/classroomApi";
import "./MainPage.css";

type Notice = {
  id: number;
  title: string;
  createdAt: string;
};

type Post = {
  id: number;
  title: string;
  writer: string;
  viewCount: number;
};

type BusStop = {
  id: number;
  name: string;
};

type NextBus = {
  departureTime: string;
  remainingMinutes: number;
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

function MainPage() {
  const notices: Notice[] = JSON.parse(localStorage.getItem("notices") || "[]");
  const posts: Post[] = JSON.parse(localStorage.getItem("posts") || "[]");

  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [selectedBusStop, setSelectedBusStop] = useState<BusStop | null>(null);
  const [nextBus, setNextBus] = useState<NextBus | null>(null);
  const [busError, setBusError] = useState("");
  const [isBusLoading, setIsBusLoading] = useState(false);

  const [emptyClassrooms, setEmptyClassrooms] = useState<EmptyClassroom[]>([]);
  const [isClassroomLoading, setIsClassroomLoading] = useState(false);
  const [classroomError, setClassroomError] = useState("");

  const latestNotices = notices.slice(0, 3);

  const popularPosts = [...posts]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3);

  const busProgress = nextBus
    ? Math.max(0, Math.min(100, ((20 - nextBus.remainingMinutes) / 20) * 100))
    : 0;

  useEffect(() => {
    const fetchBusInfo = async () => {
      try {
        setIsBusLoading(true);
        setBusError("");

        const stopsData = await getBusStops();
        const stopList: BusStop[] = Array.isArray(stopsData)
          ? stopsData
          : [stopsData];

        setBusStops(stopList);

        if (stopList.length === 0) {
          setBusError("등록된 정류장이 없습니다.");
          return;
        }

        const firstStop = stopList[0];
        setSelectedBusStop(firstStop);

        const nextBusData = await getNextBus(firstStop.id);
        setNextBus(nextBusData);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setBusError(error.message);
        } else {
          setBusError("버스 정보를 불러오지 못했습니다.");
        }

        setNextBus(null);
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

        if (error instanceof Error) {
          setClassroomError(error.message);
        } else {
          setClassroomError("빈 강의실 정보를 불러오지 못했습니다.");
        }
      } finally {
        setIsClassroomLoading(false);
      }
    };

    fetchEmptyClassrooms();
  }, []);

  const handleChangeBusStop = async (busStopId: number) => {
    const nextSelectedStop = busStops.find((stop) => stop.id === busStopId);

    if (!nextSelectedStop) return;

    try {
      setIsBusLoading(true);
      setBusError("");
      setSelectedBusStop(nextSelectedStop);

      const nextBusData = await getNextBus(nextSelectedStop.id);
      setNextBus(nextBusData);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setBusError(error.message);
      } else {
        setBusError("다음 버스 정보를 불러오지 못했습니다.");
      }

      setNextBus(null);
    } finally {
      setIsBusLoading(false);
    }
  };

  return (
    <div className="main-page">
      <Header />

      <main className="main-container">
        <section className="map-hero-card">
          <div className="map-hero-text">
            <p className="hero-badge">경성대학교 공대 학생들을 위한 사이트</p>  
            <h1>공대 생활, 이젠 편리하게!</h1>
            <p>
              공대 캠퍼스 맵, 셔틀버스 정보, 빈 강의실 찾기 등 다양한 기능을
              제공합니다.
            </p>

            
          </div>

          <Link to="/engineering-map" className="map-preview">
            <img src="/images/engineering-map.png" alt="공대 캠퍼스 맵" />
          </Link>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-card bus-card">
            <div className="card-header bus-card-header">
              <div className="bus-title-row">
                <h2>셔틀버스 정보</h2>

                {busStops.length > 0 && (
                  <select
                    className="bus-stop-select"
                    value={selectedBusStop?.id ?? ""}
                    onChange={(e) =>
                      handleChangeBusStop(Number(e.target.value))
                    }
                  >
                    {busStops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <Link to="/bus">상세보기</Link>
            </div>

            <div className="bus-route">
              <strong>{selectedBusStop?.name || "정류장 정보 없음"}</strong>

              {isBusLoading ? (
                <span>조회 중...</span>
              ) : nextBus ? (
                <span>{nextBus.remainingMinutes}분 후 도착</span>
              ) : (
                <span>운행 종료</span>
              )}
            </div>

            <div className="progress-line">
              <div
                className="progress-fill"
                style={{ width: `${busProgress}%` }}
              />
            </div>

            {nextBus ? (
              <p className="sub-text">
                다음 출발 시간: {nextBus.departureTime}
              </p>
            ) : (
              <p className="sub-text">
                {busError ||
                  "오늘 운행이 종료되었거나 다음 버스 정보가 없습니다."}
              </p>
            )}
          </article>

          <article className="dashboard-card classroom-card">
            <div className="card-header">
              <h2>빈 강의실 찾기</h2>
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
              <h2>최신 공지사항</h2>
              <Link to="/notices">더보기</Link>
            </div>

            {latestNotices.length === 0 ? (
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
              <h2>인기 커뮤니티 글</h2>
              <Link to="/community">더보기</Link>
            </div>

            {popularPosts.length === 0 ? (
              <p className="empty-text">아직 인기글이 없습니다.</p>
            ) : (
              <ul>
                {popularPosts.map((post) => (
                  <li key={post.id}>
                    <Link to={`/community/posts/${post.id}`}>
                      {post.title}
                    </Link>
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