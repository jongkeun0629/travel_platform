import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// 임시 도시 데이터
const cityData = [
  { id: 1, name: "서울" },
  { id: 2, name: "부산" },
  { id: 3, name: "제주" },
  { id: 4, name: "대전" },
];

export default function CreatePlan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [travelTitle, setTravelTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const navigate = useNavigate();

  // 도시 검색 필터
  const filteredCities = cityData.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 도시 선택/해제
  const handleCityToggle = (cityId) => {
    setSelectedCities((prev) =>
      prev.includes(cityId)
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId]
    );
  };

  // 완료 버튼 클릭
  const handleComplete = () => {
    if (
      selectedCities.length > 0 &&
      travelTitle.trim() !== "" &&
      startDate &&
      endDate
    ) {
      const selectedCityNames = cityData
        .filter((c) => selectedCities.includes(c.id))
        .map((c) => c.name);

      const user = JSON.parse(localStorage.getItem("currentUser"));
      const username = user?.userId; // user가 null일 수도 있으니 optional chaining 사용

      navigate("/traveldetail", {
        state: {
          travelTitle,
          selectedCities: selectedCityNames,
          travelPeriod: { startDate, endDate },
          author: username,
        },
      });
    } else {
      alert("여행 제목, 도시, 기간을 모두 입력해 주세요.");
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <h1 className="text-3xl font-bold">여행 계획 생성</h1>
        <Link to="/">
          <button className="text-5xl text-gray-400 hover:text-white">
            <IoIosClose />
          </button>
        </Link>
      </div>

      {/* 여행 제목 입력 */}
      <div className="mb-6">
        <label htmlFor="travelTitle" className="block text-lg font-medium mb-2">
          여행 제목
        </label>
        <input
          type="text"
          id="travelTitle"
          placeholder="예: 유럽 배낭여행 2025"
          value={travelTitle}
          onChange={(e) => setTravelTitle(e.target.value)}
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 도시 검색 */}
      <div className="mb-6">
        <label htmlFor="citySearch" className="block text-lg font-medium mb-2">
          도시 선택
        </label>
        <input
          type="text"
          id="citySearch"
          placeholder="도시를 검색하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 도시 리스트 */}
      <div className="max-h-80 overflow-y-auto border border-gray-600 rounded-lg p-3 mb-8 bg-gray-800">
        {filteredCities.length > 0 ? (
          filteredCities.map((city) => (
            <div
              key={city.id}
              className="flex items-center p-2 rounded-md hover:bg-gray-700"
            >
              <input
                type="checkbox"
                id={`city-${city.id}`}
                checked={selectedCities.includes(city.id)}
                onChange={() => handleCityToggle(city.id)}
                className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`city-${city.id}`}
                className="ml-3 text-lg font-medium cursor-pointer"
              >
                {city.name}
              </label>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-4">
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      {/* 여행 기간 */}
      <div className="mb-8">
        <label className="block text-lg font-medium mb-2">여행 기간 선택</label>
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜를 선택하세요"
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-center text-white placeholder-gray-400 focus:outline-none"
          calendarClassName="bg-gray-800 text-white"
        />
      </div>

      {/* 완료 버튼 */}
      <button
        onClick={handleComplete}
        className={`w-full p-4 text-xl font-bold rounded-lg transition-colors ${
          selectedCities.length > 0 &&
          travelTitle.trim() !== "" &&
          startDate &&
          endDate
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-600 cursor-not-allowed"
        }`}
        disabled={
          selectedCities.length === 0 ||
          travelTitle.trim() === "" ||
          !startDate ||
          !endDate
        }
      >
        다음
      </button>
    </div>
  );
}
