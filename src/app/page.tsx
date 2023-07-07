import { auth } from "@clerk/nextjs";
import HomeClient from "./HomeClient";
import prisma from "@/lib/prismaDB";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prisma.store.findFirst({
    where: {
      userId: userId as string,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return (
    <div className="p-4">
      <HomeClient />
    </div>
  );
}
