'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AddButton from "../../../components/addbutton";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CategoryResponse {
  category: string;
  items: Product[];
}

const CategoryPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/category?id=${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="container mx-auto py-10">
      {loading ? (
        <p>Carregando...</p>
      ) : !data || data.items.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">{data.category}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((product) => (
              <div key={product.id} className="bg-white p-4 shadow rounded">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="mt-2">Preço: R$ {product.price.toFixed(2)}</p>
                <Link href={`/products/${product.id}`}>
                  <span className="text-blue-500 underline mt-4 block cursor-pointer">
                    Ver detalhes
                  </span>
                </Link>
                <AddButton productId={product.id}></AddButton>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;