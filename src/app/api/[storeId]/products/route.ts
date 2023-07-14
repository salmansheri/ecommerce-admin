import prisma from "@/lib/prismaDB";
import { ProductSchema } from "@/lib/validators/product-schema";
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
  },
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

    const {
      categoryId,
      colorId,
      images,
      name,
      price,
      sizeId,
      isArchieved,
      isFeatured,
    } = ProductSchema.parse(body);

    if (!body) {
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

    const product = await prisma.product.create({
      data: {
        storeId,
        categoryId,
        colorId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        name,
        price,
        sizeId,
        isArchieved,
        isFeatured,
      },
    });

    return new Response(JSON.stringify(product), {
      status: 200,
    });
  } catch (error) {
    console.log("PRODUCT_POST", error);
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
  { params }: { params: { storeId: string } },
) {
  const { storeId } = params;
  try {
    const { searchParams } = new URL(request.url);

    const categoryId = searchParams.get("categoryId") || undefined;

    const sizeId = searchParams.get("sizeId") || undefined;

    const colorId = searchParams.get("colorId") || undefined;

    const isFeatured = searchParams.get("isFeatured");

    const isArchieved = searchParams.get("isArchieved");

    if (!storeId) {
      return new Response("Not Allowed", {
        status: 400,
      });
    }

    const products = await prisma.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchieved: false,
      },
      include: {
        store: true,
        category: true,
        color: true,
        _count: true,
        images: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(products), {
      status: 200,
    });
  } catch (error) {
    console.log("PRODUCTS_GET", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
