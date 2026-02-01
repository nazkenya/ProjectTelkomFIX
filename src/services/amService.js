import { fetchAMList, fetchAMDetail, postAM } from "./amRepository";

/* =========================
   GET LIST AM
========================= */
export async function getAMs(fields = []) {
  try {
    const res = await fetchAMList(fields);

    if (Array.isArray(res)) {
      return { data: res };
    }

    if (res && Array.isArray(res.data)) {
      return res;
    }

    return { data: [] };
  } catch (error) {
    console.error("❌ Gagal fetch AM:", error);
    return { data: [] };
  }
}

/* =========================
   INSERT AM
========================= */
export async function createAM(payload) {
  try {
    const res = await postAM(payload);
    return res;
  } catch (error) {
    console.error("❌ Gagal insert AM:", error);
    throw error;
  }
}

/* =========================
   GET DETAIL AM (FIXED)
========================= */
export async function getAMDetail({ nik, idSales }) {
  try {
    const res = await fetchAMDetail({ nik, idSales });
    return res?.data ?? res ?? null;
  } catch (error) {
    console.error("❌ Gagal fetch detail AM:", error);
    return null;
  }
}
