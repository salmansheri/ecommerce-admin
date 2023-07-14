import prisma from "@/lib/prismaDB";
import { format } from "date-fns";
import { Metadata } from "next";

import ColorsClient from "./components/colors-client";
import { ColorsColumnType } from "./components/columns";
export const metadata: Metadata = {
  title: "Colors - Admin Dashboard",
  description: "All Colors here",
};

export default async function ColorsPage({
  params,
}: {
  params: { storeId: string };
}) {
  var colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorsColumnType[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient colors={formattedColors} />
      </div>
    </div>
  );
}
