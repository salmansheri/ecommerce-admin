import prisma from "@/lib/prismaDB";
import { FormSchema } from "@/lib/validators/form-schema";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const body = await request.json();

    const { name } = FormSchema.parse(body);

    if (!name) {
      return new Response("Invalid Data", {
        status: 400,
      });
    }

    const store = await prisma.store.create({
      data: {
        name,
        userId,
      },
    });

    return new Response(JSON.stringify(store), {
      status: 201,
    });
  } catch (error) {
    console.log("[STORES_POST]", error);

    if (error instanceof z.ZodError) {
      return new Response("Not Allowed", {
        status: 422,
      });
    }

    return new Response("Internal error", {
      status: 500,
    });
  }
}
