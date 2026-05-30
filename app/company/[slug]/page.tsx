import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CompanyCharts from "@/components/ui/company-charts";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CompanyPage({
  params,
}: Props) {
  const { slug } = await params;

  const company =
    await prisma.company.findUnique({
      where: {
        slug,
      },

      include: {
        compensations: {
          orderBy: {
            totalCompensation:
              "desc",
          },
        },
      },
    });

  if (!company) {
    return notFound();
  }

  const compensations =
    company.compensations;

  const avgComp =
    compensations.length > 0
      ? compensations.reduce(
          (sum, item) =>
            sum +
            item.totalCompensation,
          0
        ) /
        compensations.length
      : 0;

  const topSalary =
    compensations[0];

  const lowestSalary =
    compensations[
      compensations.length - 1
    ];

  const avgExperience =
    compensations.length > 0
      ? (
          compensations.reduce(
            (
              sum,
              item
            ) =>
              sum +
              item.experienceYears,
            0
          ) /
          compensations.length
        ).toFixed(1)
      : "0";

  const locationCount =
    new Map<
      string,
      number
    >();

  compensations.forEach(
    (item) => {
      locationCount.set(
        item.location,
        (locationCount.get(
          item.location
        ) || 0) + 1
      );
    }
  );

  const topLocation =
    Array.from(
      locationCount.entries()
    ).sort(
      (a, b) =>
        b[1] - a[1]
    )[0]?.[0] ||
    "N/A";

  const highestPayingLevel =
    topSalary?.level ||
    "N/A";

  const highestPayingRole =
    topSalary?.role ||
    "N/A";

  return (
    <main className="h-screen overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-5 h-full flex flex-col">
        {/* HEADER */}
        <div className="mb-5 shrink-0">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
            {company.name}
          </h1>

          <p className="text-slate-600 text-sm mt-2">
            {company.industry} •{" "}
            {
              company.headquarters
            }
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5 shrink-0">
          <StatCard
            label="Average TC"
            value={`₹${Math.round(
              avgComp
            ).toLocaleString()}`}
          />

          <StatCard
            label="Highest TC"
            value={`₹${topSalary?.totalCompensation.toLocaleString()}`}
          />

          <StatCard
            label="Lowest TC"
            value={`₹${lowestSalary?.totalCompensation.toLocaleString()}`}
          />

          <StatCard
            label="Entries"
            value={`${compensations.length}`}
          />
        </div>

        {/* CHARTS */}
        <div className="shrink-0">
          <CompanyCharts
            compensations={
              compensations
            }
          />
        </div>

        {/* INSIGHTS */}
        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-8 mb-10">
          <h2 className="text-[46px] font-bold tracking-tight text-slate-900 mb-8">
            Salary Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InsightCard
              label="Highest Paying Level"
              value={
                highestPayingLevel
              }
            />

            <InsightCard
              label="Average Experience"
              value={`${avgExperience} yrs`}
            />

            <InsightCard
              label="Top Location"
              value={
                topLocation
              }
            />

            <InsightCard
              label="Highest Paying Role"
              value={
                highestPayingRole
              }
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-0">
          <div className="px-6 py-4 border-b border-slate-200 shrink-0">
            <h2 className="text-lg font-semibold text-slate-900">
              Salary Data
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Compensation
              across roles
            </p>
          </div>

          <div className="overflow-y-auto h-full">
            <table className="w-full">
              <thead className="bg-slate-100 sticky top-0 z-10">
                <tr className="text-slate-600 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">
                    Role
                  </th>

                  <th className="px-6 py-3 text-left">
                    Level
                  </th>

                  <th className="px-6 py-3 text-left">
                    Location
                  </th>

                  <th className="px-6 py-3 text-left">
                    Exp
                  </th>

                  <th className="px-6 py-3 text-left">
                    Base
                  </th>

                  <th className="px-6 py-3 text-left">
                    Bonus
                  </th>

                  <th className="px-6 py-3 text-left">
                    Stock
                  </th>

                  <th className="px-6 py-3 text-left">
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
                      <td className="px-6 py-3 text-sm font-medium text-slate-900">
                        {item.role}
                      </td>

                      <td className="px-6 py-3 text-sm text-slate-700">
                        {
                          item.level
                        }
                      </td>

                      <td className="px-6 py-3 text-sm text-slate-600">
                        {
                          item.location
                        }
                      </td>

                      <td className="px-6 py-3 text-sm text-slate-700">
                        {
                          item.experienceYears
                        }{" "}
                        yrs
                      </td>

                      <td className="px-6 py-3 text-sm text-slate-700">
                        ₹
                        {item.baseSalary.toLocaleString()}
                      </td>

                      <td className="px-6 py-3 text-sm text-slate-700">
                        ₹
                        {item.bonus.toLocaleString()}
                      </td>

                      <td className="px-6 py-3 text-sm text-slate-700">
                        ₹
                        {item.stock.toLocaleString()}
                      </td>

                      <td className="px-6 py-3 text-sm font-medium text-slate-700">
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

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-[24px] p-4 shadow-sm">
      <p className="text-slate-500 text-xs font-medium">
        {label}
      </p>

      <h2 className="text-lg font-semibold text-slate-900 mt-1 truncate">
        {value}
      </h2>
    </div>
  );
}

function InsightCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
      <p className="text-sm text-slate-500 font-medium">
        {label}
      </p>

      <h3 className="text-3xl font-bold text-slate-900 mt-2">
        {value}
      </h3>
    </div>
  );
}