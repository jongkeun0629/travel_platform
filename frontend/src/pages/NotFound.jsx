import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-900 text-gray-200">
      <h1 className="text-8xl font-extrabold text-white">404</h1>
      <p className="mt-4 text-2xl font-medium text-gray-400">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
