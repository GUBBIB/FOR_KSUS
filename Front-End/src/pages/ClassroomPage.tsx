import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import {
  getBuildings,
  getClassrooms,
  getClassroomTimetable,
} from "../api/classroomApi";
import "./ClassroomPage.css";

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

type TimetableMap = Record<number, Timetable[]>;

const days = [
  { value: 0, label: "월요일" },
  { value: 1, label: "화요일" },
  { value: 2, label: "수요일" },
  { value: 3, label: "목요일" },
  { value: 4, label: "금요일" },
];

const TIME_MAP: Record<number, string> = {
  108: "09:00",
  120: "10:00",
  132: "11:00",
  144: "12:00",
  156: "13:00",
  168: "14:00",
  180: "15:00",
  192: "16:00",
  204: "17:00",
  216: "18:00",
  228: "19:00",
  240: "20:00",
};

const formatTime = (time: number) => {
  return TIME_MAP[time] ?? String(time);
};

function ClassroomPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [timetableMap, setTimetableMap] = useState<TimetableMap>({});

  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    null
  );
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedTime, setSelectedTime] = useState<string>("09:00");

  const [isBuildingLoading, setIsBuildingLoading] = useState(false);
  const [isClassroomLoading, setIsClassroomLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedTimeNumber = Number(selectedTime.replace(":", ""));

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setIsBuildingLoading(true);
        setErrorMessage("");

        const data: Building[] = await getBuildings();
        setBuildings(data);

        if (data.length > 0) {
          setSelectedBuildingId(data[0].id);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error instanceof Error ? error.message : "건물 목록 조회 실패"
        );
      } finally {
        setIsBuildingLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  useEffect(() => {
    if (!selectedBuildingId) return;

    const fetchClassroomsAndTimetables = async () => {
      try {
        setIsClassroomLoading(true);
        setErrorMessage("");
        setClassrooms([]);
        setTimetableMap({});

        const classroomData: Classroom[] = await getClassrooms(
          selectedBuildingId
        );

        setClassrooms(classroomData);

        const timetableResults = await Promise.all(
          classroomData.map(async (classroom) => {
            const timetable: Timetable[] = await getClassroomTimetable(
              selectedBuildingId,
              classroom.id
            );

            return {
              classroomId: classroom.id,
              timetable,
            };
          })
        );

        const nextTimetableMap: TimetableMap = {};

        timetableResults.forEach((result) => {
          nextTimetableMap[result.classroomId] = result.timetable;
        });

        setTimetableMap(nextTimetableMap);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error instanceof Error ? error.message : "강의실 정보 조회 실패"
        );
      } finally {
        setIsClassroomLoading(false);
      }
    };

    fetchClassroomsAndTimetables();
  }, [selectedBuildingId]);

  const emptyClassrooms = useMemo(() => {
    return classrooms.filter((classroom) => {
      const timetable = timetableMap[classroom.id] || [];

      const hasLectureNow = timetable.some((lecture) => {
        return (
          lecture.dayOfWeek === selectedDay &&
          lecture.startTime <= selectedTimeNumber &&
          selectedTimeNumber < lecture.endTime
        );
      });

      return !hasLectureNow;
    });
  }, [classrooms, timetableMap, selectedDay, selectedTimeNumber]);

  const occupiedClassrooms = useMemo(() => {
    return classrooms.filter((classroom) => {
      const timetable = timetableMap[classroom.id] || [];

      return timetable.some((lecture) => {
        return (
          lecture.dayOfWeek === selectedDay &&
          lecture.startTime <= selectedTimeNumber &&
          selectedTimeNumber < lecture.endTime
        );
      });
    });
  }, [classrooms, timetableMap, selectedDay, selectedTimeNumber]);

  const getCurrentLecture = (classroomId: number) => {
    const timetable = timetableMap[classroomId] || [];

    return timetable.find((lecture) => {
      return (
        lecture.dayOfWeek === selectedDay &&
        lecture.startTime <= selectedTimeNumber &&
        selectedTimeNumber < lecture.endTime
      );
    });
  };

  return (
    <div className="classroom-page">
      <Header />

      <main className="classroom-container">
        <section className="classroom-hero">
          <div>
            <p className="classroom-badge">CLASSROOM</p>
          </div>
        </section>

        <section className="classroom-filter-card">
          {errorMessage && <p className="error-text">{errorMessage}</p>}

          {isBuildingLoading ? (
            <p className="empty-text">건물 목록 불러오는 중...</p>
          ) : (
            <div className="filter-grid">
              <label>
                <span>건물</span>
                <select
                  value={selectedBuildingId ?? ""}
                  onChange={(e) =>
                    setSelectedBuildingId(Number(e.target.value))
                  }
                >
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.fullName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>요일</span>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                >
                  {days.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>시간</span>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </label>
            </div>
          )}
        </section>

        {isClassroomLoading ? (
          <section className="classroom-card">
            <p className="empty-text">강의실과 시간표 불러오는 중...</p>
          </section>
        ) : (
          <section className="classroom-grid">
            <article className="classroom-card">
              <div className="card-title-row">
                <h2>사용 가능한 강의실</h2>
                <span>{emptyClassrooms.length}개</span>
              </div>

              {emptyClassrooms.length === 0 ? (
                <p className="empty-text">현재 비어있는 강의실이 없습니다.</p>
              ) : (
                <div className="classroom-list">
                  {emptyClassrooms.map((classroom) => (
                    <Link
                      key={classroom.id}
                      to={`/classrooms/${selectedBuildingId}/${classroom.id}`}
                      className="classroom-item available"
                    >
                      <div>
                        <strong>{classroom.fullName}</strong>
                        <p>현재 강의 없음</p>
                      </div>

                      <span>사용 가능</span>
                    </Link>
                  ))}
                </div>
              )}
            </article>

            <article className="classroom-card">
              <div className="card-title-row">
                <h2>사용 중인 강의실</h2>
                <span>{occupiedClassrooms.length}개</span>
              </div>

              {occupiedClassrooms.length === 0 ? (
                <p className="empty-text">현재 사용 중인 강의실이 없습니다.</p>
              ) : (
                <div className="classroom-list">
                  {occupiedClassrooms.map((classroom) => {
                    const lecture = getCurrentLecture(classroom.id);

                    return (
                      <Link
                        key={classroom.id}
                        to={`/classrooms/${selectedBuildingId}/${classroom.id}`}
                        className="classroom-item occupied"
                      >
                        <div>
                          <strong>{classroom.fullName}</strong>
                          <p>
                            {lecture?.lectureName} / {lecture?.professor}
                          </p>
                        </div>

                        <span>
                          {lecture
                            ? `${formatTime(lecture.startTime)}~${formatTime(
                                lecture.endTime
                              )}`
                            : "사용 중"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </article>
          </section>
        )}
      </main>
    </div>
  );
}

export default ClassroomPage;