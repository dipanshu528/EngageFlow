import api from "./axios";

// GET NOTIFICATIONS
export const getNotifications = async () => {
  const response = await api.get(
    "/notifications"
  );

  return response.data;
};

// MARK ONE AS READ
export const markNotificationAsRead =
  async (id) => {
    const response = await api.patch(
      `/notifications/${id}/read`
    );

    return response.data;
  };

// MARK ALL AS READ
export const markAllNotificationsAsRead =
  async () => {
    const response = await api.patch(
      "/notifications/read-all"
    );

    return response.data;
  };