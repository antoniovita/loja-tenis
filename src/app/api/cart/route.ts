import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../../../middlewares/authMiddleware'; 

const prisma = new PrismaClient();

//get cart 
export const GET = async (req: NextRequest) => {
    const auth = await authenticate(req);
    if (auth instanceof NextResponse) return auth;
  
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: typeof auth === 'object' && 'id' in auth ? auth.id : undefined },
        include: { items: { include: {item: true} } }
      });
  
      return cart
        ? NextResponse.json(cart)
        : NextResponse.json({ error: "Carrinho não encontrado." }, { status: 404 });
    } catch (error) {
      return NextResponse.json({ error: "Erro ao buscar o carrinho." }, { status: 500 });
    }
  };

// add cart item
export const POST = async (req: NextRequest) => {
    try {
        const text = await req.text();
        let body;
        try {
            body = JSON.parse(text);
        } catch (jsonError) {
            console.error("Erro ao fazer parse do JSON. Texto recebido:", text);
            return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
        }
        
        const { userId, itemId, quantity } = body;
        const cart = await prisma.cart.findUnique({ where: { userId } });

        if (!cart) {
            return NextResponse.json({ error: "Carrinho não encontrado." }, { status: 404 });
        }

        const item = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                itemId,
                quantity,
            },
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        console.error("Erro ao criar o produto:", error);
        return NextResponse.json({ error: "Erro ao criar o produto." }, { status: 500 });
    }
};


// delete cart item
export const DELETE = async (req: NextRequest) => {
    const auth = await authenticate(req);
    if (auth instanceof NextResponse) return auth;

    try {
        const { cartItemId } = await req.json();
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true }
        });

        if (!cartItem || typeof auth !== 'object' || !('id' in auth) || cartItem.cart.userId !== auth.id) {
            return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
        }

        await prisma.cartItem.delete({ where: { id: cartItemId } });

        return NextResponse.json({ message: "Item removido do carrinho!" });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao remover item do carrinho." }, { status: 500 });
    }
}
