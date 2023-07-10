import { getBillboard } from "@/lib/actions/getBillboards";
import CategoryForm from "../[categoryId]/components/category-form";

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
