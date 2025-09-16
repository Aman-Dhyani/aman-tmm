"use client";
import StatCard from "@/components/StatCard";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { fetch_15_days_avg_report, fetch_branch_revenue, fetch_current_inventory, fetch_reports,} from "@/utils/requestUtils";
import ReportsTable from "@/components/ReportsTable";
import CustomModal from "@/components/CustomModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { normalizeObject, normalizeRow } from "@/utils/normalizedItems";
import Selector from "@/components/Selector";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Reports
export default function Reports() {
  const bluePalette = ["#1e3a8a", "#2563eb", "#4f46e5", "#3b82f6", "#60a5fa"];
  const [timeframe, setTimeframe] = useState<"last7Days" | "last30Days" | "month" | "year">("last7Days");
  const [selectedBranch, setSelectedBranch] = useState("Branch");

  // separate loading states
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingPie, setLoadingPie] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const [chartData, setChartData] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pieData, setPieData] = useState<number[]>([]);
  const [resDLabels, setResDLabels] = useState<string[]>([]);
  const [branchRevenue, setBranchRevenue] = useState<any[]>([]);
  const [inventorySummary, setInventorySummary] = useState<any>(null);
  const [selectedBranchTotal, setSelectedBranchTotal] = useState<{ Total: number; Sales: number; } | null>(null);
  const [allBranchesTotal, setAllBranchesTotal] = useState<{ Total: number; Sales: number; } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<Record<string, number>>({});
  const [modalDate, setModalDate] = useState<string>("");
  const [showLegend, setShowLegend] = useState(false);

  const timeframeLabels: Record<string, string> = {
    last7Days: "since last 7 days",
    week: "since last week",
    month: "since last month",
    year: "since last year",
  };

  // get Req Branch
  function getReqBranch() {
    if (selectedBranch === "Branch 1") return ["branch-1"];
    if (selectedBranch === "Branch 2") return ["branch-2"];
    return ["branch-1", "branch-2"];
  }

  // Stack chart load request
  async function loadReports() {
    try {
      setSelectedBranchTotal(null);
      setLoadingReports(true);
      const reqBranch = getReqBranch();
      const res = await fetch_reports(reqBranch, timeframe);

      if (res && res.rows && res.rows.length > 0) {
        // ☑️ normalize
        const normalizedRows = res.rows.map(normalizeRow);
        const rows = normalizedRows.filter((r: any) => r.Period !== null && r.Period !== undefined);
        setCategories(rows.map((row: any) => row.Period ?? row.Date));

        setChartData(
          Object.keys(rows[0])
            .filter((key) => key !== "Time" && key !== "Date" && key !== "Period")
            .map((key) => ({
              name: key,
              data: rows.map((row: any) => Number(row[key]) || 0),
            }))
        );

        // ✅ save summary in state
        setSelectedBranchTotal({ Total: res.Total, Sales: res.Sales });
      } else {
        setChartData([]);
        setCategories([]);
        setSelectedBranchTotal(null);
      }
    } catch (err) {
      console.error("Error loading reports:", err);
    } finally {
      setLoadingReports(false);
    }
  }

  // pie chart
  async function loadPieReports() {
    try {
      setLoadingPie(true);
      const reqBranch = getReqBranch();
      const res = await fetch_15_days_avg_report(reqBranch, 15);

      if (res) {
        const total = Object.values(res).reduce((sum: number, v: any) => sum + Number(v || 0), 0);
        setPieData(Object.values(res).map((v: any) => total === 0 ? 0 : Number(((Number(v) / total) * 100).toFixed(2))));

        // ☑️ normalize res
        setResDLabels(Object.keys(normalizeObject(res)));
      }
    } catch (err) {
      console.error("Error loading pie reports:", err);
    } finally {
      setLoadingPie(false);
    }
  }

  // branch revenue
  async function loadBranchRevenue() {
    const reqBranch = getReqBranch();
    try {
      setLoadingTable(true);
      const data = await fetch_branch_revenue(reqBranch);

      // 🔹 Intercept and format before saving
      const formatted = (data || []).map((row: any) => ({
        ...row,
        Total:
          row.Total != null
            ? `₹${Number(row.Total).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "₹0.00",
      }));

      setBranchRevenue(formatted);
    } catch (err) {
      console.error("❌ Error loading branch revenue:", err);
    } finally {
      setLoadingTable(false);
    }
  }

  // load inventory stats
  async function loadInvStatistics() {
    try {
      const currentInventory = await fetch_current_inventory();
      setInventorySummary(generateSummary(currentInventory));
    } catch (err) {
      console.error("Error loading inventory:", err);
    }
  }

  // loadGlobalTotals
  async function loadGlobalTotals() {
    try {
      const res = await fetch_reports(["branch-1", "branch-2"], "year"); // always dafault
      if (res && res.rows && res.rows.length > 0) {
        setAllBranchesTotal({
          Total: res.Total,
          Sales: res.Sales,
        });
      }
    } catch (err) {
      console.error("❌ Error loading global totals:", err);
    }
  }

  // load reports chart data
  useEffect(() => {
    loadReports();
  }, [timeframe, selectedBranch]);

  // load pie and revenue
  useEffect(() => {
    loadPieReports();
    loadBranchRevenue();
  }, [selectedBranch]);

  // load Statistics and Total revenue
  useEffect(() => {
    loadInvStatistics();
    loadGlobalTotals();
  }, []);

  // ---- ABOUT CHARTS ---- 
  // 1️⃣ Stack Chart
  const salesOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: bluePalette, // 🔹 force all series to use blue shades
    plotOptions: { bar: { borderRadius: 6, horizontal: false } },
    xaxis: { categories, labels: { style: { colors: "currentColor" } } },
    yaxis: { labels: { style: { colors: "currentColor" } } },
    legend: {
      show: showLegend,
      position: "bottom",
      labels: { colors: "currentColor" },
    },
    theme: { mode: "light" },
    grid: { show: false },
  };

  // 2️⃣ Pie Chart
  const pieOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
    },
    colors: bluePalette,
    labels: resDLabels,
    legend: { position: "bottom", labels: { colors: "currentColor" } },
    theme: { mode: "light" },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      theme: "light",
    },
  };

  // Modal chart options ☑️ normalize res
  const norModalItems = normalizeObject(modalItems);
  const filteredKeys = Object.keys(norModalItems).filter((key) => norModalItems[key] > 0);
  const filteredValues = filteredKeys.map((key) => norModalItems[key]);

  // 3️⃣ Modal chart options
  const modalChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent", // ✅ removes background
    },
    colors: bluePalette, // 🔹 blue shades
    plotOptions: {
      bar: { borderRadius: 6, horizontal: false, distributed: true },
    },
    xaxis: {
      categories: filteredKeys,
      labels: { style: { colors: "currentColor" } },
    },
    yaxis: { labels: { style: { colors: "currentColor" } } },
    legend: { show: false },
    grid: { show: false }, // ✅ removes grid lines
    theme: { mode: "light" },
  };

  // Series
  const modalChartSeries = [{ name: "Quantity", data: filteredValues}];

  // ♦️ Statistics
  function generateSummary(data: Record<string, string | number>) {
    let totalMomos = 0;
    let totalKurkure = 0;
    let totalSteam = 0;
    let totalSpring = 0;
    let totalChutney = 0;

    Object.entries(data).forEach(([key, value]) => {
      const count = parseInt(value as string, 10) || 0;
      if (key.endsWith("_K")) totalKurkure += count;
      if (/_S(?:_|$)/.test(key)) totalSteam += count;
      if (key.includes("Spring")) totalSpring += count;
      if (key.includes("Chutney")) totalChutney += count;
    });

    totalMomos = 2 * totalKurkure + totalSteam;

    return {
      total_momos: totalMomos,
      breakdown: `(2 × ${totalKurkure}) + ${totalSteam}`,
      total_spring: totalSpring,
      total_chutney: totalChutney,
    };
  }

  // HTML
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 space-y-6">
      {/* 1️⃣. Revenue Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title={`${selectedBranch} Sales`}
            value={selectedBranchTotal?.Sales || "-"}
            label={timeframeLabels[timeframe]}
            imgData={"/assets/sales-arrow.png"}
          />
          <StatCard title={`${selectedBranch} Revenue`}
            value={selectedBranchTotal?.Total ? `₹${selectedBranchTotal.Total.toLocaleString("en-IN")}` : "-"}
            label={timeframeLabels[timeframe]}
            imgData={"/assets/dollars.png"}
          />
          <StatCard
            title={`Total Sales`}
            value={allBranchesTotal?.Sales || "-"}
            imgData={"/assets/sales-report.png"}
          />
          <StatCard
            title={`Total Revenue`}
            value={ allBranchesTotal?.Total ? `₹${allBranchesTotal?.Total.toLocaleString("en-IN")}` : "-" }
            imgData={"/assets/champ.png"}
          />
        </div>
      </div>

      {/* 2️⃣. Stack chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="rounded-2xl bg-white dark:bg-neutral-900 p-4 shadow-md sd-full-shadow lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {loadingReports ? <LoadingSpinner /> : "Report"}
            </h3>
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 items-center">
                {/* period selector */}
                <Selector
                  id="period-selector"
                  value={timeframe}
                  options={["last7Days", "last30Days", "month", "year"]}
                  onChange={(val) => setTimeframe( val as "last7Days" | "last30Days" | "month" | "year")}
                />

                {/* branch selector */}
                <Selector
                  id="branch-selector"
                  value={selectedBranch}
                  options={["Branch 1", "Branch 2", "Branch"]}
                  onChange={(val) => setSelectedBranch(val as "Branch 1" | "Branch 2" | "Branch")}
                />

                {/* toggle legends */}
                <button onClick={() => setShowLegend(!showLegend)} className="text-sm border border-gray-200 px-3 py-1 rounded-md cursor-pointer">
                  {showLegend ? "Hide Legend" : "Show Legend"}
                </button>
              </div>
            </div>
          </div>

          {/* Actual Stack Chart */}
          <Chart options={salesOptions} series={chartData as ApexAxisChartSeries} type="bar" height={500} />
        </div>

        {/* 3️⃣. Pie chart Section*/}
        <div className="sd-full-shadow rounded-2xl bg-white dark:bg-neutral-900 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Average 15 Days Sale</h3>
            {loadingPie && <LoadingSpinner />}
          </div>

          {/* Pie chart */}
          <Chart options={pieOptions} series={pieData} type="donut" height={500} />
        </div>
      </div>

      {/* 4️⃣. Tables */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Table</h2>
        <div className="rounded-2xl bg-white dark:bg-neutral-900 p-4 shadow-md sd-full-shadow lg:col-span-2">
          <h2 className="text-lg font-semibold font-bold mb-4 flex items-center justify-between">
            {selectedBranch}
            {loadingTable && <LoadingSpinner />}
          </h2>

          {/* table */}
          <ReportsTable data={branchRevenue}  rowsPerPage={10}
            onViewItems={(items, date) => {
              setModalItems(items);
              setModalDate(date);
              setModalOpen(true);
            }}
          />
        </div>

        {/* Modal */}
        {modalOpen && (
          <CustomModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Date: ${modalDate}`}>
            <Chart options={modalChartOptions} series={modalChartSeries} type="bar" height={400} />
          </CustomModal>
        )}
      </div>

      {/* 5️⃣. Statistics */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <StatCard
            title="Total Momos"
            value={inventorySummary ? inventorySummary.total_momos : "-"}
            label={inventorySummary ? inventorySummary.breakdown : ""}
            imgData={"/assets/food.png"}
          />
          <StatCard
            title="Total Spring"
            value={inventorySummary ? inventorySummary.total_spring : "-"}
            imgData={"/assets/springs.png"}
          />
          <StatCard
            title="Total Chutney"
            value={inventorySummary ? inventorySummary.total_chutney : "-"}
            imgData={"/assets/chutney.png"}
          />
        </div>
      </div>
    </div>
  );
}
