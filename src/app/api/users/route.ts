import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from '@/middlewares/authMiddleware';

const prisma = new PrismaClient();
const key = process.env.JWT_SECRET;

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    if (body.action === 'register') {
        try {
            const hashedPassword = await bcrypt.hash(body.password, 10);

            const newUser = await prisma.user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    password: hashedPassword,
                },
            });

            await prisma.cart.create({ data: { userId: newUser.id } });

            return NextResponse.json({ success: true, user: newUser });
        } catch (error) {
            return NextResponse.json({ error: "Erro ao criar usuário." }, { status: 500 });
        }
    } else if (body.action === 'login') {

        try {
            const user = await prisma.user.findUnique({ where: { email: body.email } });

            if (!user) {
                return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
            }

            const match = await bcrypt.compare(body.password, user.password);

            if (!match) {
                return NextResponse.json({ error: "Senha inválida." }, { status: 401 });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, key, { expiresIn: '1h' });

            return NextResponse.json({ message: "Login realizado com sucesso!", token, user });
        } catch (error) {
            return NextResponse.json({ error: "Erro ao fazer login." }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: "Ação inválida. Use 'register' ou 'login'." }, { status: 400 });
    }
};

export const DELETE = async (req: NextRequest) => {
    const auth = await authenticate(req);
    if (auth instanceof NextResponse) return auth;

    try {
        const body = await req.json();
        const user = await prisma.user.delete({ where: { id: body.id } });

        return NextResponse.json({ message: "Usuário deletado com sucesso!", user });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao deletar usuário. Verifique se o ID é válido." }, { status: 404 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const user = await prisma.user.findUnique({ where: { id: body.id } });

        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar usuário pelo ID." }, { status: 500 });
    }
};
