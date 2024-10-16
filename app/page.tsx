import DataTable from "@/components/DataTable";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen py-10 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-5xl font-extrabold text-gray-800 text-center">
            Product Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Analyze, filter, and export product data easily.
          </p>
        </div>


        {/* DataTable with a card-like container */}
        <div className="bg-white shadow-lg rounded-lg">
          <DataTable />
        </div>
      </div>
    </div>
  );
}
