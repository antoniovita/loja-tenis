import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '@/middlewares/authMiddleware';

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get("id");

        if (itemId) {
            const item = await prisma.item.findUnique({ where: { id: itemId } });
            if (!item) {
                return NextResponse.json({ message: "Produto não encontrado." }, { status: 404 });
            }
            return NextResponse.json(item);
        }

        const items = await prisma.item.findMany();
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ message: "Erro ao buscar itens." }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const auth = await authenticate(req);
        if (!auth) {
            return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
        }

        const body = await req.json();
        if (!body.id) {
            return NextResponse.json({ error: "ID do produto é obrigatório." }, { status: 400 });
        }

        const item = await prisma.item.delete({ where: { id: body.id } });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar produto." }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        const auth = await authenticate(req);
        if (!auth) {
            return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
        }

        const body = await req.json();
        if (!body.id || !body.data) {
            return NextResponse.json({ error: "ID e dados são obrigatórios." }, { status: 400 });
        }

        const item = await prisma.item.update({
            where: { id: body.id },
            data: body.data, 
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao alterar o produto." }, { status: 500 });
    }
};

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

        if (!body.name || !body.price) {
            return NextResponse.json({ error: "Campos obrigatórios: name e price." }, { status: 400 });
        }

        const item = await prisma.item.create({
            data: {
                name: body.name,
                price: body.price,
                categoryId: body.categoryId || null, 
            },
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        console.error("Erro ao criar o produto:", error);
        return NextResponse.json({ error: "Erro ao criar o produto." }, { status: 500 });
    }
};