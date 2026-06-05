import { useEffect, useState } from "react";
import { getBuildings } from "../api/classroomApi";

function CampusMapPage() {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  useEffect(() => {
    getBuildings()
      .then((res) => {
        setBuildings(res.data);
        if (res.data.length > 0) {
          setSelectedBuilding(res.data[0]);
        }
      })
      .catch((err) => console.error("건물 조회 실패:", err));
  }, []);

  return (
    <div className="page-grid">
      <section className="card">
        <h2>공대맵</h2>
        <p className="desc">API에서 받아온 건물 목록을 지도에 표시합니다.</p>

        <div className="campus-map">
          {buildings.slice(0, 6).map((building, index) => (
            <button
              key={building.id}
              className={`building b${index + 1}`}
              onClick={() => setSelectedBuilding(building)}
            >
              {building.name}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>건물 정보</h2>

        {selectedBuilding ? (
          <div className="building-info">
            <h3>{selectedBuilding.fullName || selectedBuilding.name}</h3>
            <p>건물 ID: {selectedBuilding.id}</p>
            <p>이 건물의 강의실 정보는 빈 강의실 메뉴에서 확인할 수 있습니다.</p>
          </div>
        ) : (
          <p className="desc">건물을 선택하세요.</p>
        )}
      </section>
    </div>
  );
}

export default CampusMapPage;