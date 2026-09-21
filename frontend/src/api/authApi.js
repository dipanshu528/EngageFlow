import api from "./axios";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};







// REGISTER USER

export const registerUser = async (
  name,
  email,
  password,
  role
) => {
  const response = await api.post(
    "/auth/register",
    {
      name,
      email,
      password,
      role,
    }
  );

  return response.data;
};

