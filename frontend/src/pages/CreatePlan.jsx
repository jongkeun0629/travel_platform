import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import planService from "../services/plan";
import useAuthStore from "../store/authStore";
import usePlanStore from "../store/planStore";

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

export function CreatePlanForm({ initialData = null, onCancel, onSave }) {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [travelTitle, setTravelTitle] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedVisibility, setSelectedVisibility] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [saving, setSaving] = useState(false);
  const createPlan = usePlanStore((s) => s.createPlan);

  // 초기값 채우기 (수정 모드용)
  useEffect(() => {
    if (initialData) {
      // Backend의 Plan 필드명에 맞춰서 초기값 설정
      setTravelTitle(initialData.title || "");

      // destination은 쉼표로 구분된 문자열 (예: "서울,부산")
      if (initialData.destination) {
        const cityNames = initialData.destination
          .split(",")
          .map((s) => s.trim());
        const cityIds = cityNames
          .map((name) => {
            const found = cityData.find((c) => c.name === name);
            return found ? found.id : null;
          })
          .filter(Boolean);
        setSelectedCities(cityIds);
      }

      // type 필드 처리
      if (initialData.type) {
        const foundType = travelTypeOptions.find(
          (t) => t.name === initialData.type
        );
        if (foundType) setSelectedType(foundType.id);
      }

      // visibility 필드 처리
      if (initialData.visibility) {
        const foundVis = publicSettingOptions.find(
          (v) => v.name === initialData.visibility
        );
        if (foundVis) setSelectedVisibility(foundVis.id);
      }

      // startDate, endDate 처리
      if (initialData.startDate) {
        setStartDate(new Date(initialData.startDate));
      }
      if (initialData.endDate) {
        setEndDate(new Date(initialData.endDate));
      }
    }
  }, [initialData]);

  // 도시 검색 필터
  const filteredCities = cityData.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCityToggle = (cityId) => {
    setSelectedCities((prev) =>
      prev.includes(cityId)
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId]
    );
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // 폼 제출: 서버에 생성 요청만 수행
  const handleComplete = async () => {
    if (
      selectedCities.length === 0 ||
      travelTitle.trim() === "" ||
      !startDate ||
      !endDate ||
      !selectedType ||
      !selectedVisibility
    ) {
      alert("여행 제목, 도시, 기간, 타입, 공개 여부를 모두 입력해 주세요.");
      return;
    }

    const selectedCityNames = cityData
      .filter((c) => selectedCities.includes(c.id))
      .map((c) => c.name);

    // const username = currentUser?.username || currentUser?.email || "unknown";

    const payload = {
      title: travelTitle.trim(),
      destination: selectedCityNames.join(","),
      startDate:
        startDate instanceof Date ? startDate.toISOString() : startDate,
      endDate: endDate instanceof Date ? endDate.toISOString() : endDate,

      type: travelTypeOptions.find((t) => t.id === selectedType)?.name,
      visibility: publicSettingOptions.find((v) => v.id === selectedVisibility)
        ?.name,
    };

    try {
      setSaving(true);
      if (onSave) {
        onSave(payload);
        if (onCancel) onCancel();
      } else {
        const created = await createPlan(payload);
        const newId = created.id ?? created.planId ?? null;
        if (newId) {
          navigate(`/traveldetail/${newId}`, { state: created });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      console.error("Failed to create plan (backend):", err);
      if (err?.response) {
        console.error(
          "status:",
          err.response.status,
          "data:",
          err.response.data
        );
      }
      alert(
        "서버에 여행 계획을 저장하는 데 실패했습니다. 네트워크 또는 서버 상태를 확인하세요."
      );
    } finally {
      setSaving(false);
    }
  };

  const isFormValid =
    selectedCities.length > 0 &&
    travelTitle.trim() !== "" &&
    startDate &&
    endDate &&
    selectedType &&
    selectedVisibility;

  return (
    <div className="p-6 bg-gray-200 mt-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <h1 className="text-3xl font-bold">
          {!initialData ? "여행 계획 생성" : "여행 계획 수정"}
        </h1>
        {onCancel ? (
          <button
            onClick={onCancel}
            className="text-5xl text-gray-600 hover:text-gray-700"
          >
            <IoIosClose />
          </button>
        ) : (
          <Link to="/">
            <button className="text-5xl text-gray-600 hover:text-gray-700">
              <IoIosClose />
            </button>
          </Link>
        )}
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
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100"
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
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100"
        />
      </div>

      {/* 도시 리스트 */}
      <div className="max-h-80 overflow-y-auto border border-gray-600 rounded-lg p-3 mb-8 bg-gray-100">
        {filteredCities.length > 0 ? (
          filteredCities.map((city) => (
            <div
              key={city.id}
              className="flex items-center p-2 rounded-md hover:bg-blue-200"
            >
              <input
                type="checkbox"
                id={`city-${city.id}`}
                checked={selectedCities.includes(city.id)}
                onChange={() => handleCityToggle(city.id)}
                className="w-5 h-5 text-blue-500"
              />
              <label
                htmlFor={`city-${city.id}`}
                className="ml-3 text-lg font-medium"
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
          onChange={(dates) => handleDateChange(dates)}
          dateFormat="yyyy-MM-dd"
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-100"
        />
      </div>

      {/* 여행 타입 */}
      <div className="mb-8">
        <label className="block text-lg font-medium mb-4">여행 타입</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {travelTypeOptions.map((type) => (
            <label
              key={type.id}
              className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                selectedType === type.id
                  ? "bg-blue-600 text-gray-200"
                  : "bg-gray-100"
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
              className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer ${
                selectedVisibility === option.id
                  ? "bg-blue-600 text-gray-200"
                  : "bg-gray-100"
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
        disabled={!isFormValid || saving}
        className={`w-full p-4 text-xl font-bold rounded-lg text-gray-200 ${
          isFormValid ? "bg-blue-600" : "bg-gray-400"
        }`}
      >
        {saving ? "저장 중..." : onSave ? "저장" : "다음"}
      </button>
    </div>
  );
}

export default function CreatePlan() {
  return <CreatePlanForm initialData={null} />;
}
