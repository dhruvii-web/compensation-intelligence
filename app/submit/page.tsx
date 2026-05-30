import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";

async function submitCompensation(
  formData: FormData
) {
  "use server";

  const user =
    await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // CREATE USER IF NOT EXISTS
  await prisma.user.upsert({
    where: {
      id: user.id,
    },

    update: {},

    create: {
      id: user.id,
      email:
        user.emailAddresses[0]
          ?.emailAddress,
      name:
        user.fullName,
      image:
        user.imageUrl,
    },
  });

  const companyId = formData.get(
    "companyId"
  ) as string;

  const role = formData.get(
    "role"
  ) as string;

  const level = formData.get(
    "level"
  ) as string;

  const location = formData.get(
    "location"
  ) as string;

  const experienceYears = Number(
    formData.get(
      "experienceYears"
    )
  );

  const baseSalary = Number(
    formData.get("baseSalary")
  );

  const bonus = Number(
    formData.get("bonus")
  );

  const stock = Number(
    formData.get("stock")
  );

  const totalCompensation =
    baseSalary + bonus + stock;

  // SAVE COMPENSATION
  await prisma.compensation.create({
    data: {
      companyId,
      role,
      level,
      location,
      experienceYears,
      baseSalary,
      bonus,
      stock,
      totalCompensation,

      userId: user.id,
    },
  });

  redirect("/explore");
}

export default async function SubmitPage() {
  const { userId } =
    await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const companies =
    await prisma.company.findMany({
      orderBy: {
        name: "asc",
      },
    });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Submit Compensation
          </h1>

          <p className="text-slate-500 text-xl mt-2">
            Add a new salary
            entry.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10">
          <form
            action={
              submitCompensation
            }
            className="space-y-6"
          >
            <Field label="Company">
              <select
                name="companyId"
                required
                className={
                  inputStyle
                }
              >
                <option value="">
                  Select Company
                </option>

                {companies.map(
                  (
                    company: any
                  ) => (
                    <option
                      key={
                        company.id
                      }
                      value={
                        company.id
                      }
                    >
                      {
                        company.name
                      }
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field label="Role">
              <input
                name="role"
                required
                placeholder="Software Engineer"
                className={
                  inputStyle
                }
              />
            </Field>

            <Field label="Experience (Years)">
              <input
                type="number"
                name="experienceYears"
                required
                placeholder="3"
                className={
                  inputStyle
                }
              />
            </Field>

            <Field label="Level">
              <input
                name="level"
                required
                placeholder="L4"
                className={
                  inputStyle
                }
              />
            </Field>

            <Field label="Base Salary">
              <input
                type="number"
                name="baseSalary"
                required
                placeholder="3500000"
                className={
                  inputStyle
                }
              />
            </Field>

            <Field label="Location">
              <input
                name="location"
                required
                placeholder="Bangalore"
                className={
                  inputStyle
                }
              />
            </Field>

            <Field label="Bonus">
              <input
                type="number"
                name="bonus"
                required
                placeholder="400000"
                className={
                  inputStyle
                }
              />
            </Field>

            <Field label="Stock">
              <input
                type="number"
                name="stock"
                required
                placeholder="800000"
                className={
                  inputStyle
                }
              />
            </Field>

            <button
              type="submit"
              className="w-full h-14 bg-black text-white rounded-2xl text-lg font-semibold hover:opacity-90 transition-all duration-200"
            >
              Submit
              Compensation
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

const inputStyle =
  "w-full h-14 rounded-xl border border-slate-300 bg-white px-5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-800">
        {label}
      </label>
      {children}
    </div>
  );
}