import { loginRequest } from "./authRepository";

export async function login(username, password) {
  try {
    const res = await loginRequest({ username, password });

    if (!res?.user) {
      throw new Error("Data user tidak ditemukan");
    }

    return res.user;
  } catch (err) {
    throw new Error(err.message || "Login gagal");
  }
}
