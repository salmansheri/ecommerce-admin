import prisma from "@/lib/prismaDB";
import { Billboard } from "@prisma/client";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import BillboardForm from "./components/billboard-form";

export const metadata: Metadata = {
  title: "Billboard - Admin Dashboard",
};

export default async function BillboardPage({
  params,
}: {
  params: {
    billboardId: string;
    storeId: string;
  };
}) {
  if (params.billboardId === undefined) {
    redirect(`/${params.storeId}/billboards/new`);
  }
  var billboard: Billboard | null = await prisma.billboard.findFirst({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
}
