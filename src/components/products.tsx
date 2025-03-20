'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CategoryResponse {
  category: string;
  items: Product[];
}

interface ProductsSectionProps {
  categoryId: string;
  categoryName: string;
}

const ProductsSection = ({ categoryId, categoryName }: ProductsSectionProps) => {
  const [data, setData] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(`/api/category?id=${categoryId}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId]);

  return (
    <div className="flex flex-col py-10 w-full">
      <div className="mx-10 flex flex-row justify-between">
        <h1 className="text-3xl font-bold mb-6">
          {data ? data.category : categoryName}
        </h1>
        <Link href={`category/${categoryId}`}>
          <button className="mt-2 font-thin text-blue-900">
            Ver mais
          </button>
        </Link>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : !data || data.items.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <Swiper
          modules={[FreeMode, Pagination]}
          freeMode={true}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView="auto"
          className="w-full px-4"
        >
          {data.items.map((product) => (
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

export default ProductsSection;
