import api from "./axios";

export const createTaskTemplate = async (templateData) => {
  const response = await api.post(
    "/task-templates",
    templateData
  );

  return response.data;
};


export const getTaskTemplates = async () => {
  const response = await api.get(
    "/task-templates"
  );

  return response.data;
};


export const getTaskTemplatesByService = async (
  serviceId
) => {
  const response = await api.get(
    `/task-templates/service/${serviceId}`
  );

  return response.data;
};


export const updateTaskTemplate = async (
  id,
  data
) => {
  const response = await api.put(
    `/task-templates/${id}`,
    data
  );

  return response.data;
};