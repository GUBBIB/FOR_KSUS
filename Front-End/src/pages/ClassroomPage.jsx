import { useEffect, useState } from "react";
import {
  getBuildings,
  getClassrooms,
  getClassroomTimetable,
} from "../api/classroomApi";

function ClassroomPage() {
  const [buildings, setBuildings] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [timetable, setTimetable] = useState([]);

  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedClassroomId, setSelectedClassroomId] = useState("");

  useEffect(() => {
    getBuildings()
      .then((res) => {
        setBuildings(res.data);

        if (res.data.length > 0) {
          setSelectedBuildingId(res.data[0].id);
        }
      })
      .catch((err) => console.error("건물 조회 실패:", err));
  }, []);

  useEffect(() => {
    if (!selectedBuildingId) return;

    getClassrooms(selectedBuildingId)
      .then((res) => {
        setClassrooms(res.data);

        if (res.data.length > 0) {
          setSelectedClassroomId(res.data[0].id);
        } else {
          setSelectedClassroomId("");
        }
      })
      .catch((err) => console.error("강의실 조회 실패:", err));
  }, [selectedBuildingId]);

  useEffect(() => {
    if (!selectedBuildingId || !selectedClassroomId) return;

    getClassroomTimetable(selectedBuildingId, selectedClassroomId)
      .then((res) => {
        setTimetable(res.data);
      })
      .catch(() => setTimetable([]));
  }, [selectedBuildingId, selectedClassroomId]);

  return (
    <section className="card">
      <h2>빈 강의실 찾기</h2>
      <p className="desc">
        건물과 강의실을 선택하면 API 시간표가 화면에 표시됩니다.
      </p>

      <div className="filter-box">
        <select
          value={selectedBuildingId}
          onChange={(e) => setSelectedBuildingId(e.target.value)}
        >
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.fullName || building.name}
            </option>
          ))}
        </select>

        <select
          value={selectedClassroomId}
          onChange={(e) => setSelectedClassroomId(e.target.value)}
        >
          {classrooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.fullName || room.roomNumber}
            </option>
          ))}
        </select>
      </div>

      <div className="room-list">
        {classrooms.map((room) => (
          <div className="room-card" key={room.id}>
            <strong>{room.fullName || room.roomNumber}</strong>
            <span>강의실</span>
          </div>
        ))}
      </div>

      <h3 className="sub-title">선택한 강의실 시간표</h3>

      <div className="timetable-list">
        {timetable.length > 0 ? (
          timetable.map((item, index) => (
            <div className="timetable-item" key={index}>
              <strong>{item.lectureName}</strong>
              <p>교수: {item.professor}</p>
              <p>
                요일: {item.dayOfWeek} / 시간: {item.startTime} ~{" "}
                {item.endTime}
              </p>
            </div>
          ))
        ) : (
          <p className="desc">등록된 시간표가 없습니다.</p>
        )}
      </div>
    </section>
  );
}

export default ClassroomPage;