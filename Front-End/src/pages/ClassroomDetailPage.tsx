import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { getClassroomTimetable } from "../api/classroomApi";
import "./ClassroomDetailPage.css";

type Timetable = {
  lectureName: string;
  professor: string;
  dayOfWeek: number;
  startTime: number;
  endTime: number;
};

const dayLabels: Record<number, string> = {
  1: "월요일",
  2: "화요일",
  3: "수요일",
  4: "목요일",
  5: "금요일",
};

const formatTime = (time: number) => {
  const timeString = time.toString().padStart(4, "0");
  return `${timeString.slice(0, 2)}:${timeString.slice(2, 4)}`;
};

function ClassroomDetailPage() {
  const navigate = useNavigate();
  const { buildingId, classroomId } = useParams();

  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!buildingId || !classroomId) return;

      try {
        setIsLoading(true);
        setErrorMessage("");

        const data: Timetable[] = await getClassroomTimetable(
          Number(buildingId),
          Number(classroomId)
        );

        setTimetable(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error instanceof Error ? error.message : "강의실 시간표 조회 실패"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetable();
  }, [buildingId, classroomId]);

  const timetableByDay = useMemo(() => {
    const result: Record<number, Timetable[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    timetable.forEach((lecture) => {
      result[lecture.dayOfWeek]?.push(lecture);
    });

    Object.keys(result).forEach((day) => {
      result[Number(day)].sort((a, b) => a.startTime - b.startTime);
    });

    return result;
  }, [timetable]);

  return (
    <div className="classroom-detail-page">
      <Header />

      <main className="classroom-detail-container">
        <section className="classroom-detail-hero">
          <div>
            <p className="classroom-detail-badge">TIMETABLE</p>
            <h1>강의실 시간표</h1>
            <p>
              선택한 강의실의 요일별 수업 정보를 확인할 수 있습니다.
            </p>
          </div>

          <button onClick={() => navigate("/classrooms")}>
            빈 강의실 조회로 돌아가기
          </button>
        </section>

        <section className="classroom-info-card">
          <div>
            <span>건물 ID</span>
            <strong>{buildingId}</strong>
          </div>

          <div>
            <span>강의실 ID</span>
            <strong>{classroomId}</strong>
          </div>

          <div>
            <span>등록된 수업</span>
            <strong>{timetable.length}개</strong>
          </div>
        </section>

        {isLoading && (
          <section className="classroom-detail-card">
            <p className="empty-text">시간표 불러오는 중...</p>
          </section>
        )}

        {errorMessage && (
          <section className="classroom-detail-card">
            <p className="error-text">{errorMessage}</p>
          </section>
        )}

        {!isLoading && !errorMessage && timetable.length === 0 && (
          <section className="classroom-detail-card">
            <p className="empty-text">
              등록된 시간표가 없습니다. 이 강의실은 시간표상 비어 있습니다.
            </p>
          </section>
        )}

        {!isLoading && !errorMessage && timetable.length > 0 && (
          <section className="timetable-grid">
            {Object.entries(timetableByDay).map(([day, lectures]) => (
              <article key={day} className="day-card">
                <div className="day-card-header">
                  <h2>{dayLabels[Number(day)]}</h2>
                  <span>{lectures.length}개 수업</span>
                </div>

                {lectures.length === 0 ? (
                  <p className="empty-text">수업 없음</p>
                ) : (
                  <div className="lecture-list">
                    {lectures.map((lecture, index) => (
                      <div
                        key={`${lecture.lectureName}-${lecture.startTime}-${index}`}
                        className="lecture-item"
                      >
                        <div>
                          <strong>{lecture.lectureName}</strong>
                          <p>{lecture.professor}</p>
                        </div>

                        <span>
                          {formatTime(lecture.startTime)} ~{" "}
                          {formatTime(lecture.endTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default ClassroomDetailPage;