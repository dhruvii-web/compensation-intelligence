import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    c1?: string;
    c2?: string;
  }>;
};

export default async function ComparePage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const c1 =
    params.c1 || "";

  const c2 =
    params.c2 || "";

  const companies =
    await prisma.company.findMany({
      orderBy: {
        name: "asc",
      },
    });

  const company1 =
    c1
      ? await prisma.company.findUnique({
          where: {
            slug: c1,
          },

          include: {
            compensations: true,
          },
        })
      : null;

  const company2 =
    c2
      ? await prisma.company.findUnique({
          where: {
            slug: c2,
          },

          include: {
            compensations: true,
          },
        })
      : null;

  function getStats(
    company: typeof company1
  ) {
    if (
      !company ||
      company
        .compensations
        .length === 0
    ) {
      return null;
    }

    const data =
      company.compensations;

    const avgTC =
      data.reduce(
        (sum, item) =>
          sum +
          item.totalCompensation,
        0
      ) / data.length;

    const highestTC =
      Math.max(
        ...data.map(
          (d) =>
            d.totalCompensation
        )
      );

    const avgBase =
      data.reduce(
        (sum, item) =>
          sum +
          item.baseSalary,
        0
      ) / data.length;

    const avgBonus =
      data.reduce(
        (sum, item) =>
          sum +
          item.bonus,
        0
      ) / data.length;

    const avgStock =
      data.reduce(
        (sum, item) =>
          sum +
          item.stock,
        0
      ) / data.length;

    const avgExp =
      data.reduce(
        (sum, item) =>
          sum +
          item.experienceYears,
        0
      ) / data.length;

    return {
      avgTC,
      highestTC,
      avgBase,
      avgBonus,
      avgStock,
      avgExp,
    };
  }

  const stats1 =
    getStats(company1);

  const stats2 =
    getStats(company2);

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Compare Companies
          </h1>

          <p className="text-slate-500 text-lg mt-2">
            Compare compensation
            across companies.
          </p>
        </div>

        {/* SELECTORS */}
        <form
          action="/compare"
          method="GET"
          className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6 mb-8"
        >
          <div className="flex flex-wrap gap-4 items-center">
            <select
              name="c1"
              defaultValue={c1}
              className="h-14 min-w-[220px] rounded-xl border border-slate-300 px-4"
            >
              <option value="">
                Select Company 1
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

            <select
              name="c2"
              defaultValue={c2}
              className="h-14 min-w-[220px] rounded-xl border border-slate-300 px-4"
            >
              <option value="">
                Select Company 2
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

            <button
              type="submit"
              className="h-14 px-6 rounded-xl bg-black text-white font-medium"
            >
              Compare
            </button>
          </div>
        </form>

        {/* TABLE */}
        {company1 &&
          company2 &&
          stats1 &&
          stats2 && (
            <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-5 text-left">
                      Metric
                    </th>

                    <th className="px-6 py-5 text-left">
                      {
                        company1.name
                      }
                    </th>

                    <th className="px-6 py-5 text-left">
                      {
                        company2.name
                      }
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <CompareRow
                    label="Average TC"
                    v1={`₹${Math.round(
                      stats1.avgTC
                    ).toLocaleString()}`}
                    v2={`₹${Math.round(
                      stats2.avgTC
                    ).toLocaleString()}`}
                  />

                  <CompareRow
                    label="Highest TC"
                    v1={`₹${stats1.highestTC.toLocaleString()}`}
                    v2={`₹${stats2.highestTC.toLocaleString()}`}
                  />

                  <CompareRow
                    label="Average Base"
                    v1={`₹${Math.round(
                      stats1.avgBase
                    ).toLocaleString()}`}
                    v2={`₹${Math.round(
                      stats2.avgBase
                    ).toLocaleString()}`}
                  />

                  <CompareRow
                    label="Average Bonus"
                    v1={`₹${Math.round(
                      stats1.avgBonus
                    ).toLocaleString()}`}
                    v2={`₹${Math.round(
                      stats2.avgBonus
                    ).toLocaleString()}`}
                  />

                  <CompareRow
                    label="Average Stock"
                    v1={`₹${Math.round(
                      stats1.avgStock
                    ).toLocaleString()}`}
                    v2={`₹${Math.round(
                      stats2.avgStock
                    ).toLocaleString()}`}
                  />

                  <CompareRow
                    label="Average Experience"
                    v1={`${stats1.avgExp.toFixed(
                      1
                    )} yrs`}
                    v2={`${stats2.avgExp.toFixed(
                      1
                    )} yrs`}
                  />
                </tbody>
              </table>
            </div>
          )}
      </div>
    </main>
  );
}

function CompareRow({
  label,
  v1,
  v2,
}: {
  label: string;
  v1: string;
  v2: string;
}) {
  return (
    <tr className="border-t border-slate-100">
      <td className="px-6 py-5 font-medium text-slate-900">
        {label}
      </td>

      <td className="px-6 py-5 text-slate-700">
        {v1}
      </td>

      <td className="px-6 py-5 text-slate-700">
        {v2}
      </td>
    </tr>
  );
}