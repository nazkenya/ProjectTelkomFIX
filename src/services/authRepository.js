import api from "../api/client";

export function loginRequest(payload) {
  return api("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
