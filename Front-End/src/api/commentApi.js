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

export const getComments = async (boardId, postId) => {
  const response = await fetch(
    `${API_BASE}/${boardId}/posts/${postId}/comments/`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return handleResponse(response);
};

export const createComment = async (boardId, postId, data) => {
  const response = await fetch(
    `${API_BASE}/${boardId}/posts/${postId}/comments/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  return handleResponse(response);
};

export const updateComment = async (boardId, postId, commentId, data) => {
  const response = await fetch(
    `${API_BASE}/${boardId}/posts/${postId}/comments/${commentId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  return handleResponse(response);
};

export const deleteComment = async (boardId, postId, commentId) => {
  const response = await fetch(
    `${API_BASE}/${boardId}/posts/${postId}/comments/${commentId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  return handleResponse(response);
};