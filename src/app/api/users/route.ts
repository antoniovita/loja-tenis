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

const getUserById = async (req: Request) => {
    try { 
        const body = await req.json()
        const user = await prisma.user.findUnique({where: {id: body.id}})
        return user;
    } catch (error){
        return NextResponse.json({error: "Erro ao buscar usuário pelo id."})
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

const loginUserWithEmail = async (req: Request ) => {
    try{
        const body = await req.json();
        const user = await prisma.user.findUnique({ where: { email: body.email}});

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado'}, {status: 404});
        }

        const match = await bcrypt.comapare(body.password, user.password);
        
        if(!match) {
            return NextResponse.json({error: "Senha inválida."})
        }

        return NextResponse.json({message: "Login executado com sucesso!", user})

    } catch ( error ) {
        return NextResponse.json({ error: "Erro ao fazer login"})
    }
}

module.exports = { getUsers, getUserById, loginUserWithEmail, createUser}