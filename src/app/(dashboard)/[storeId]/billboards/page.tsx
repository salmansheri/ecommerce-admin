import prisma from "@/lib/prismaDB";
import BillboardClient from "./components/billboard-client";
import { Metadata } from "next";
import { BillboardColumnType } from "./components/columns";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Billboard - Admin Dashboard",
  description: "All billboards here",
};

export default async function BillboardsPage({
  params,
}: {
  params: { storeId: string };
}) {
  var billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumnType[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient billboards={formattedBillboards} />
      </div>
    </div>
  );
}
