import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { getClassroomTimetable } from "../api/classroomApi";

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
  const hour = timeString.slice(0, 2);
  const minute = timeString.slice(2, 4);

  return `${hour}:${minute}`;
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

        setTimetable(data);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("강의실 시간표 조회 실패");
        }
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
      if (!result[lecture.dayOfWeek]) {
        result[lecture.dayOfWeek] = [];
      }

      result[lecture.dayOfWeek].push(lecture);
    });

    Object.keys(result).forEach((day) => {
      result[Number(day)].sort((a, b) => a.startTime - b.startTime);
    });

    return result;
  }, [timetable]);

  return (
    <div>
      <Header />

      <main>
        <h1>강의실 시간표</h1>

        <p>
          건물 ID: {buildingId} / 강의실 ID: {classroomId}
        </p>

        <button onClick={() => navigate("/classrooms")}>
          빈 강의실 조회로 돌아가기
        </button>

        <hr />

        {isLoading && <p>시간표 불러오는 중...</p>}

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {!isLoading && timetable.length === 0 && !errorMessage && (
          <p>등록된 시간표가 없습니다. 이 강의실은 현재 시간표상 비어 있습니다.</p>
        )}

        {!isLoading &&
          Object.entries(timetableByDay).map(([day, lectures]) => (
            <section key={day}>
              <h2>{dayLabels[Number(day)]}</h2>

              {lectures.length === 0 ? (
                <p>수업 없음</p>
              ) : (
                <ul>
                  {lectures.map((lecture, index) => (
                    <li key={`${lecture.lectureName}-${index}`}>
                      <strong>{lecture.lectureName}</strong>{" "}
                      <span>{lecture.professor}</span>{" "}
                      <span>
                        {formatTime(lecture.startTime)} ~{" "}
                        {formatTime(lecture.endTime)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
      </main>
    </div>
  );
}

export default ClassroomDetailPage;