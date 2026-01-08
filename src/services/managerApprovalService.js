import {
  fetchManagerApproval,
  approveManagerApproval,
  rejectManagerApproval,
} from "./managerApprovalRepository";

export async function getManagerApprovals(managerId) {
  try {
    return await fetchManagerApproval(managerId);
  } catch (err) {
    console.error("Get manager approval failed", err);
    return [];
  }
}

export async function approveManager(id) {
  return approveManagerApproval(id);
}

export async function rejectManager(id) {
  return rejectManagerApproval(id);
}
