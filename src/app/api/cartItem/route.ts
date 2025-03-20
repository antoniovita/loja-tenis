import { Prisma } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { authenticate } from '../../../middlewares/authMiddleware';
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

const DELETE = async (req: NextRequest) => {
 try {
        const auth = await authenticate(req);
        if (!auth) {
            return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
        }

        const body = await req.json();
        if (!body.id) {
            return NextResponse.json({ error: "ID do produto é obrigatório." }, { status: 400 });
        }

        const item = await prisma.cartItem.delete({ where: { id: body.id } });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar produto." }, { status: 500 });
    }
}

export const PUT = async (req: NextRequest) => {
    // Autentica o usuário
    const auth = await authenticate(req);
    if (!auth) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
  
    // Lê e desestrutura o corpo da requisição
    const { quantity, id, action } = await req.json();
    if (!quantity || !id) {
      return NextResponse.json(
        { error: "ID do produto e quantidade são obrigatórios." },
        { status: 400 }
      );
    }
  
    try {
      let updatedItem;
  
      // Caso seja para aumentar ou diminuir a quantidade
      if (action === "increase") {
        updatedItem = await prisma.cartItem.update({
          where: { id },
          data: { quantity: quantity },
        });
      } else if (action === "decrease") {
        updatedItem = await prisma.cartItem.update({
          where: { id },
          data: { quantity: quantity },
        });
      } else {
        return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
      }
  
      return NextResponse.json({ success: true, item: updatedItem });
    } catch (error) {
      console.error("Erro ao atualizar o produto do carrinho:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar o produto do carrinho." },
        { status: 500 }
      );
    }
  };