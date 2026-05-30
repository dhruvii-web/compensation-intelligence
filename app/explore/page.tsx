import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    company?: string;
    location?: string;
    search?: string;
    sort?: string;
  }>;
};

export default async function ExplorePage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const companyFilter =
    params.company || "";

  const locationFilter =
    params.location || "";

  const search =
    params.search || "";

  const sort =
    params.sort || "highestTC";

  const compensations =
    await prisma.compensation.findMany({
      where: {
        company: companyFilter
          ? {
              slug:
                companyFilter,
            }
          : undefined,

        location:
          locationFilter ||
          undefined,

        OR: search
          ? [
              {
                role: {
                  contains:
                    search,
                  mode:
                    "insensitive",
                },
              },
              {
                location: {
                  contains:
                    search,
                  mode:
                    "insensitive",
                },
              },
              {
                company: {
                  name: {
                    contains:
                      search,
                    mode:
                    "insensitive",
                  },
                },
              },
            ]
          : undefined,
      },

      include: {
        company: true,
      },

      orderBy:
        sort === "lowestTC"
          ? {
              totalCompensation:
                "asc",
            }
          : sort ===
            "highestBase"
          ? {
              baseSalary:
                "desc",
            }
          : {
              totalCompensation:
                "desc",
            },
    });

  const companies =
    await prisma.company.findMany({
      orderBy: {
        name: "asc",
      },
    });

  const locations = [
    "Bangalore",
    "Hyderabad",
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Salary Explorer
            </h1>

            <p className="text-slate-500 text-lg mt-2">
              Explore compensation across
              top companies and levels.
            </p>
          </div>

          <span className="text-slate-500 text-sm font-medium">
            {compensations.length} salaries
          </span>
        </div>

        {/* FILTERS */}
        <form
          action="/explore"
          method="GET"
          className="bg-white border border-slate-200 rounded-[28px] shadow-sm p-6 mb-8"
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* SEARCH */}
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search company, role, location"
              className="w-[340px] h-14 rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:ring-2 focus:ring-black"
            />

            {/* COMPANY */}
            <select
              name="company"
              defaultValue={
                companyFilter
              }
              className="h-14 min-w-[180px] rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:ring-2 focus:ring-black"
            >
              <option value="">
                All Companies
              </option>

              {companies.map(
                (company) => (
                  <option
                    key={
                      company.id
                    }
                    value={
                      company.slug
                    }
                  >
                    {
                      company.name
                    }
                  </option>
                )
              )}
            </select>

            {/* LOCATION */}
            <select
              name="location"
              defaultValue={
                locationFilter
              }
              className="h-14 min-w-[180px] rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:ring-2 focus:ring-black"
            >
              <option value="">
                All Locations
              </option>

              {locations.map(
                (
                  location
                ) => (
                  <option
                    key={
                      location
                    }
                    value={
                      location
                    }
                  >
                    {location}
                  </option>
                )
              )}
            </select>

            {/* SORT */}
            <select
              name="sort"
              defaultValue={sort}
              className="h-14 min-w-[180px] rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:ring-2 focus:ring-black"
            >
              <option value="highestTC">
                Highest TC
              </option>

              <option value="lowestTC">
                Lowest TC
              </option>

              <option value="highestBase">
                Highest Base
              </option>
            </select>

            {/* APPLY */}
            <button
              type="submit"
              className="h-14 px-6 rounded-xl bg-black text-white font-medium text-sm hover:opacity-90 transition"
            >
              Apply Filters
            </button>

            {/* RESET */}
            <Link
              href="/explore"
              className="text-sm text-slate-500 hover:text-black font-medium transition"
            >
              Reset
            </Link>
          </div>
        </form>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-100">
                <tr className="text-slate-700 text-xs uppercase tracking-wide">
                  <th className="px-6 py-4 text-left">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left">
                    Level
                  </th>
                  <th className="px-6 py-4 text-left">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left">
                    Exp
                  </th>
                  <th className="px-6 py-4 text-left">
                    Base
                  </th>
                  <th className="px-6 py-4 text-left">
                    Bonus
                  </th>
                  <th className="px-6 py-4 text-left">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left">
                    TC
                  </th>
                </tr>
              </thead>

              <tbody>
                {compensations.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-5">
                        <Link
                          href={`/company/${item.company.slug}`}
                          className="inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-200 transition"
                        >
                          {
                            item.company
                              .name
                          }
                        </Link>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        {item.role}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        {item.level}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {
                          item.location
                        }
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        {
                          item.experienceYears
                        }{" "}
                        yrs
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-700">
                        ₹
                        {item.baseSalary.toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-700">
                        ₹
                        {item.bonus.toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-700">
                        ₹
                        {item.stock.toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-slate-700">
                        ₹
                        {item.totalCompensation.toLocaleString()}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}