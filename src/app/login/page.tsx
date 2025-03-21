'use client'
import axios from "axios";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

const LoginPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/users', {
        action: 'login',
        email,
        password,
      });
      console.log("Login realizado com sucesso:", response.data);
      router.push('/')

      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
      }

    } catch (err: any) {
      console.error("Erro no login:", err.response?.data || err);
      setError(err.response?.data?.error || "Erro ao fazer login.");
    }
  };

  return (
    <div className="min-h-[800px] flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
        <Link href={'register'}> <button className="py-5 font-thin text-blue-900" > Ainda não possui login? Clique aqui para se registrar! </button></Link>
      </div>
    </div>
  );
};

export default LoginPage;