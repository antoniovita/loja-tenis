import axios from "axios";
import { useEffect, useState } from "react";
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

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("/api/items")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center py-10 w-full">
      <h1 className="text-3xl font-bold mb-6">Produtos</h1>
      {loading ? (
        <p>Carregando...</p>
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
                  <h2 className="text-md text-gray-700">R$ {product.price.toFixed(2)}</h2>
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