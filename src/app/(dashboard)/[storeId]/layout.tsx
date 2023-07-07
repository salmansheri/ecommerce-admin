import Navbar from "@/components/navbar";

export default async function storeLayout({
    children, 
    params, 
}: {
    children: React.ReactNode, 
    params: {
        storeId: string, 
    }
}) {
    
    return (
        <>
       <Navbar />
            {children}
        </>
    )
}