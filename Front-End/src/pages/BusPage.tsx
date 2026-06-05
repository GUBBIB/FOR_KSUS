import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getBusSchedules, getBusStops, getNextBus } from "../api/busApi";
import "./BusPage.css";

type BusStop = {
  id: number;
  name: string;
};

type BusSchedule = {
  id: number;
  departureTime: string;
};

type NextBus = {
  departureTime: string;
  remainingMinutes: number;
};

function BusPage() {
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [selectedBusStopId, setSelectedBusStopId] = useState<number | null>(
    null
  );

  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [nextBus, setNextBus] = useState<NextBus | null>(null);

  const [isStopLoading, setIsStopLoading] = useState(false);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const busProgress = nextBus
    ? Math.max(0, Math.min(100, ((20 - nextBus.remainingMinutes) / 20) * 100))
    : 0;

  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        setIsStopLoading(true);
        setErrorMessage("");

        const data = await getBusStops();
        const stopData: BusStop[] = Array.isArray(data) ? data : [data];

        setBusStops(stopData);

        if (stopData.length > 0) {
          setSelectedBusStopId(stopData[0].id);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error instanceof Error ? error.message : "정류장 목록 조회 실패"
        );
      } finally {
        setIsStopLoading(false);
      }
    };

    fetchBusStops();
  }, []);

  useEffect(() => {
    if (!selectedBusStopId) return;

    const fetchBusInfo = async () => {
      try {
        setIsScheduleLoading(true);
        setErrorMessage("");
        setSchedules([]);
        setNextBus(null);

        const [scheduleData, nextBusData] = await Promise.all([
          getBusSchedules(selectedBusStopId),
          getNextBus(selectedBusStopId).catch(() => null),
        ]);

        const scheduleList: BusSchedule[] = Array.isArray(scheduleData)
          ? scheduleData
          : [scheduleData];

        setSchedules(scheduleList);
        setNextBus(nextBusData);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error instanceof Error ? error.message : "버스 정보 조회 실패"
        );
      } finally {
        setIsScheduleLoading(false);
      }
    };

    fetchBusInfo();
  }, [selectedBusStopId]);

  const selectedBusStop = busStops.find(
    (stop) => stop.id === selectedBusStopId
  );

  return (
    <div className="bus-page">
      <Header />

      <main className="bus-container">
        <section className="bus-hero">
          <div>
            <p className="bus-badge">SHUTTLE BUS</p>
          </div>
        </section>

        <section className="bus-filter-card">
          {errorMessage && <p className="error-text">{errorMessage}</p>}

          {isStopLoading ? (
            <p className="empty-text">정류장 목록 불러오는 중...</p>
          ) : (
            <label>
              <span>정류장 선택</span>

              <select
                value={selectedBusStopId ?? ""}
                onChange={(e) => setSelectedBusStopId(Number(e.target.value))}
              >
                {busStops.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </section>

        {isScheduleLoading ? (
          <section className="bus-card">
            <p className="empty-text">버스 정보 불러오는 중...</p>
          </section>
        ) : (
          <section className="bus-grid">
            <article className="bus-card next-bus-card">
              <div className="card-title-row">
                <h2>다음 버스</h2>
                <span>{selectedBusStop?.name || "정류장 없음"}</span>
              </div>

              {nextBus ? (
                <>
                  <div className="next-bus-time">
                    <strong>{nextBus.remainingMinutes}분 후 도착</strong>
                    <p>출발 시간 {nextBus.departureTime}</p>
                  </div>

                  <div className="bus-progress-line">
                    <div
                      className="bus-progress-fill"
                      style={{ width: `${busProgress}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="empty-text">
                  오늘 운행이 종료되었거나 다음 버스 정보가 없습니다.
                </p>
              )}
            </article>

            <article className="bus-card schedule-card">
              <div className="card-title-row">
                <h2>전체 시간표</h2>
                <span>{schedules.length}개</span>
              </div>

              {schedules.length === 0 ? (
                <p className="empty-text">등록된 시간표가 없습니다.</p>
              ) : (
                <div className="schedule-list">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="schedule-item">
                      <strong>{schedule.departureTime}</strong>
                      <span>출발</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        )}
      </main>
    </div>
  );
}

export default BusPage;