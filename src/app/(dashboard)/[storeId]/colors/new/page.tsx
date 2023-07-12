import { Metadata } from "next";
import ColorsForm from "../[colorId]/components/color-form";

export const metadata: Metadata = {
  title: "New Color - Admin Dashboard",
  description: "Create a new Color",  

}

export default function NewBillboardPage() {
  return (
    <div className="p-20">
      <ColorsForm />
    </div>
  );
}
