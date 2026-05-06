
export const getBuildings = async () => {
    const res = await fetch('/api/v1/everytime/buildings')
  
    if (!res.ok) {
      throw new Error('건물 조회 실패')
    }
  
    return res.json()
  }
  
  export const getClassrooms = async (buildingId) => {
    const res = await fetch(`/api/v1/everytime/buildings/${buildingId}/classrooms`)
  
    if (!res.ok) {
      throw new Error('강의실 조회 실패')
    }
  
    return res.json()
  }