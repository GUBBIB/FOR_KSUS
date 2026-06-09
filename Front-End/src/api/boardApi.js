const API_BASE = "/api/v1/boards";

const handleResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "요청 실패");
  }

  return data;
};

export const getPosts = async (boardId) => {
  const response = await fetch(`${API_BASE}/${boardId}/posts/`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(response);
};

export const getPostDetail = async (boardId, postId) => {
  const response = await fetch(`${API_BASE}/${boardId}/posts/${postId}`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(response);
};

export const createPost = async (boardId, data) => {
  const response = await fetch(`${API_BASE}/${boardId}/posts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const updatePost = async (boardId, postId, data) => {
  const response = await fetch(`${API_BASE}/${boardId}/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const deletePost = async (boardId, postId) => {
  const response = await fetch(`${API_BASE}/${boardId}/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(response);
};