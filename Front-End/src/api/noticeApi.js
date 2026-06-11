const BOARD_API_BASE = "/api/v1/boards";
const MANAGEMENT_API_BASE = "/api/v1/management/notice";

export const NOTICE_BOARD_ID = 2;

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

export const getNotices = async () => {
  const response = await fetch(`${BOARD_API_BASE}/${NOTICE_BOARD_ID}/posts/`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(response);
};

export const getNoticeDetail = async (postId) => {
  const response = await fetch(
    `${BOARD_API_BASE}/${NOTICE_BOARD_ID}/posts/${postId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return handleResponse(response);
};

export const createNotice = async (data) => {
  const response = await fetch(MANAGEMENT_API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const updateNotice = async (postId, data) => {
  const response = await fetch(`${MANAGEMENT_API_BASE}/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const deleteNotice = async (postId) => {
  const response = await fetch(`${MANAGEMENT_API_BASE}/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(response);
};