import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { deleteSubmission } from "./actions";

export default async function ProfilePage() {
  const { userId } =
    await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      include: {
        compensations: {
          include: {
            company: true,
          },

          orderBy: {
            createdAt:
              "desc",
          },
        },
      },
    });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
            My Profile
          </h1>

          <p className="text-slate-500 text-lg mt-3 max-w-2xl">
            Your submitted
            compensation
            entries.
          </p>
        </div>

        {/* STATS CARD */}
        <div className="mb-8">
          <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm p-8 w-[320px]">
            <p className="text-slate-500 text-sm font-medium">
              Total
              Submissions
            </p>

            <h2 className="text-4xl font-bold text-slate-900 mt-3">
              {
                user
                  ?.compensations
                  .length
              }
            </h2>
          </div>
        </div>

        {/* SUBMISSIONS */}
        <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900">
              My
              Submissions
            </h2>
          </div>

          {user
            ?.compensations
            .length ===
          0 ? (
            <div className="p-16 text-center">
              <p className="text-slate-500 text-lg">
                No submissions
                yet.
              </p>

              <Link
                href="/submit"
                className="inline-flex mt-6 bg-black text-white px-6 py-3 rounded-2xl font-medium hover:opacity-90 transition"
              >
                Submit Salary
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {user?.compensations.map(
                (
                  item
                ) => (
                  <div
                    key={
                      item.id
                    }
                    className="flex items-center justify-between px-8 py-7 hover:bg-slate-50 transition"
                  >
                    {/* LEFT */}
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {
                          item
                            .company
                            .name
                        }
                      </h3>

                      <p className="text-base text-slate-500 mt-2">
                        {
                          item.role
                        }{" "}
                        •{" "}
                        {
                          item.level
                        }{" "}
                        •{" "}
                        {
                          item.location
                        }
                      </p>

                      <p className="text-xs text-slate-400 mt-3">
                        Submitted{" "}
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right flex flex-col items-end">
                      <p className="text-3xl font-bold text-slate-900">
                        ₹
                        {Math.round(
                          item.totalCompensation
                        ).toLocaleString()}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Total Comp
                      </p>

                      <form
                        action={async () => {
                          "use server";

                          await deleteSubmission(
                            item.id
                          );
                        }}
                      >
                        <button
                          type="submit"
                          className="mt-4 text-sm text-red-500 hover:text-red-700 transition font-medium"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}