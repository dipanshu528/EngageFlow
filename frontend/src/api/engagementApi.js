import api from "./axios";

export const createEngagement = async (engagementData) => {
  const response = await api.post("/engagements", engagementData);
  return response.data;
};

export const getEngagements = async () => {
  const response = await api.get("/engagements");
  return response.data;
};