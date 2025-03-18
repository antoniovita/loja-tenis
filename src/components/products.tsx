import axios from "axios";
import { useEffect, useState } from "react";

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
    <div className="flex flex-col justify-center items-center py-10">
      <h1 className="text-3xl font-bold">Produtos</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="mt-4">
          {products.map((product) => (
            <div key={product.id} className="mb-2">
              <h1>{product.name}</h1>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsSection;