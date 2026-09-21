import api from "./axios";

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

export const updateTaskStatus = async (
  taskId,
  status,
  comment = ""
) => {
  const response = await api.patch(
    `/tasks/${taskId}/status`,
    {
      status,
      comment,
    }
  );

  return response.data;
};


export const getTaskHistory = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}/history`);

  return response.data;
};