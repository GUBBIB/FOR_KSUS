const API_BASE = "/api/v1/users";

const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "요청 실패");
  }

  return data;
};

export const getMyProfile = async () => {
  const response = await fetch(`${API_BASE}/me`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(response);
};

export const getMyPostsCount = async () => {
  const response = await fetch(`${API_BASE}/my-posts/count`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(response);
};

export const getMyCommentsCount = async () => {
  const response = await fetch(`${API_BASE}/my-comments/count`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(response);
};

export const getMyPosts = async () => {
  const response = await fetch(`${API_BASE}/my-posts`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(response);
};

export const getMyComments = async () => {
  const response = await fetch(`${API_BASE}/my-comments`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(response);
};