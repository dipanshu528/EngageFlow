import api from "./axios";

export const getAssignableUsers = async () => {
  const response = await api.get(
    "/users/get-assignable-users"
  );

  console.log("USER API RESPONSE:", response.data);

  return response.data;
};