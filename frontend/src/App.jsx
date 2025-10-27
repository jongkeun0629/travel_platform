import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CreatePlan from "./pages/CreatePlan";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import TravelDetail from "./pages/TravelDetail";
import ProfilePage from "./pages/ProfilePage";
import OAuthRedirectHandler from "./pages/OAuthRedirectHandler";
import Navbar from "./components/layout/Navbar";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import TripReviewPage from "./pages/TripReviewPage";
import PlaceReviewPage from "./pages/PlaceReviewPage";
import PlanPage from "./pages/PlanPage";

function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* 전체 배경과 기본 폰트 설정 */}
      <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
        {/* 콘텐츠를 중앙에 배치하고 최대 너비 설정 */}
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/createplan" element={<CreatePlan />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/trip-reviews" element={<TripReviewPage />} />
              <Route path="/place-reviews" element={<PlaceReviewPage />} />
              <Route path="/traveldetail/:id" element={<TravelDetail />} />
              <Route path="/plans" element={<PlanPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/oauth2/callback" element={<OAuthRedirectHandler/>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
