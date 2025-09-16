import { items } from "@/constants/items";

// validateForm
function validateForm(formData: FormData): boolean {
  for (let [_, value] of formData.entries()) {
    if (!value || isNaN(Number(value))) {
      return false;
    }
  }
  return true;
}

// Calculate stock
function calculateStock(formData: FormData): Record<string, number> {
  const data = Object.fromEntries(formData.entries());
  const calcData: Record<string, number> = {};

  items.forEach((item) => {
    if (item.type === "single") {
      calcData[item.name] = Number(data[item.name] || 0);
    } else {
      const packets = Number(data[`${item.name}_pkt`] || 0);
      const pieces = Number(data[`${item.name}_pcs`] || 0);
      calcData[item.name] = packets * item.multiplier + pieces;
    }
  });

  return calcData;
}

// SQL request functions
// validate inventory (for stock-in)
async function validate_inventory(branch: string | null, type: string | null, calcData: Record<string, number>) {
  const res = await fetch("/api/validate-inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch, type, calcData }),
  });

  if (!res.ok) throw new Error("Failed validate inventory");
  return await res.json();
}

// update inventory
async function update_inventory(branch: string | null, type: string | null, calcData: Record<string, number>) {
  const res = await fetch("/api/update-inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch, type, calcData }),
  });

  if (!res.ok) throw new Error("Failed to save stock");
  return await res.json();
}

// update sales
async function update_sales(branch: string | null, type: string | null, calcData: Record<string, number>) {
  const res = await fetch("/api/update-sales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch, type, calcData }),
  });

  if (!res.ok) throw new Error("Failed to save stock");
  return await res.json();
}

// update transactions
async function update_transactions(branch: string, amount: any) {
  const res = await fetch("/api/update-transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch, amount }),
  });

  if (!res.ok) throw new Error("Failed to save transaction");
  return await res.json();
}

// fetch current inventory
async function fetch_current_inventory() {
  const res = await fetch("/api/fetch-current-inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!res.ok) throw new Error("Failed to fetch inventory");
  return await res.json();
}

// fetch graph
async function fetch_reports(branch: any, period: string) {
  const res = await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch, period }),
  });

  if (!res.ok) throw new Error("Failed to fetch graph data");
  return await res.json();
}

// fetch 15 days average sales
async function fetch_15_days_avg_report(branch: any, days: number) {
  const res = await fetch("/api/15-days-avg-sales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch, days }),
  });

  if (!res.ok) throw new Error("Failed to fetch graph data");
  return await res.json();
}

// fetch branch revenue
async function fetch_branch_revenue(branch: any) {
  const res = await fetch("/api/branch-revenue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch }),
  });

  if (!res.ok) throw new Error("Failed to fetch graph data");
  return await res.json();
}

// crud pricings
async function crud_pricing(action: string, type?: any) {
  const res = await fetch("/api/crud-pricing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, type }),
  });

  if (!res.ok) throw new Error("Failed to save pricing");
  return await res.json();
}

// pos perday sales
async function pos_perday_sales() { 
  const res = await fetch("/api/pos-perday-sales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!res.ok) throw new Error("Failed to load pos perday sales");
  return await res.json();
}

// fetch pos sales
async function fetch_pos_sales(branch: any, period: string) {
  const res = await fetch("/api/pos-reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ branch, period }), // <-- include period here
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Failed to fetch pos_sales: " + txt);
  }
  return await res.json();
}

// fetch pos sales
async function fetch_pos_tables(page: number = 1, branch: string) {
  const res = await fetch("/api/pos-tables", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page, branch }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Failed to fetch pos_sales: " + txt);
  }

  return await res.json();
}

// tally sales
async function tally_sales(branch: any) {
  const res = await fetch("/api/tally-sales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({branch}),
  });

  if (!res.ok) throw new Error("Failed to fetch inventory");
  return await res.json();
}

export {
  validateForm,
  calculateStock,
  validate_inventory,
  update_inventory,
  update_sales,
  update_transactions,
  fetch_current_inventory,
  fetch_reports,
  fetch_15_days_avg_report,
  fetch_branch_revenue,
  crud_pricing,
  pos_perday_sales,
  fetch_pos_sales,
  fetch_pos_tables,
  tally_sales
};