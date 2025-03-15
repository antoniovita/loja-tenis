import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const getUsers = async () => {
    try { 
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
    return NextResponse.json({error: "Erro ao buscar usuários."});
}
}

const createUser = async (req: Request ) => { 
    try { 
        const body = await req.json();
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = await prisma.user.create({ data: {
            name: body.name,
            email: body.email,
            password: hashedPassword 
        }})
    } catch ( error ) {
        return NextResponse.json({error: "Erro ao criar usuário."});
    };    
};

const loginUser = async (req: Request ) => {
    try{
        const body = await req.json();
    } catch ( error ) {
        return NextResponse.json({ error: "Erro ao fazer login"})
    }
}