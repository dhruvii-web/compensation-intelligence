"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSubmission(
  compensationId: string
) {
  const { userId } =
    await auth();

  if (!userId) {
    return;
  }

  const submission =
    await prisma.compensation.findUnique(
      {
        where: {
          id:
            compensationId,
        },
      }
    );

  // only owner can delete
  if (
    submission?.userId !==
    userId
  ) {
    return;
  }

  await prisma.compensation.delete(
    {
      where: {
        id:
          compensationId,
      },
    }
  );

  revalidatePath(
    "/profile"
  );
}