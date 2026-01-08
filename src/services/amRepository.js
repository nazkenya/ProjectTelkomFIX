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

export function fetchAMDetail(nik) {
  return api(`/am/${nik}`);
}
