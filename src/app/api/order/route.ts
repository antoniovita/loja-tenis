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

export const GET = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const auth = await authenticate(req);
        if (!auth) {
            return NextResponse.json({ error: "Usuário não autorizado." }, { status: 401 });
        }

        if(body.action == 'all') {
            const order = prisma.order.findMany()
            return NextResponse.json(order)
        }

        if(body.action == 'my') {
            const order = prisma.order.findUnique({where: {
                data:
                {
                    userId: body.userId
                }
            }})
            return NextResponse.json(order)
        }

        } catch (error) {
        console.error("Erro ao criar o produto:", error);
        return NextResponse.json({ error: "Erro ao criar o produto." }, { status: 500 });
    }
};