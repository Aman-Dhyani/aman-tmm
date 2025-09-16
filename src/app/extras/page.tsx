"use client";
import DefCard from "@/components/DefCard";

export default function Extras() {
  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center">
        {/* Add Stock */}
        <DefCard
          heading="Add Stock"
          subheading="Add Now"
          buttonText="Add Now"
          buttonRedirect="/form?label=Add Stock&type=new-stock"
          borderColor="border-gray-100"
          bgColor="bg-[#f6f6f6]"
          buttonColor="bg-[#f6f6f6] hover:bg-gray-200 text-black"
        />

        {/* Inventory Check */}
        <DefCard
          heading="Inventory Check"
          subheading="To weekly check the inventory"
          buttonText="Verify Now"
          buttonRedirect="/form?label=Correction&type=correction"
          borderColor="border-gray-100"
          bgColor="bg-[#f6f6f6]"
          buttonColor="bg-[#f6f6f6] hover:bg-gray-200 text-black"
        />

        {/* Reports */}
        <DefCard
          heading="Reports"
          subheading="Check inventory and sales report details"
          buttonText="Visit"
          buttonRedirect="/reports"
          borderColor="border-gray-100"
          bgColor="bg-[#f6f6f6]"
          buttonColor="bg-[#f6f6f6] hover:bg-gray-200 text-black"
        />

        {/* POS Reports */}
        <DefCard
          heading="Pos Reports"
          subheading="Check pos sales report details"
          buttonText="Pos Sales"
          buttonRedirect="pos-reports"
          borderColor="border-gray-100"
          bgColor="bg-[#f6f6f6]"
          buttonColor="bg-[#f6f6f6] hover:bg-gray-200 text-black"
        />

        {/* Current Inventory */}
        <DefCard
          heading="Current Inventory"
          subheading="Inventory present in Sector 14 Deep Fridge"
          buttonText="Check"
          buttonRedirect="/inventory"
          borderColor="border-gray-100"
          bgColor="bg-[#f6f6f6]"
          buttonColor="bg-[#f6f6f6] hover:bg-gray-200 text-black"
        />

        {/* Tally Sales */}
        <DefCard
          heading="Tally Sales"
          subheading="View tally between stock and pos sales"
          buttonText="Check"
          buttonRedirect="/tally"
          borderColor="border-gray-100"
          bgColor="bg-[#f6f6f6]"
          buttonColor="bg-[#f6f6f6] hover:bg-gray-200 text-black"
        />

        {/* Transactions */}
        <DefCard
          heading="Transactions"
          subheading="Handle all transactions"
          buttonText="Visit"
          buttonRedirect="/transactions"
          borderColor="border-gray-100"
          bgColor="bg-[#f6f6f6]"
          buttonColor="bg-[#f6f6f6] hover:bg-gray-200 text-black"
        />

        {/* Update Pricings */}
        <DefCard
          heading="Update Pricings"
          subheading="Update sell and cost pricings"
          buttonText="Visit"
          buttonRedirect="/pricings"
          borderColor="border-gray-100"
          bgColor="bg-[#f6f6f6]"
          buttonColor="bg-[#f6f6f6] hover:bg-gray-200 text-black"
        />
      </div>
    </main>
  );
}
