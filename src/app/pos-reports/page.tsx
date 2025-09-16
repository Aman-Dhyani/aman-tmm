"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetch_pos_sales, fetch_pos_tables, pos_perday_sales,} from "@/utils/requestUtils";
import StatCard from "@/components/StatCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import AutoTable from "@/components/AutoTable";
import PosReportsTable from "@/components/posReportsTable";
import Selector from "@/components/Selector";
import { ApexOptions } from "apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Sale {
  branch: "branch-1" | "branch-2";
  total: number | string;
  created_at: string;
  payment_method: string;
}

/* Graph buttons view */
function ViewToggle({ value, onChange,}: { value: string; onChange: (val: string) => void;}) {
  const options = ["week", "month", "year"];
  return (
    <div className="flex gap-2">
      {options.map((view) => (
        <button
          key={view}
          onClick={() => onChange(view)}
          className={`px-3 py-1 rounded-full font-semibold 
          ${
            value === view
              ? "bg-purple-600 text-white"
              : "bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default function PosReports() {
  const colors = ["#7C3AED", "#3B82F6"];
  const selectedBranch = "Branch"
  const [tableBranch, setTableBranch] = useState("branch-1");
  const [stackedBranch, setStackedBranch] = useState("Branch");
  const [lineView, setLineView] = useState("week");
  const [stackedView, setStackedView] = useState("week");
  const [lineChartData, setLineChartData] = useState<any>(null);
  const [stackedChartData, setStackedChartData] = useState<any>(null);
  const [loadingLine, setLoadingLine] = useState(true);
  const [loadingStacked, setLoadingStacked] = useState(true);

  const [totals, setTotals] = useState({
    branch1Online: 0,
    branch1Cash: 0,
    branch1Total: 0,
    branch2Online: 0,
    branch2Cash: 0,
    branch2Total: 0,
  });

  const [posPerdayTableData, setPosPerdayTableData] = useState< Record<string, any>[]>([]);

  const [tableData, setTableData] = useState({
    rows: [],
    totalRows: 0,
    totalPages: 1,
    currentPage: 1,
  });

  // Aggregate total per branch (ignore cash/online)
  function aggregateTotalPerBranch(sales: Sale[], view: string) {
    const totalsByPeriod: Record< string, { "branch-1": number; "branch-2": number }> = {};

    sales.forEach((sale) => {
      const date = new Date(sale.created_at);
      let key = "";

      if (view === "week") key = date.toISOString().split("T")[0];
      else if (view === "month")
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      else if (view === "year") key = date.getFullYear().toString();

      if (!totalsByPeriod[key])
        totalsByPeriod[key] = { "branch-1": 0, "branch-2": 0 };

      // ✅ Use type assertion to tell TypeScript this is safe
      totalsByPeriod[key][sale.branch as "branch-1" | "branch-2"] += Number(sale.total) || 0; });

    const categories = Object.keys(totalsByPeriod).sort();
    const branch1Data = categories.map((k) => totalsByPeriod[k]["branch-1"]);
    const branch2Data = categories.map((k) => totalsByPeriod[k]["branch-2"]);

    return {
      categories,
      chartData: [
        { name: "Branch 1", data: branch1Data },
        { name: "Branch 2", data: branch2Data },
      ],
    };
  }

  // === Helpers ===
  function getReqBranch(branch: string) {
    if (branch === "Branch 1") return ["branch-1"];
    if (branch === "Branch 2") return ["branch-2"];
    return ["branch-1", "branch-2"];
  }

  async function fetchSalesData(branch: string, period: string) {
    const data = await fetch_pos_sales(getReqBranch(branch), period);
    return data;
  }

  function aggregateSalesData(
    sales: any[],
    view: string,
    branchFilter?: string
  ) {
    const revenueByPeriod: Record<string, { cash: number; online: number }> = {};
    const filteredSales = branchFilter ? sales.filter((s) => getReqBranch(branchFilter).includes(s.branch)) : sales;

    filteredSales.forEach((sale) => {
      const date = new Date(sale.created_at);
      let key = "";
      if (view === "week") key = date.toISOString().split("T")[0];
      else if (view === "month")
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      else if (view === "year") key = date.getFullYear().toString();

      const total = Number(sale.total) || 0;
      if (!revenueByPeriod[key]) revenueByPeriod[key] = { cash: 0, online: 0 };
      if (sale.payment_method === "cash") revenueByPeriod[key].cash += total;
      else revenueByPeriod[key].online += total;
    });

    const categories = Object.keys(revenueByPeriod).sort();
    const cashData = categories.map((k) => revenueByPeriod[k].cash);
    const onlineData = categories.map((k) => revenueByPeriod[k].online);

    return {
      categories,
      chartData: [
        { name: "Cash", data: cashData },
        { name: "Online", data: onlineData },
      ],
    };
  }

  // Tally data (once)
  useEffect(() => {
    let mounted = true;
    fetchTotals();
    async function fetchTotals() {
      try {
        const data = await pos_perday_sales();
        if (!mounted) return;
        setPosPerdayTableData(data);
      } catch (err) {
        console.error(err);
      }
    }
    return () => {
      mounted = false;
    };
  }, []);

  // Totals (line chart & stat cards)
  useEffect(() => {
    let mounted = true;
    fetchSalesData(selectedBranch, "week").then((sales) => {
        if (!mounted) return;
        const totals = {
          branch1Online: 0,
          branch1Cash: 0,
          branch1Total: 0,
          branch2Online: 0,
          branch2Cash: 0,
          branch2Total: 0,
        };
        sales.forEach((sale: Sale) => {
          const total = Number(sale.total) || 0;
          if (sale.branch === "branch-1") {
            if (sale.payment_method === "online") totals.branch1Online += total;
            else totals.branch1Cash += total;
          } else if (sale.branch === "branch-2") {
            if (sale.payment_method === "online") totals.branch2Online += total;
            else totals.branch2Cash += total;
          }
        });
        totals.branch1Total = totals.branch1Online + totals.branch1Cash;
        totals.branch2Total = totals.branch2Online + totals.branch2Cash;
        setTotals(totals);
      })
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, [selectedBranch]);

  // Line chart (independent)
  useEffect(() => {
    let mounted = true;
    setLoadingLine(true);
    fetchSalesData("Branch", lineView) // always fetch all branches
      .then((sales) => {
        if (!mounted) return;
        setLineChartData(aggregateTotalPerBranch(sales, lineView));
      })
      .catch(console.error)
      .finally(() => mounted && setLoadingLine(false));
    return () => {
      mounted = false;
    };
  }, [lineView]);

  // Stacked chart (independent, only uses stackedBranch)
  useEffect(() => {
    let mounted = true;
    setLoadingStacked(true);
    fetchSalesData("Branch", stackedView) // always fetch all branches
      .then((sales) => {
        if (!mounted) return;
        setStackedChartData(
          aggregateSalesData(sales, stackedView, stackedBranch)
        );
      })
      .catch(console.error)
      .finally(() => mounted && setLoadingStacked(false));
    return () => {
      mounted = false;
    };
  }, [stackedView, stackedBranch]);

  // Table data
  useEffect(() => {
    async function fetchTableData() {
      try {
        const res = await fetch_pos_tables(1, tableBranch);
        setTableData(res);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTableData();
  }, [tableBranch]);

  // === Chart options ===
  const lineChartOptions: ApexOptions = {
    chart: {
      type: "line" as "line", // 👈 cast properly
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
      background: "transparent",
    },
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 5 },
    xaxis: {
      categories: lineChartData?.categories || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false },
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: true },
    },
    grid: { show: false },
    legend: { show: false },
    colors: colors,
    tooltip: {
      x: { show: true },
      y: { formatter: (val: number) => val.toString() },
    },
  };

  const stackedChartOptions: ApexOptions = {
    chart: {
      type: "bar", // ✅ now recognized correctly
      stacked: true,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: colors,
    plotOptions: {
      bar: { borderRadius: 6, horizontal: false, columnWidth: "50%" },
    },
    xaxis: {
      categories: stackedChartData?.categories || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        show: true,
        style: { colors: "currentColor", fontWeight: 500 },
      },
    },
    yaxis: { show: false },
    legend: { show: false },
    grid: { show: false },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
  };

  // === Render ===
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div>
        <h2 className="text-2xl font-bold mb-8">Total Revenue</h2>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Branch-1 Online"
            value={
              totals.branch1Online
                ? `₹${totals.branch1Online.toLocaleString("en-IN")}`
                : "-"
            }
            imgData="/assets/online.png"
          />
          <StatCard
            title="Branch-1 Cash"
            value={
              totals.branch1Cash
                ? `₹${totals.branch1Cash.toLocaleString("en-IN")}`
                : "-"
            }
            imgData="/assets/dollars.png"
          />
          <StatCard
            title="Branch-1 Total"
            value={
              totals.branch1Total
                ? `₹${totals.branch1Total.toLocaleString("en-IN")}`
                : "-"
            }
            imgData="/assets/champ.png"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Branch-2 Online"
            value={
              totals.branch2Online
                ? `₹${totals.branch2Online.toLocaleString("en-IN")}`
                : "-"
            }
            imgData="/assets/online.png"
          />
          <StatCard
            title="Branch-2 Cash"
            value={
              totals.branch2Cash
                ? `₹${totals.branch2Cash.toLocaleString("en-IN")}`
                : "-"
            }
            imgData="/assets/dollars.png"
          />
          <StatCard
            title="Branch-2 Total"
            value={
              totals.branch2Total
                ? `₹${totals.branch2Total.toLocaleString("en-IN")}`
                : "-"
            }
            imgData="/assets/champ.png"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Line Chart */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl sd-full-shadow flex-1 p-4">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold font-bold mb-4">
              Total Revenue
            </h2>
            <div className="flex items-center justify-between">
              <ViewToggle value={lineView} onChange={setLineView} />
              {loadingLine && <LoadingSpinner />}
            </div>
          </div>
          <ReactApexChart
            options={lineChartOptions}
            series={lineChartData?.chartData || []}
            type="line"
            height={350}
          />
        </div>

        {/* Stacked Chart */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl sd-full-shadow flex-1 p-4">
          <div className="flex items-start justify-between mb-4">
            <Selector
              id="stacked-branch"
              value={stackedBranch}
              options={["Branch", "Branch 1", "Branch 2"]}
              onChange={(val) => setStackedBranch(val)}
            />
            <div className="flex items-center justify-between">
              <ViewToggle value={stackedView} onChange={setStackedView} />

              {loadingStacked && <LoadingSpinner />}
            </div>
          </div>
          <Chart
            options={stackedChartOptions}
            series={stackedChartData?.chartData || []}
            type="bar"
            height={350}
          />
        </div>
      </div>

      {/* Tables */}
      <div>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl sd-full-shadow flex-1 p-4 mb-8">
          <div className=" mb-4">
            <div className="mb-4">
              <Selector
                id="table-branch"
                label="Select Branch:"
                value={tableBranch}
                options={["Branch 1", "Branch 2"]} // display labels
                onChange={(val) => {
                  const internalVal = val.toLowerCase().replace(" ", "-");
                  setTableBranch(internalVal);
                }}
              />
            </div>
          </div>

          <PosReportsTable
            data={tableData}
            onPageChange={async (page) => {
              const res = await fetch_pos_tables(page, tableBranch);
              setTableData(res);
            }}
          />
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl sd-full-shadow flex-1 p-4 mb-8">
          <AutoTable data={posPerdayTableData} />
        </div>
      </div>
    </div>
  );
}
