import { Prisma } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import authenticate from "@/middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const order = await prisma.order.create({
        data: {
            number: body.number,
            userId: body.userId
        }
    })
}