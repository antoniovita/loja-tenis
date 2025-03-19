import { Prisma } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import authenticate from "@/middlewares/authMiddleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get by category
export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("id");

        if (categoryId) {
            const items = await prisma.item.findMany({ where: { categoryId } });
             if (items.length === 0) {
                return NextResponse.json({ message: "Categoria não encontrada." }, { status: 404 });
            }
            return NextResponse.json(items);
        }

        const allItems = await prisma.item.findMany();
        return NextResponse.json(allItems);
    } catch (error) {
        return NextResponse.json({ message: "Erro ao buscar itens da categoria." }, { status: 500 });
    }
};

// create category (protegida)
export const POST = async (req: NextRequest) => {
    try {
        const auth = await authenticate(req);
        if (!auth) {
            return NextResponse.json({ error: "Usuário não autorizado." }, { status: 401 });
        }

        const text = await req.text();
        let body;
        try {
            body = JSON.parse(text);
        } catch (jsonError) {
            console.error("Erro ao fazer parse do JSON. Texto recebido:", text);
            return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
        }

        if (!body.name) {
            return NextResponse.json({ error: "Campo obrigatório." }, { status: 400 });
        }
        const category = await prisma.category.create({
            data: {
                name: body.name,
            },
        });

        return NextResponse.json({ success: true, category });
    } catch (error) {
        console.error("Erro ao criar a categoria:", error);
        return NextResponse.json({ error: "Erro ao criar a categoria." }, { status: 500 });
    }
};