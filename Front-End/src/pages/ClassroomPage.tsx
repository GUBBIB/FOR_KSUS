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

const TIME_OPTIONS = [
  { value: 108, label: "09:00" },
  { value: 120, label: "10:00" },
  { value: 132, label: "11:00" },
  { value: 144, label: "12:00" },
  { value: 156, label: "13:00" },
  { value: 168, label: "14:00" },
  { value: 180, label: "15:00" },
  { value: 192, label: "16:00" },
  { value: 204, label: "17:00" },
  { value: 216, label: "18:00" },
  { value: 228, label: "19:00" },
  { value: 240, label: "20:00" },
];

const formatTime = (time: number) => {
  const option = TIME_OPTIONS.find((item) => item.value === time);
  return option?.label ?? String(time);
};

const isLectureInSelectedTime = (
  lecture: Timetable,
  selectedDay: number,
  selectedTimeCode: number
) => {
  return (
    lecture.dayOfWeek === selectedDay &&
    lecture.startTime <= selectedTimeCode &&
    selectedTimeCode < lecture.endTime
  );
};

function ClassroomPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [timetableMap, setTimetableMap] = useState<TimetableMap>({});

  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    null
  );
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedTimeCode, setSelectedTimeCode] = useState<number>(108);

  const [isBuildingLoading, setIsBuildingLoading] = useState(false);
  const [isClassroomLoading, setIsClassroomLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setIsBuildingLoading(true);
        setErrorMessage("");

        const data = await getBuildings();
        const buildingList: Building[] = Array.isArray(data) ? data : [data];

        setBuildings(buildingList);

        if (buildingList.length > 0) {
          setSelectedBuildingId(buildingList[0].id);
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

        const classroomData = await getClassrooms(selectedBuildingId);
        const classroomList: Classroom[] = Array.isArray(classroomData)
          ? classroomData
          : [classroomData];

        setClassrooms(classroomList);

        const results = await Promise.allSettled(
          classroomList.map(async (classroom) => {
            const timetableData = await getClassroomTimetable(
              selectedBuildingId,
              classroom.id
            );

            const timetableList: Timetable[] = Array.isArray(timetableData)
              ? timetableData
              : [timetableData];

            return {
              classroomId: classroom.id,
              timetable: timetableList.filter(Boolean),
            };
          })
        );

        const nextTimetableMap: TimetableMap = {};

        results.forEach((result) => {
          if (result.status === "fulfilled") {
            nextTimetableMap[result.value.classroomId] = result.value.timetable;
          }
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

      const hasLectureNow = timetable.some((lecture) =>
        isLectureInSelectedTime(lecture, selectedDay, selectedTimeCode)
      );

      return !hasLectureNow;
    });
  }, [classrooms, timetableMap, selectedDay, selectedTimeCode]);

  const occupiedClassrooms = useMemo(() => {
    return classrooms.filter((classroom) => {
      const timetable = timetableMap[classroom.id] || [];

      return timetable.some((lecture) =>
        isLectureInSelectedTime(lecture, selectedDay, selectedTimeCode)
      );
    });
  }, [classrooms, timetableMap, selectedDay, selectedTimeCode]);

  const getCurrentLecture = (classroomId: number) => {
    const timetable = timetableMap[classroomId] || [];

    return timetable.find((lecture) =>
      isLectureInSelectedTime(lecture, selectedDay, selectedTimeCode)
    );
  };

  return (
    <div className="classroom-page">
      <Header />

      <main className="classroom-container">
        <section className="classroom-hero">
          <div>
            <p className="classroom-badge">CLASSROOM</p>
            <h1>빈 강의실 조회</h1>
            <p>
              건물과 시간을 선택하면 현재 강의가 없는 강의실만 확인할 수
              있습니다.
            </p>
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
                <select
                  value={selectedTimeCode}
                  onChange={(e) => setSelectedTimeCode(Number(e.target.value))}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
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
                        <p>선택한 시간에 강의 없음</p>
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
                            {lecture?.lectureName || "강의 중"} /{" "}
                            {lecture?.professor || "교수 정보 없음"}
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