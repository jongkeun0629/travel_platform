import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../services/userService";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // 아이디 또는 이메일
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("아이디 또는 이메일, 비밀번호를 입력해주세요.");
      return;
    }

    try {
      userService.login({ identifier, password });
      alert("로그인 성공!");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-white">
          로그인
        </h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">
              아이디 또는 이메일
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="아이디 또는 이메일을 입력하세요"
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
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            로그인
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/register" className="text-blue-400 hover:underline">
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  );
}
