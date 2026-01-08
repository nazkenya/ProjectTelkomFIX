import {
  fetchApprovalList,
  approveUser,
  rejectUser,
} from "./adminRepository";

/**
 * Normalisasi response agar konsisten
 */
export async function getPendingApprovals() {
  try {
    const res = await fetchApprovalList();

    if (Array.isArray(res)) {
      return { data: res };
    }

    if (res && Array.isArray(res.data)) {
      return res;
    }

    return { data: [] };
  } catch (error) {
    console.error("❌ Gagal load approval:", error);
    return { data: [] };
  }
}

export async function approveApproval(id, approvedBy) {
  return approveUser(id, {
    approved_by: approvedBy,
  });
}

export async function rejectApproval(id) {
  return rejectUser(id);
}
