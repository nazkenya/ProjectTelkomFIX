// src/services/amRepository.js
import api from "../api/client";

// GET LIST AM
export function fetchAMList(fields = []) {
  const params =
    Array.isArray(fields) && fields.length > 0
      ? `?fields=${fields.join(",")}`
      : "";
  return api(`/am${params}`);
}

// INSERT AM (sesuai fetch wrapper)
export function postAM(data) {
  return api("/am", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// GET DETAIL AM
export function fetchAMDetail(param) {
  const query = new URLSearchParams();
  if (param?.nik) query.append("nik", param.nik);
  if (param?.idSales) query.append("idsales", param.idSales);

  return api(`/am/detail?${query.toString()}`);
}
