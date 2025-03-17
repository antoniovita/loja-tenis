import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Buscar carrinho do usuário
const getCart = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "userId obrigatório." }, { status: 400 });

    const cart = await prisma.cart.findUnique({ where: { userId }, include: { items: true } });

    return cart ? NextResponse.json(cart) : NextResponse.json({ error: "Carrinho não encontrado." }, { status: 404 });
}

// Adicionar item ao carrinho
export async function PUT(req: NextRequest) {
    const { cartId, itemId, quantity } = await req.json();

    await prisma.cartItem.create({ data: { cartId, itemId, quantity } });

    return NextResponse.json({ message: "Item adicionado ao carrinho!" });
}

// Remover item do carrinho
export async function DELETE(req: NextRequest) {
    const { cartItemId } = await req.json();

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    return NextResponse.json({ message: "Item removido do carrinho!" });
}
