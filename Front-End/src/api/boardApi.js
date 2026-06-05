import axiosInstance from "./axiosInstance";

export const getBoards = () => {
  return axiosInstance.get("/boards/");
};

export const getPosts = (boardId) => {
  return axiosInstance.get(`/boards/${boardId}/posts/`);
};

export const getPostDetail = (boardId, postId) => {
  return axiosInstance.get(`/boards/${boardId}/posts/${postId}`);
};

export const createPost = (boardId, data) => {
  return axiosInstance.post(`/boards/${boardId}/posts/`, data);
};

export const updatePost = (boardId, postId, data) => {
  return axiosInstance.put(`/boards/${boardId}/posts/${postId}`, data);
};

export const deletePost = (boardId, postId) => {
  return axiosInstance.delete(`/boards/${boardId}/posts/${postId}`);
};