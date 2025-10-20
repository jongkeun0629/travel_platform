import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../services/userService";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      userService.register({ email, password });
      navigate("/login");
    } catch (e) {
      setError("로그인에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-white">
          회원가입
        </h1>
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            회원가입
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-400 hover:underline">
            뒤로
          </Link>
        </div>
      </div>
    </div>
  );
}
