// src/components/BuildingViewer.jsx

import { useEffect, useState } from 'react'
import { getBuildings, getClassrooms } from '../api/building'

export default function BuildingViewer() {
  const [buildings, setBuildings] = useState([])
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [classrooms, setClassrooms] = useState([])

  // 건물 목록 불러오기
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await getBuildings()
        setBuildings(data)
      } catch (err) {
        console.error(err)
        alert('건물 불러오기 실패')
      }
    }

    fetchBuildings()
  }, [])

  // 건물 클릭 시 강의실 불러오기
  const handleBuildingClick = async (building) => {
    setSelectedBuilding(building)

    try {
      const data = await getClassrooms(building.id)
      setClassrooms(data)
    } catch (err) {
      console.error(err)
      alert('강의실 불러오기 실패')
    }
  }

  return (
    <div style={{ display: 'flex', gap: '40px' }}>
      
      {/* 건물 리스트 */}
      <div>
        <h2>건물 목록</h2>
        <ul>
          {buildings.map((b) => (
            <li
              key={b.id}
              style={{ cursor: 'pointer', marginBottom: '8px' }}
              onClick={() => handleBuildingClick(b)}
            >
              {b.name}
            </li>
          ))}
        </ul>
      </div>

      {/* 강의실 리스트 */}
      <div>
        <h2>
          {selectedBuilding
            ? `${selectedBuilding.name} 강의실`
            : '건물을 선택하세요'}
        </h2>

        <ul>
          {classrooms.map((c) => (
            <li key={c.id}>
              {c.fullName}
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}