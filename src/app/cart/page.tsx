'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";

interface Product {
    id: string;
    name: string;
    price: number;
}

const CartPage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        axios.get('/api/cart')
            .then((res) => {
                setProducts(res.data.items || res.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar produtos do carrinho:", error);
            });
    }, []);

    return (
        <div className="py-10 w-full flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Carrinho</h1>
            {products.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
            ) : (
                <Swiper
                    modules={[FreeMode, Pagination]}
                    freeMode={true}
                    pagination={{ clickable: true }}
                    spaceBetween={20}
                    slidesPerView="auto"
                    className="w-full px-4"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product.id} className="w-[250px] max-w-sm">
                            <div className="h-[300px] bg-gray-100 p-4 flex flex-col justify-between rounded-xl shadow-lg">
                                <div>
                                    <h1 className="text-lg font-semibold">{product.name}</h1>
                                    <h2 className="text-md text-gray-700">
                                        R$ {product.price.toFixed(2)}
                                    </h2>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};

export default CartPage;