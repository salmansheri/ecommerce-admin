import { getBillboard } from "@/lib/actions/getBillboards";
import CategoryForm from "../[categoryId]/components/category-form";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: 'Add Category - Admin Dashboard', 
}

export default async function NewBillboardPage({
  params,
}: {
  params: { storeId: string };
}) {
  const billboards = await getBillboard(params.storeId);
  console.log(billboards);
  return (
    <div className="p-20">
      <CategoryForm billboards={billboards} />
    </div>
  );
}
