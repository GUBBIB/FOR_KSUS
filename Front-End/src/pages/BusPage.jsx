import { useEffect, useState } from "react";
import { getBusStops, getNextBus, getBusSchedules } from "../api/busApi";

function BusPage() {
  const [busStops, setBusStops] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState("");
  const [nextBus, setNextBus] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBusStops()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setBusStops(data);

        if (data.length > 0) {
          setSelectedStopId(data[0].id);
        }
      })
      .catch((err) => {
        console.error("정류장 조회 실패:", err);
      });
  }, []);

  useEffect(() => {
    if (!selectedStopId) return;

    setLoading(true);

    Promise.all([
      getNextBus(selectedStopId).catch(() => null),
      getBusSchedules(selectedStopId).catch(() => null),
    ])
      .then(([nextBusRes, schedulesRes]) => {
        setNextBus(nextBusRes?.data || null);

        const scheduleData = schedulesRes?.data;
        setSchedules(Array.isArray(scheduleData) ? scheduleData : scheduleData ? [scheduleData] : []);
      })
      .finally(() => setLoading(false));
  }, [selectedStopId]);

  const selectedStop = busStops.find(
    (stop) => String(stop.id) === String(selectedStopId)
  );

  return (
    <div className="page-grid">
      <section className="card">
        <div className="section-head">
          <div>
            <h2>공대 버스 정보</h2>
            <p className="desc">
              정류장을 선택하면 API에서 다음 버스 시간이 표시됩니다.
            </p>
          </div>
        </div>

        <select
          value={selectedStopId}
          onChange={(e) => setSelectedStopId(e.target.value)}
        >
          {busStops.map((stop) => (
            <option key={stop.id} value={stop.id}>
              {stop.name}
            </option>
          ))}
        </select>

        <div className="bus-card main-bus">
          <div className="bus-icon">🚌</div>

          <div>
            <h3>{selectedStop?.name || "정류장을 선택하세요"}</h3>

            {loading ? (
              <p>버스 정보를 불러오는 중...</p>
            ) : nextBus ? (
              <>
                <p>다음 출발 시간: {nextBus.departureTime}</p>
                <div className="bar">
                  <span style={{ width: "70%" }}></span>
                </div>
              </>
            ) : (
              <p>오늘 운행이 종료되었거나 정보가 없습니다.</p>
            )}
          </div>

          <strong>
            {nextBus ? `${nextBus.remainingMinutes}분 후` : "운행 종료"}
          </strong>
        </div>

        <h3 className="sub-title">전체 시간표</h3>

        <div className="schedule-list">
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <div className="schedule-item" key={schedule.id}>
                <span>출발 시간</span>
                <strong>{schedule.departureTime}</strong>
              </div>
            ))
          ) : (
            <p className="desc">표시할 시간표가 없습니다.</p>
          )}
        </div>
      </section>

      <section className="card">
        <h2>버스 위치 지도</h2>

        <div className="map-box">
          <div className="route"></div>
          <div className="pin">🚌</div>

          <div className="map-bubble">
            <strong>
              {nextBus ? `${nextBus.remainingMinutes}분 후` : "운행 종료"}
            </strong>
            <p>{nextBus ? nextBus.departureTime : "다음 버스 없음"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BusPage;