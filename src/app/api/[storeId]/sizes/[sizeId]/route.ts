import prisma from "@/lib/prismaDB";
import { SizesSchema } from "@/lib/validators/sizes-schema";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function GET(request: Request, { params } : { params: { sizeId: string, storeId: string }}) {
  try {
    if(!params.sizeId) {
      return new Response("Billboard Id is required", {
        status: 400, 
      })
    } 

    const size = await prisma.size.findUnique({
      where: {
        id: params.sizeId, 
      }, 
      include: {
        store: true, 

      }
    }); 

    return new Response(JSON.stringify(size), {
      status: 200, 
    })
  } catch (error) {
    console.log("SIZE_GET");
    return new Response("Internal Server Error");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { sizeId: string; storeId: string } },
) {
  const { sizeId } = params;
  const { storeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", {
        status: 401,
      });
    }

    const body = await request.json();

    const { name, value } = SizesSchema.parse(body);

    if (!name) {
      return new Response("label is required", {
        status: 400,
      });
    }
    if (!value) {
      return new Response("ImageUrl  is required", {
        status: 400,
      });
    }
    if (!storeId) {
      return new Response("Store id is required", {
        status: 400,
      });
    }
    if (!sizeId) {
      return new Response("Store id is required", {
        status: 400,
      });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new Response("Not allowed", {
        status: 400,
      });
    }

    const size = await prisma.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name, 
        value, 
      },
    });

    return new Response(JSON.stringify(size), {
      status: 200,
    });
  } catch (error) {
    console.log("SIZE_PATCH ", error);

    if (error instanceof z.ZodError) {
      return new Response("Not Allowed", { status: 422 });
    }

    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  const { storeId, sizeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    if (!sizeId) {
      return new Response("Not Allowed", {
        status: 400,
      });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new Response("Not Allowed", {
        status: 400,
      });
    }

    const size = await prisma.size.delete({
      where: {
        id: sizeId,
      },
    });

    return new Response(JSON.stringify(size), {
      status: 200,
    });
  } catch (error) {
    console.log(`SIDE_DELETE`, error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
