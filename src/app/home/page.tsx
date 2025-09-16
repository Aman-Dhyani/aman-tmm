"use client"
import DefCard from "@/components/DefCard";
import DefCardWrapper from "@/components/DefCardWrapper";

export default function Home() {
  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* BRANCH 1 */}
        <DefCardWrapper heading="Branch 1">
          {/* stock in */}
          <DefCard heading="Outgoing Stock" subheading="Report stock which is taken out for sale" buttonText="Report Now"
            buttonRedirect="/form?label=Stock Out&type=stock-out&branch=branch-1"
            borderColor="border-green-300" bgColor="bg-green-50" buttonColor="bg-green-100 hover:bg-green-200 text-black" />

          {/* stock out */}
          <DefCard heading="Remaining Stock" subheading="Report stock which is left at the end of day" buttonText="Report Now"
            buttonRedirect="/form?label=Stock In&type=stock-in&branch=branch-1"
            borderColor="border-red-300" bgColor="bg-red-50" buttonColor="bg-red-100 hover:bg-red-200 text-black" />
        </DefCardWrapper>

        {/* BRANCH 2 */}
        <DefCardWrapper heading="Branch 2">
          {/* stock in */}
          <DefCard heading="Outgoing Stock" subheading="Report stock which is taken out for sale" buttonText="Report Now"
            buttonRedirect="/form?label=Stock Out&type=stock-out&branch=branch-2"
            borderColor="border-green-300" bgColor="bg-green-50" buttonColor="bg-green-100 hover:bg-green-200 text-black" />

          {/* stock out */}
          <DefCard heading="Remaining Stock" subheading="Report stock which is left at the end of day" buttonText="Report Now"
            buttonRedirect="/form?label=Stock In&type=stock-in&branch=branch-2"
            borderColor="border-red-300" bgColor="bg-red-50" buttonColor="bg-red-100 hover:bg-red-200 text-black" />
        </DefCardWrapper>
      </div>
    </main>
  );
}
