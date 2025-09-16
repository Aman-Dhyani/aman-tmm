import { items } from "@/constants/items";

// 1️⃣ Normalize a plain object (just items)
function normalizeObject(obj: Record<string, any>): Record<string, number> {
  const normalized: Record<string, number> = {};

  items.forEach((item) => {
    const value = Number(obj[item.name] || 0);
    normalized[item.label] = value * item.multiplier;
  });

  return normalized;
}

function normalizeRow(row: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};

  // Preserve metadata
  if (row.Period) normalized.Period = row.Period;
  if (row.Date) normalized.Date = row.Date;
  if (row.Time) normalized.Time = row.Time;

  // Normalize values based on items
  items.forEach((item) => {
    const value = Number(row[item.name] || 0);
    normalized[item.label] = value * item.multiplier;
  });

  return normalized;
}

export { normalizeObject, normalizeRow };
