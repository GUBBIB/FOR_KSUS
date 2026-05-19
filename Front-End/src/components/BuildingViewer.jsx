// src/components/BuildingViewer.jsx

import { useEffect, useState } from 'react'
import {
  getBuildings,
  getClassrooms,
  getTimetable
} from '../api/building.jsx'

export default function BuildingViewer() {
  const [buildings, setBuildings] = useState([])
  const [classrooms, setClassrooms] = useState([])
  const [timetable, setTimetable] = useState([])

  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [selectedClassroom, setSelectedClassroom] = useState(null)

  // 에브리타임 시간 변환
  // 108 = 09:00
  // 120 = 10:00
  // 132 = 11:00
  const formatTime = (value) => {
    if (value == null) return ''

    const hour = Math.floor(value / 12)
    const minute = (value % 12) * 5

    return `${String(hour).padStart(2, '0')}:${String(
      minute
    ).padStart(2, '0')}`
  }

  // 요일 변환
  const formatDay = (day) => {
    const days = ['월', '화', '수', '목', '금', '토', '일']

    return days[day] || day
  }

  // 건물 조회
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await getBuildings()
        setBuildings(data)
      } catch (err) {
        console.error(err)
        alert('건물 조회 실패')
      }
    }

    fetchBuildings()
  }, [])

  // 건물 클릭
  const handleBuildingClick = async (building) => {
    setSelectedBuilding(building)
    setSelectedClassroom(null)
    setTimetable([])

    try {
      const data = await getClassrooms(building.id)
      setClassrooms(data)
    } catch (err) {
      console.error(err)
      alert('강의실 조회 실패')
    }
  }

  // 강의실 클릭
  const handleClassroomClick = async (classroom) => {
    setSelectedClassroom(classroom)

    try {
      const data = await getTimetable(
        selectedBuilding.id,
        classroom.id
      )

      console.log(data)

      setTimetable(data)
    } catch (err) {
      console.error(err)
      alert('시간표 조회 실패')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '40px',
        padding: '20px',
        alignItems: 'flex-start'
      }}
    >
      {/* 건물 목록 */}
      <div>
        <h2>건물 목록</h2>

        {buildings.map((building) => (
          <div
            key={building.id}
            onClick={() => handleBuildingClick(building)}
            style={{
              padding: '10px',
              border: '1px solid gray',
              borderRadius: '8px',
              marginBottom: '10px',
              cursor: 'pointer',
              minWidth: '180px'
            }}
          >
            {building.name}
          </div>
        ))}
      </div>

      {/* 강의실 목록 */}
      <div>
        <h2>
          {selectedBuilding
            ? `${selectedBuilding.name} 강의실`
            : '강의실'}
        </h2>

        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            onClick={() => handleClassroomClick(classroom)}
            style={{
              padding: '10px',
              border: '1px solid #aaa',
              borderRadius: '8px',
              marginBottom: '10px',
              cursor: 'pointer',
              minWidth: '200px'
            }}
          >
            {classroom.fullName}
          </div>
        ))}
      </div>

      {/* 시간표 */}
      <div>
        <h2>
          {selectedClassroom
            ? `${selectedClassroom.fullName} 시간표`
            : '시간표'}
        </h2>

        {timetable.length === 0 && (
          <div>시간표 데이터 없음</div>
        )}

        {timetable.map((lecture, idx) => (
          <div
            key={idx}
            style={{
              padding: '12px',
              border: '1px solid lightgray',
              borderRadius: '8px',
              marginBottom: '12px',
              minWidth: '320px'
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '16px',
                marginBottom: '6px'
              }}
            >
              {lecture.lectureName}
            </div>

            <div>
              교수: {lecture.professor}
            </div>

            <div>
              시간:{' '}
              {formatDay(lecture.dayOfWeek)}{' '}
              {formatTime(lecture.startTime)} ~{' '}
              {formatTime(lecture.endTime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}