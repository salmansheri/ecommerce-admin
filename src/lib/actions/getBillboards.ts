import { auth } from "@clerk/nextjs";
import prisma from "../prismaDB";

export async function getBillboard(storeId: string) {
  const { userId } = auth();

  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: storeId,
    },
  });

  return billboards;
}
