import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

async function main() {
  await prisma.company.createMany({
    data: [
      {
        name: "Google",
        slug: "google",
        industry: "Technology",
        headquarters: "Bangalore",
      },
      {
        name: "Amazon",
        slug: "amazon",
        industry: "Technology",
        headquarters: "Hyderabad",
      },
      {
        name: "Microsoft",
        slug: "microsoft",
        industry: "Technology",
        headquarters: "Hyderabad",
      },
      {
        name: "Flipkart",
        slug: "flipkart",
        industry: "E-Commerce",
        headquarters: "Bangalore",
      },
    ],
    skipDuplicates: true,
  });

  const companies = await prisma.company.findMany();

  const google = companies.find(
    (c) => c.slug === "google"
  );

  const amazon = companies.find(
    (c) => c.slug === "amazon"
  );

  const microsoft = companies.find(
    (c) => c.slug === "microsoft"
  );

  await prisma.compensation.createMany({
    data: [
      {
        role: "Software Engineer",
        level: "L3",
        location: "Bangalore",
        experienceYears: 1,
        baseSalary: 2800000,
        bonus: 300000,
        stock: 700000,
        totalCompensation: 3800000,
        companyId: google!.id,
      },
      {
        role: "SDE 1",
        level: "L4",
        location: "Hyderabad",
        experienceYears: 2,
        baseSalary: 2400000,
        bonus: 200000,
        stock: 400000,
        totalCompensation: 3000000,
        companyId: amazon!.id,
      },
      {
        role: "Software Engineer",
        level: "L59",
        location: "Hyderabad",
        experienceYears: 2,
        baseSalary: 2600000,
        bonus: 250000,
        stock: 500000,
        totalCompensation: 3350000,
        companyId: microsoft!.id,
      },
    ],
  });

  console.log("✅ Seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });