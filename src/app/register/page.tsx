'use client'
import axios from "axios";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";

const RegisterPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [name, setName] = useState<string>('');
    const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/users', {
        action: 'register',
        email,
        password,
        name,
      });
      console.log("Registro realizado com sucesso:", response.data);
      router.push('/')

      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
      }

    } catch (err: any) {
      console.error("Erro no registro:", err.response?.data || err);
      setError(err.response?.data?.error || "Erro ao fazer registro.");
    }
  };

  return (
    <div className="min-h-[800px] flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
            type="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded"
          />
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
            Register
          </button>
        </form>
        <Link href={'login'}> <button className="py-5 font-thin text-blue-900" > Já possui login? Clique aqui para logar! </button></Link>
      </div>
    </div>
  );
};

export default RegisterPage;