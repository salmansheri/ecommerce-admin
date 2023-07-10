import prisma from "@/lib/prismaDB";
import { BillboardSchema } from "@/lib/validators/billboard-schema";
import { CategorySchema } from "@/lib/validators/category-schema";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function GET(request: Request) {
  try {
  } catch (error) {
    console.log("BILLBOARD_GET");
    return new Response("Internal Server Error");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  const { categoryId } = params;
  const { storeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthenticated", {
        status: 401,
      });
    }

    const body = await request.json();

    const { billboardId, name } = CategorySchema.parse(body);

    if (!name) {
      return new Response("label is required", {
        status: 400,
      });
    }
    if (!billboardId) {
      return new Response("ImageUrl  is required", {
        status: 400,
      });
    }
    if (!storeId) {
      return new Response("Store id is required", {
        status: 400,
      });
    }
    if (!categoryId) {
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

    const category = await prisma.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return new Response(JSON.stringify(category), {
      status: 200,
    });
  } catch (error) {
    console.log("CATEGORY_PATCH ", error);

    if (error instanceof z.ZodError) {
      return new Response("Not Allowed", { status: 422 });
    }

    return new Response("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  const { storeId, categoryId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    if (!categoryId) {
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

    const billboard = await prisma.billboard.delete({
      where: {
        id: categoryId,
      },
    });

    return new Response(JSON.stringify(billboard), {
      status: 200,
    });
  } catch (error) {
    console.log(`CATEGORY_DELETE`, error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
