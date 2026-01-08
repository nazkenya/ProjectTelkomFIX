import { fetchAMList, fetchAMDetail } from "./amRepository";

/**
 * getAMs
 * - kompatibel dengan EcrmWorkspace
 * - return { data: [...] }
 */
export async function getAMs(fields = []) {
  try {
    const res = await fetchAMList(fields);

    // 🔑 normalize response
    if (Array.isArray(res)) {
      return { data: res };
    }

    if (res && Array.isArray(res.data)) {
      return res;
    }

    // fallback keras
    return { data: [] };
  } catch (error) {
    console.error("❌ Gagal fetch AM:", error);
    return { data: [] };
  }
}

export async function getAMByNik(nik) {
  try {
    const res = await fetchAMDetail(nik);
    return res?.data ?? res ?? null;
  } catch (error) {
    console.error("❌ Gagal fetch detail AM:", error);
    return null;
  }
}
