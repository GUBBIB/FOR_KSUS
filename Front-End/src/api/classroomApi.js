const API_BASE = "/api/v1/everytime";

const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "요청 실패");
  }

  return data;
};

export const getBuildings = async () => {
  const response = await fetch(`${API_BASE}/buildings`);
  return handleResponse(response);
};

export const getClassrooms = async (buildingId) => {
  const response = await fetch(`${API_BASE}/buildings/${buildingId}/classrooms`);
  return handleResponse(response);
};

export const getClassroomTimetable = async (buildingId, classroomId) => {
  const response = await fetch(
    `${API_BASE}/buildings/${buildingId}/classrooms/${classroomId}/timetable`
  );

  return handleResponse(response);
};