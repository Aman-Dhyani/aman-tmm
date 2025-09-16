// utils/getDate.ts
const getFormattedDate = () => new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

// format date with time
function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "-";
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

// NEW: format date only (remove time)
function formatDateOnly(isoDate: string | null | undefined): string {
  const fullDate = formatDate(isoDate);
  return fullDate.split(" ")[0];
}

export { getFormattedDate, formatDate, formatDateOnly };
