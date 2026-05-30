import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tight">
            Compensation Intelligence
          </h1>

          <p className="mt-5 text-slate-600 text-lg max-w-2xl mx-auto">
            Compare compensation across top tech companies,
            levels, and locations.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/explore"
              className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
            >
              Explore Salaries
            </Link>

            <Link
              href="/compare"
              className="border border-slate-300 px-6 py-3 rounded-xl hover:bg-slate-100 transition"
            >
              Compare Companies
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-24">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="font-semibold text-xl">
              Salary Explorer
            </h3>

            <p className="text-slate-500 mt-2">
              Search compensation across companies,
              levels, and locations.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="font-semibold text-xl">
              Compare Offers
            </h3>

            <p className="text-slate-500 mt-2">
              Compare salaries side-by-side and
              understand total compensation.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="font-semibold text-xl">
              Company Insights
            </h3>

            <p className="text-slate-500 mt-2">
              Explore salary structures by company
              and level.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}