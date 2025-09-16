"use client";
import { useState, useEffect } from "react";
import Selector from "@/components/Selector";
import TallyTable from "@/components/TallyTable";

export default function TallySalesDemo() {
  const [selectedBranch, setSelectedBranch] = useState("Branch");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function getReqBranch() {
    if (selectedBranch === "Branch 1") return ["branch-1"];
    if (selectedBranch === "Branch 2") return ["branch-2"];
    return ["branch-1", "branch-2"];
  }

  async function fetchTally() {
    try {
      setLoading(true);
      const reqBranch = getReqBranch();
      const res = await fetch("/api/tally-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch: reqBranch }),
      });
      if (!res.ok) throw new Error("Failed to fetch tally sales");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTally();
  }, [selectedBranch]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Tally Sales</h1>

      {/* Selector and Label in one line */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 p-4 sd-full-shadow">
        <div className="flex items-center gap-2 mb-4 ">
          <span>Select Branch:</span>
          <Selector
            id="branch-selector"
            value={selectedBranch}
            options={["Branch 1", "Branch 2", "Branch"]}
            onChange={(val) =>
              setSelectedBranch(val as "Branch 1" | "Branch 2" | "Branch")
            }
          />
        </div>

        {/* Table */}
        {loading ? <p>Loading...</p> : <TallyTable data={data} />}
      </div>
    </div>
  );
}
