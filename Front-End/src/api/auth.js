const API_BASE = "/api/v1/auth";

// (변경됨) fetch 응답 에러 처리 공통 함수
const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "요청 실패");
  }

  return data;
};

export const register = async (data) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // (변경됨)
    body: JSON.stringify(data),
  });

  return handleResponse(response); // (변경됨)
};

export const requestVerify = async (data) => {
  const response = await fetch(`${API_BASE}/student/verify-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(response); // (변경됨)
};

export const verifyCode = async (data) => {
  const response = await fetch(`${API_BASE}/student/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // (변경됨)
    body: JSON.stringify(data),
  });

  return handleResponse(response); // (변경됨)
};

export const login = async (data) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // (변경됨)
    body: JSON.stringify(data),
  });

  return handleResponse(response); // (변경됨)
};

export const logout = async () => {
  const response = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });

  return handleResponse(response);
};