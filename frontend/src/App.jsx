import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreatePlan from "./pages/CreatePlan";
import TravelDetail from "./pages/TravelDetail";
import ProfilePage from "./pages/ProfilePage";
import OAuthRedirectHandler from "./pages/OAuthRedirectHandler";
import TripReviewPage from "./pages/TripReviewPage"; // ★ 추가
import PlaceReviewPage from "./pages/PlaceReviewPage"; // ★ 추가
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import PlanPage from "./pages/PlanPage";

function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={logout} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
          <Routes>
            {/* 인증 필요한 영역 */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/createplan" element={<CreatePlan />} />
              <Route path="/traveldetail/:id" element={<TravelDetail />} />
              <Route path="/plans" element={<PlanPage />} />

              {/* ★ 후기 라우트들 여기 추가 */}
              <Route path="/trip-reviews" element={<TripReviewPage />} />
              <Route path="/place-reviews" element={<PlaceReviewPage />} />

              {/* 인증 구역 내 NotFound */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* 공개 라우트 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/oauth2/callback" element={<OAuthRedirectHandler />} />

            {/* ★ 공개 구역에서도 매칭 안 될 때 대비 NotFound 한 번 더 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
