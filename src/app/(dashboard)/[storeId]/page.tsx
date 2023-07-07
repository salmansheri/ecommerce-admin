import prisma from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  params,
}: {
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
      userId: userId as string,
    },
  });

  if (!store) {
    redirect("/");
  }
  return <div>Store page</div>;
}
