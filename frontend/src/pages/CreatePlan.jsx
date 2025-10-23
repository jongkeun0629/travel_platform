import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// 임시 데이터
const cityData = [
  { id: 1, name: "서울" },
  { id: 2, name: "부산" },
  { id: 3, name: "제주" },
  { id: 4, name: "대전" },
];

const travelTypeOptions = [
  { id: 1, name: "혼자" },
  { id: 2, name: "커플" },
  { id: 3, name: "가족" },
  { id: 4, name: "친구" },
  { id: 5, name: "비즈니스" },
];

const publicSettingOptions = [
  { id: 1, name: "전체 공개" },
  { id: 2, name: "친구 공개" },
  { id: 3, name: "비공개" },
];

export default function CreatePlan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [travelTitle, setTravelTitle] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedVisibility, setSelectedVisibility] = useState(null);
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

  // 날짜 변경
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // 완료 버튼 클릭
  const handleComplete = () => {
    if (
      selectedCities.length > 0 &&
      travelTitle.trim() !== "" &&
      startDate &&
      endDate &&
      selectedType &&
      selectedVisibility
    ) {
      const selectedCityNames = cityData
        .filter((c) => selectedCities.includes(c.id))
        .map((c) => c.name);

      const user = JSON.parse(localStorage.getItem("currentUser"));
      const username = user?.userId;

      const lastId = parseInt(localStorage.getItem("lastTravelId") || "0", 10);
      const newId = lastId + 1;
      localStorage.setItem("lastTravelId", newId.toString());

      navigate(`/traveldetail/${newId}`, {
        state: {
          id: newId,
          travelTitle,
          selectedCities: selectedCityNames,
          travelPeriod: { startDate, endDate },
          travelType: travelTypeOptions.find((t) => t.id === selectedType)
            ?.name,
          visibility: publicSettingOptions.find(
            (v) => v.id === selectedVisibility
          )?.name,
          author: username,
        },
      });
    } else {
      alert("여행 제목, 도시, 기간, 타입, 공개 여부를 모두 입력해 주세요.");
    }
  };

  // 완료 버튼 활성화 조건
  const isFormValid =
    selectedCities.length > 0 &&
    travelTitle.trim() !== "" &&
    startDate &&
    endDate &&
    selectedType &&
    selectedVisibility;

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

      {/* 여행 제목 */}
      <div className="mb-6">
        <label htmlFor="travelTitle" className="block text-lg font-medium mb-2">
          여행 제목
        </label>
        <input
          type="text"
          id="travelTitle"
          placeholder="예: 2025 제주 한 달 살기"
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

      {/* 여행 타입 */}
      <div className="mb-8">
        <label className="block text-lg font-medium mb-4">여행 타입</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {travelTypeOptions.map((type) => (
            <label
              key={type.id}
              className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition ${
                selectedType === type.id
                  ? "bg-blue-600 border-blue-400"
                  : "bg-gray-800 border-gray-600 hover:bg-gray-700"
              }`}
            >
              <input
                type="radio"
                name="travelType"
                value={type.id}
                checked={selectedType === type.id}
                onChange={() => setSelectedType(type.id)}
                className="hidden"
              />
              <span className="text-lg">{type.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 공개 여부 */}
      <div className="mb-8">
        <label className="block text-lg font-medium mb-4">공개 여부</label>
        <div className="grid grid-cols-3 gap-3">
          {publicSettingOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition ${
                selectedVisibility === option.id
                  ? "bg-green-600 border-green-400"
                  : "bg-gray-800 border-gray-600 hover:bg-gray-700"
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value={option.id}
                checked={selectedVisibility === option.id}
                onChange={() => setSelectedVisibility(option.id)}
                className="hidden"
              />
              <span className="text-lg">{option.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 완료 버튼 */}
      <button
        onClick={handleComplete}
        disabled={!isFormValid}
        className={`w-full p-4 text-xl font-bold rounded-lg transition-colors ${
          isFormValid
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        다음
      </button>
    </div>
  );
}
