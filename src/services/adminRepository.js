import api from "../api/client";

// akses API murni (repository)
export function fetchApprovalList() {
  return api("/admin/approval");
}

export function approveUser(id, payload) {
  return api(`/admin/approval/${id}/approve`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function rejectUser(id) {
  return api(`/admin/approval/${id}/reject`, {
    method: "POST",
  });
}
