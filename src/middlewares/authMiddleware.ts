import { NextResponse, NextRequest } from 'next/server';
const jwt = require('jsonwebtoken');

export const authenticate = (req: NextRequest) => { 
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return NextResponse.json({error: "Rota desautorizada."}, {status: 401});
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.key!);

        return decoded;
    } catch (error) {
        return NextResponse.json( { error: "Token inválido." }), {status: 403};
    }
}

export default authenticate;