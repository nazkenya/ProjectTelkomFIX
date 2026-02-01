import api from "../api/client";

// Repository = akses API murni
export function fetchAMList(fields = []) {
  // kalau backend support fields
  const params =
    Array.isArray(fields) && fields.length > 0
      ? "?fields=" + fields.join(",")
      : "";

  return api(`/am${params}`);
}

export function fetchAMDetail(param) {
  // backward compatible
  if (typeof param === "string") {
    return api.get(`/am/detail?nik=${param}`);
  }

  // new flexible mode
  const params = new URLSearchParams();
  if (param?.nik) params.append("nik", param.nik);
  if (param?.idSales) params.append("idsales", param.idSales);

  return api.get(`/am/detail?${params.toString()}`);
}
