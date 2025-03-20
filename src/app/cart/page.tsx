'use client'
import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
    id: string; 
    name: string;
    price: number;
    quantity: number;
}

const CartPage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error("Token não encontrado. Usuário não autenticado.");
                return;
            }

            try {
                const res = await axios.get('/api/cart', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("Resposta completa da API:", res.data);

                if (!res.data.items || !Array.isArray(res.data.items)) {
                    console.error("A chave 'items' não é um array ou não foi encontrada.");
                    return;
                }

                const formattedProducts = res.data.items.map((cartItem: any) => {

                    return {
                        id: cartItem.item.id,
                        name: cartItem.item.name,
                        price: cartItem.item.price,
                        quantity: cartItem.quantity,
                    };
                });

                console.log("Produtos formatados:", formattedProducts);
                setProducts(formattedProducts);
            } catch (error) {
                console.error("Erro ao buscar produtos do carrinho:", error);
            }
        };

        fetchCart();
    }, []);

    return (
        <div className="py-10 w-full flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Carrinho</h1>
            {products.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
            ) : (
                <div className="flex flex-col gap-5">
                    {products.map((product, index) => (
                        <div key={index} className="w-300 h-24 items-center bg-gray-100 px-8 flex flex-row justify-between rounded-lg shadow-md">
                            <div className="flex flex-row gap-8">
                                <h1 className="w-16 h-16 bg-gray-300 flex items-center justify-center text-gray-500">IMG</h1>
                                <h1 className="mt-4 text-lg font-semibold text-gray-700">{product.name}</h1>
                            </div>
                            <div className="flex flex-row gap-6">
                                <h2 className="text-md text-gray-700">R$ {Number(product.price).toFixed(2)}</h2>
                                <div className="flex flex-row gap-3 px-2 rounded-2xl items-center justify-center bg-zinc-500">
                                    <button className="text-lg text-white"> + </button>
                                    <p className="text-lg text-white"> {product.quantity}</p>
                                    <button className="text-lg text-white"> - </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CartPage;
