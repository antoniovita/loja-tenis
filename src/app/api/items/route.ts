import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from '@/middlewares/authMiddleware';

const prisma = new PrismaClient();
const key = process.env.JWT_SECRET;

const getItems = async () => {
    try {
        const items = await prisma.item.findMany();
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ message: "Erro ao buscar itens." }, { status: 500 });
    }
};


//rota get usando searchparams
const getItemById = async (req: NextRequest) => {
    try {    
        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get("id");

        if (!itemId) {
            return NextResponse.json({ message: "ID do produto é necessário." }, { status: 400 });
        }
        const item = await prisma.item.findUnique({ where: { id: itemId } });
        if (!item) {
            return NextResponse.json({ message: "Produto não encontrado." }, { status: 404 });
        }
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Erro na busca por ID." }, { status: 500 });
    }
};

//rota protegida
const deleteItem = async (req: NextRequest) => {
    try {
        const auth = await authenticate(req);
        const body = await req.json();
        const items = await prisma.items.delete({where: {id: body.id}})
    
        if (!items) {
            return NextResponse.json({ message: 'Produto não encontrado'})
        }

        return NextResponse.json(items)
    } catch (error) {
        return NextResponse.json({error: "Erro ao deletar produto."})
    }
}

// rota protegida
const updateItem = async (req: NextRequest) => {
    try {
        const auth = await authenticate(req);
        if (!auth) {
            return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
        }
    
        const body = await req.json();
        if (!body.id || !body.data) {
            return NextResponse.json({ error: "ID e dados são obrigatórios." }, { status: 400 });
        }

        const items = await prisma.items.update({
            where: { id: body.id },
            data: body.data, 
        });
        return NextResponse.json({ success: true, items });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao alterar o produto." }, { status: 500 });
    }
};

//rota protegida
const createItem = async (req: NextRequest) => {
    try {
        const auth = await authenticate(req);
        if (!auth) {
            return NextResponse.json({ error: "Usuário não autorizado." }, { status: 401 });
        }
        const body = await req.json();
        if (!body.name || !body.price || !body.categoryId) {
            return NextResponse.json({ error: "Campos obrigatórios: name, price, categoryId." }, { status: 400 });
        }
        const items = await prisma.item.create({
            data: {
                name: body.name,
                price: body.price,
                categoryId: body.categoryId,
            },
        });
        return NextResponse.json({ success: true, item: items });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao criar o produto." }, { status: 500 });
    }
};

module.exports = {updateItem, deleteItem, getItems, getItemById, createItem}