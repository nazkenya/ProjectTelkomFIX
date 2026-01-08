import { fetchManagers, registerUser } from "./registerRepository";

export async function getManagers() {
  try {
    const res = await fetchManagers();
    return Array.isArray(res) ? res : res.data || [];
  } catch {
    return [];
  }
}

export async function register(form) {
  const res = await registerUser(form);
  return res;
}
