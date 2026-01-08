export async function fetchRoles() {
  const res = await fetch('http://127.0.0.1:8000/api/roles')
  return res.json()
}
