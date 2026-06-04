const API_BASE = "/api/v1/bus-notifications";

const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "요청 실패");
  }

  return data;
};

export const getBusStops = async () => {
  const response = await fetch(`${API_BASE}/bus-stops`);
  return handleResponse(response);
};

export const getBusSchedules = async (busStopId) => {
  const response = await fetch(`${API_BASE}/bus-stops/${busStopId}/schedules`);
  return handleResponse(response);
};

export const getNextBus = async (busStopId) => {
  const response = await fetch(`${API_BASE}/bus-stops/${busStopId}/next`);
  return handleResponse(response);
};