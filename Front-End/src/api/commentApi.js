import axiosInstance from "./axiosInstance";

export const getComments = (boardId, postId) => {
  return axiosInstance.get(`/boards/${boardId}/posts/${postId}/comments/`);
};

export const createComment = (boardId, postId, data) => {
  return axiosInstance.post(`/boards/${boardId}/posts/${postId}/comments/`, data);
};

export const updateComment = (boardId, postId, commentId, data) => {
  return axiosInstance.put(
    `/boards/${boardId}/posts/${postId}/comments/${commentId}`,
    data
  );
};

export const deleteComment = (boardId, postId, commentId) => {
  return axiosInstance.delete(
    `/boards/${boardId}/posts/${postId}/comments/${commentId}`
  );
};