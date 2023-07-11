import prisma from "@/lib/prismaDB";
import { format } from "date-fns";
import { Metadata } from "next";
import { SizesColumnProps } from "./components/columns";
import SizesClient from "./components/sizes-client";

export const metadata: Metadata = {
  title: "Sizes - Admin Dashboard",
  description: "All Sizes here",
};

export default async function SizesPage({
  params,
}: {
  params: { storeId: string };
}) {
  var sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizesColumnProps[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value, 
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient sizes={formattedSizes} />
      </div>
    </div>
  );
}
