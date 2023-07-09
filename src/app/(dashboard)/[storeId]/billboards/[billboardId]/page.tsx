import prisma from "@/lib/prismaDB"
import BillboardForm from "./components/billboard-form"
import { Billboard } from "@prisma/client"; 
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Billboard - Admin Dashboard",
}

export default async function BillboardPage({
    params
}: {
    params: {
        billboardId: string, 
    }
}) {
    // const billboard: Billboard | null = await prisma.billboard.findUnique({
    //     where: {
    //         id: params.billboardId, 
    //     }
    // })
    const billboard = null; 
    return(
        <div
            className="flex-col"

        >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm 
                    initialData={billboard}
                />

            </div>

        </div>

    )
}