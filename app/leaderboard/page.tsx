import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function LeaderboardPage() {
  const companies =
    await prisma.company.findMany({
      include: {
        compensations: true,
      },
    });

  const leaderboard =
    companies
      .map((company) => {
        const salaries =
          company.compensations;

        if (
          salaries.length === 0
        ) {
          return null;
        }

        const avgTC =
          salaries.reduce(
            (
              sum,
              item
            ) =>
              sum +
              item.totalCompensation,
            0
          ) /
          salaries.length;

        const highestTC =
          Math.max(
            ...salaries.map(
              (s) =>
                s.totalCompensation
            )
          );

        return {
          id: company.id,
          name:
            company.name,
          slug:
            company.slug,
          avgTC,
          highestTC,
          entries:
            salaries.length,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          b!.avgTC -
          a!.avgTC
      );

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
            Compensation
            Leaderboard
          </h1>

          <p className="text-slate-500 text-lg mt-2">
            Top paying
            companies ranked
            by average total
            compensation.
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr className="text-slate-600 text-sm uppercase tracking-wide">
                <th className="px-6 py-5 text-left">
                  Rank
                </th>

                <th className="px-6 py-5 text-left">
                  Company
                </th>

                <th className="px-6 py-5 text-left">
                  Avg TC
                </th>

                <th className="px-6 py-5 text-left">
                  Highest TC
                </th>

                <th className="px-6 py-5 text-left">
                  Entries
                </th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map(
                (
                  company,
                  index
                ) => (
                  <tr
                    key={
                      company!.id
                    }
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-5 font-semibold text-slate-900">
                      {index ===
                      0
                        ? "🥇"
                        : index ===
                          1
                        ? "🥈"
                        : index ===
                          2
                        ? "🥉"
                        : `#${index + 1}`}
                    </td>

                    <td className="px-6 py-5">
                      <Link
                        href={`/company/${company!.slug}`}
                        className="font-semibold text-slate-900 hover:underline"
                      >
                        {
                          company!
                            .name
                        }
                      </Link>
                    </td>

                    <td className="px-6 py-5 text-slate-700 font-medium">
                      ₹
                      {Math.round(
                        company!.avgTC
                      ).toLocaleString()}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      ₹
                      {company!.highestTC.toLocaleString()}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {
                        company!
                          .entries
                      }
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}