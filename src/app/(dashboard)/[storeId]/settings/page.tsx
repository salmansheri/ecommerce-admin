import SettingsForm from "@/components/settings-form";
import prisma from "@/lib/prismaDB";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Settings - Admin Dashboard", 
}

export default async function SettingsPage({ params }: { params: { storeId: string }}) {
    const { storeId } = params; 
    const { userId } = auth(); 

    if(!userId) {
        redirect("/sign-in"); 
    }

    const store = await prisma.store.findFirst({
        where: {
            id: storeId, 
        }

    }); 

    if(!store) {
        redirect("/"); 
    }


    return(
        <div className="flex flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">

                <SettingsForm 
                    initialData={store}
                />
            </div>
        </div>
    )
}