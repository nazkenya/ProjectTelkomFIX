import api from "../api/client";

export const fetchManagerApproval = async (managerId) => {
  const res = await api(`/manager/approval/${managerId}`);
  return res.data;
};

export const approveManagerApproval = async (id) => {
  const res = await api(`/manager/approval/${id}/approve`, {
    method: "POST",
  });
  return res.data;
};

export const rejectManagerApproval = async (id) => {
  const res = await api(`/manager/approval/${id}/reject`, {
    method: "POST",
  });
  return res.data;
};
