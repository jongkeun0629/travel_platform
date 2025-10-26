import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginData = isEmail(formData.emailOrUsername)
        ? { email: formData.emailOrUsername, password: formData.password }
        : { username: formData.emailOrUsername, password: formData.password };

      const result = await login(loginData);
      navigate("/");
    } catch (err) {
      console.error("login error caught in LoginPage:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-white">
          로그인
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">
              아이디 또는 이메일
            </label>
            <input
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="아이디 또는 이메일을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <button
            type="submit"
            disabled={
              loading || !formData.emailOrUsername || !formData.password
            }
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <div>
            <button onClick={() => handleSocialLogin('google')} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">구글로 로그인</button>
            <button onClick={() => handleSocialLogin('kakao')} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">카카오로 로그인</button>
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center mt-4">{error}</p>
        )}
        <div className="mt-6 text-center">
          <Link to="/register" className="text-blue-400 hover:underline">
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  );
}
