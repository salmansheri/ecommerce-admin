import prisma from "@/lib/prismaDB";
import { CategorySchema } from "@/lib/validators/category-schema";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
    };
  }
) {
  const { storeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    const body = await request.json();

    const { name, billboardId } = CategorySchema.parse(body);

    if (!name || !billboardId) {
      return new Response("Data Required", {
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

    if (!storeId) {
      return new Response("Store Id is Required", {
        status: 400,
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name,
        billboardId,
        storeId,
      },
    });

    return new Response(JSON.stringify(category), {
      status: 200,
    });
  } catch (error) {
    console.log("Category_POST", error);
    if (error instanceof z.ZodError) {
      return new Response("Not Allowed", {
        status: 422,
      });
    }

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  const { storeId } = params;
  try {
    if (!storeId) {
      return new Response("Not Allowed", {
        status: 400,
      });
    }

    const categoriees = await prisma.category.findMany({
      where: {
        storeId,
      },
      include: {
        store: true,
        billboard: true,
      },
    });

    return new Response(JSON.stringify(categoriees), {
      status: 200,
    });
  } catch (error) {
    console.log("CATEGORY_GET", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
