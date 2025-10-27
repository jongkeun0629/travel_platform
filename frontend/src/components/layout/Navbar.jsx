import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import { FaAngleDown, FaPlane, FaRegUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

export default function Navbar({ user, onLogout }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [tripOpen, setTripOpen] = useState(false);

  const reviewRef = useRef(null);
  const tripRef = useRef(null);

  useOutsideClick(reviewRef, () => setReviewOpen(false));
  useOutsideClick(tripRef, () => setTripOpen(false));

  const handleLogout = () => {
    onLogout();
  };

  const toggleReviewMenu = () => {
    setReviewOpen(!reviewOpen);
    setTripOpen(false);
  };

  const toggleTripMenu = () => {
    setTripOpen(!tripOpen);
    setReviewOpen(false);
  };

  const closeAllMenus = () => {
    setReviewOpen(false);
    setTripOpen(false);
  };

  // 인코딩 깨짐 보정(간단한 Latin1 -> UTF-8 복원 시도)
  const fixEncoding = (s) => {
    if (!s || typeof s !== "string") return s;
    try {
      // decodeURIComponent(escape(...))은 Latin1로 잘못 해석된 UTF-8 바이트를 복원해 줍니다.
      return decodeURIComponent(escape(s));
    } catch (e) {
      return s;
    }
  };

  const rawName = user?.username ?? user?.name ?? user?.email ?? "";
  const displayName = fixEncoding(rawName);

  return (
    <nav className="bg-gray-200 shadow-md w-full sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <FaPlane className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl text-gray-900 hidden sm:block">
                TravelLog
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative" ref={reviewRef}>
                <button
                  onClick={toggleReviewMenu}
                  className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  후기
                  <FaAngleDown
                    className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                      reviewOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {reviewOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-gray-200 rounded-md shadow-lg py-1 z-20 ring-1 ring-gray-300">
                    <Link
                      to="/place-reviews"
                      onClick={closeAllMenus}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                      장소후기
                    </Link>
                    <Link
                      to="/trip-reviews"
                      onClick={closeAllMenus}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                      여행후기
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative" ref={tripRef}>
                <button
                  onClick={toggleTripMenu}
                  className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  여행
                  <FaAngleDown
                    className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                      tripOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {tripOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-gray-200 rounded-md shadow-lg py-1 z-20 ring-1 ring-gray-300">
                    <Link
                      to="/plans"
                      onClick={closeAllMenus}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                      여행계획
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              안녕하세요,{" "}
              <span className="font-semibold text-blue-600">{displayName}</span>
              님
            </span>
            <Link
              to="/profile"
              onClick={closeAllMenus}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              title="마이페이지"
            >
              <FaRegUserCircle className="h-5 w-5" />
              <span className="ml-1">마이페이지</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              title="로그아웃"
            >
              <MdLogout className="h-5 w-5" />
              <span className="ml-1">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
