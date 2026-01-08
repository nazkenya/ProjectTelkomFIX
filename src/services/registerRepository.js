import api from "../api/client";

export const fetchManagers = () => api("/managers");

export const registerUser = (payload) =>
  api("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
