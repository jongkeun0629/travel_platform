import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import TravelDetail from "./pages/TravelDetail";

export default function App() {
  return (
    <BrowserRouter>
      {/* 전체 배경과 기본 폰트 설정 */}
      <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
        {/* 콘텐츠를 중앙에 배치하고 최대 너비 설정 */}
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/travel/:id" element={<TravelDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
