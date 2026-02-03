// format untuk input type="date"
export function formatDate(value) {
  if (!value) return "";
  if (typeof value === "string") {
    // ambil bagian tanggal saja
    if (value.includes(" ")) return value.split(" ")[0];
    if (value.includes("T")) return value.split("T")[0];
    return value;
  }
  return "";
}
