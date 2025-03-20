'use client'
import axios from "axios";
import { useState } from "react";

interface AddButtonProps {
  productId: string;
}

const AddButton = ({ productId }: AddButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAddtoCart = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token"); 

    if (!token) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "/api/cart",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Produto adicionado com sucesso:", response.data);
    } catch (err: any) {
      console.error("Erro ao adicionar produto ao carrinho:", err);
      setError("Erro ao adicionar produto ao carrinho.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAddtoCart}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        {loading ? "Adicionando..." : "Adicionar ao Carrinho"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AddButton;
