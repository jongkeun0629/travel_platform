import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import KakaoMapModal from "../components/Map/KakaoMapModal";

/** ---------------------------
 *  유틸 함수들 (컴포넌트 바깥에 정의)
 *  - 재사용 가능, renderContent에서 접근 가능
 * ----------------------------*/

// 입력 타입 자동 판단
const getInputType = (label) => {
  if (label.includes("날짜")) return "date";
  if (label.includes("시간")) return "time";
  if (label.includes("전화")) return "tel";
  if (label.includes("주소")) return "text";
  return "text";
};

// 예약 유형별 필드
const getReservationFields = (type) => {
  switch (type) {
    case "교통":
      return [
        "출발지",
        "출발시간",
        "도착지",
        "도착시간",
        "좌석",
        "예약번호",
        "메모",
      ];
    case "숙소":
      return [
        "숙소이름",
        "주소",
        "체크인시간",
        "체크아웃시간",
        "전화번호",
        "예약번호",
        "메모",
      ];
    case "음식점":
      return ["식당이름", "예약날짜", "예약시간", "주소", "전화번호", "메모"];
    default:
      return [];
  }
};

/** ---------------------------
 *  TravelDetail 컴포넌트
 * ----------------------------*/
export default function TravelDetail() {
  const { id } = useParams(); // URL에서 id 가져오기
  const location = useLocation();

  // plan: travelPlans 에 저장되는 최상위 객체 (id, travelTitle, selectedCities, travelPeriod, author, travelData 등)
  const [plan, setPlan] = useState(null);

  // travelData: 실제 체크리스트, itinerary, reservations 를 담음
  const [travelData, setTravelData] = useState({
    checklist: [],
    itinerary: [],
    reservations: [],
  });

  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("info");

  // 입력용 로컬 상태들
  const [newChecklist, setNewChecklist] = useState("");
  const [newPlan, setNewPlan] = useState({
    date: "",
    time: "",
    place: "",
    content: "",
  });
  const [reservationType, setReservationType] = useState("교통");
  const [newReservation, setNewReservation] = useState({});

  // 모달 관리
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState("");

  /* ------------------------------
      저장/업데이트 유틸 함수
  ------------------------------ */
  const saveToLocalStorage = (updatedPlan) => {
    const savedPlans = JSON.parse(localStorage.getItem("travelPlans") || "[]");
    const filtered = savedPlans.filter(
      (p) => Number(p.id) !== Number(updatedPlan.id)
    );
    const newArr = [...filtered, updatedPlan];
    localStorage.setItem("travelPlans", JSON.stringify(newArr));
  };

  const updateAndSave = (updatedTravelData) => {
    const updatedPlan = {
      ...(plan || {}),
      id: plan?.id ?? id,
      travelData: updatedTravelData,
    };
    setPlan(updatedPlan);
    setTravelData(updatedTravelData);
    saveToLocalStorage(updatedPlan);
  };

  // 여행 기본 정보 수정 핸들러
  const handleUpdateInfo = (field, value) => {
    const updatedPlan = { ...plan, [field]: value };
    setPlan(updatedPlan);
    saveToLocalStorage(updatedPlan);
  };

  /* ------------------------------
      초기 로드
  ------------------------------ */
  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem("travelPlans") || "[]");

    if (location.state && location.state.id) {
      // 새 여행 생성 시 (CreatePlan에서 넘어온 경우)
      const newPlan = {
        id: location.state.id,
        travelTitle: location.state.travelTitle,
        selectedCities: location.state.selectedCities || [],
        travelPeriod: location.state.travelPeriod,
        author: location.state.author,
        travelType: location.state.travelType || "일반 여행",
        visibility: location.state.visibility || "전체 공개",
        travelData: location.state.travelData || {
          checklist: ["교통편", "숙소", "세면도구", "의류", "충전기"],
          itinerary: [],
          reservations: [],
        },
      };
      setPlan(newPlan);
      setTravelData(newPlan.travelData);
      saveToLocalStorage(newPlan);
    } else {
      // 기존 여행 불러오기
      const existing = savedPlans.find((p) => Number(p.id) === Number(id));
      if (existing) {
        setPlan(existing);
        setTravelData(existing.travelData);
      }
    }
    setLoading(false);
  }, [id]);

  /* ------------------------------
      핸들러 모음
  ------------------------------ */
  const handleOpenModal = (field) => {
    setModalField(field);
    setModalOpen(true);
  };

  const handleSelectPlace = ({ address, phone, place_name }) => {
    if (modalField === "place") {
      // 일정의 place 입력
      setNewPlan((prev) => ({ ...prev, place: place_name }));
    } else {
      // 예약 항목에서 주소/전화/이름 채우기
      setNewReservation((prev) => {
        const field = modalField;
        let value = "";
        if (field.includes("주소")) value = address;
        else if (field.includes("전화")) value = phone;
        else value = place_name;
        return { ...prev, [field]: value };
      });
    }
    setModalOpen(false);
  };

  const openKakaoMap = (place) => {
    const url = `https://map.kakao.com/?q=${encodeURIComponent(place)}`;
    window.open(url, "_blank");
  };

  const handleAddChecklist = () => {
    if (!newChecklist.trim()) return;
    const updated = {
      ...travelData,
      checklist: [...(travelData.checklist || []), newChecklist.trim()],
    };
    updateAndSave(updated);
    setNewChecklist("");
  };

  const handleRemoveChecklist = (i) => {
    const updated = {
      ...travelData,
      checklist: travelData.checklist.filter((_, idx) => idx !== i),
    };
    updateAndSave(updated);
  };

  const handleAddPlan = () => {
    if (!newPlan.date || !newPlan.time || !newPlan.content) {
      alert("날짜, 시간, 내용을 모두 입력하세요.");
      return;
    }
    const updated = {
      ...travelData,
      itinerary: [...(travelData.itinerary || []), newPlan],
    };
    updateAndSave(updated);
    setNewPlan({ date: "", time: "", place: "", content: "" });
  };

  const handleRemovePlan = (i) => {
    const updated = {
      ...travelData,
      itinerary: travelData.itinerary.filter((_, idx) => idx !== i),
    };
    updateAndSave(updated);
  };

  const handleAddReservation = () => {
    const fields = getReservationFields(reservationType);
    const missing = fields.some(
      (f) =>
        f !== "메모" && (!newReservation[f] || newReservation[f].trim() === "")
    );
    if (missing) {
      alert("필수 항목을 모두 입력하세요.");
      return;
    }
    const updated = {
      ...travelData,
      reservations: [
        ...(travelData.reservations || []),
        { type: reservationType, ...newReservation },
      ],
    };
    updateAndSave(updated);
    setNewReservation({});
  };

  const handleRemoveReservation = (i) => {
    const updated = {
      ...travelData,
      reservations: travelData.reservations.filter((_, idx) => idx !== i),
    };
    updateAndSave(updated);
  };

  /* ------------------------------
      렌더링
  ------------------------------ */
  if (loading) return <div className="p-8 text-gray-400">로딩 중...</div>;
  if (!plan)
    return <div className="p-8 text-gray-400">계획을 찾을 수 없습니다.</div>;

  const renderContent = () => {
    switch (selectedMenu) {
      case "info":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4">🧭 여행 정보</h2>

            <p className="mb-2 text-lg">
              작성자: {plan.author || "알 수 없음"}
            </p>
            <p className="mb-2 text-lg">
              여행 도시: {(plan.selectedCities || []).join(", ") || "미정"}
            </p>
            <p className="mb-2 text-lg">
              여행 기간:{" "}
              {plan.travelPeriod
                ? `${new Date(
                    plan.travelPeriod.startDate
                  ).toLocaleDateString()} ~ ${new Date(
                    plan.travelPeriod.endDate
                  ).toLocaleDateString()}`
                : "미정"}
            </p>
            <p className="mb-2 text-lg">여행 타입: {plan.travelType}</p>
            <p className="mb-2 text-lg">공개 여부: {plan.visibility}</p>
          </div>
        );

      case "checklist": {
        const sampleChecklist = [
          "교통편",
          "숙소",
          "세면도구",
          "의류",
          "보조배터리",
          "충전기",
          "상비약",
        ];
        const checklistItems =
          travelData.checklist && travelData.checklist.length
            ? travelData.checklist
            : sampleChecklist;

        return (
          <div>
            <h2 className="text-3xl font-bold mb-4">📋 체크리스트</h2>

            <div className="mb-4 flex gap-2">
              <input
                className="bg-gray-800 border border-gray-700 p-2 rounded-lg text-lg w-full"
                value={newChecklist}
                onChange={(e) => setNewChecklist(e.target.value)}
                placeholder="항목 추가 (예: 여권)"
              />
              <button
                onClick={handleAddChecklist}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-lg font-semibold"
              >
                +
              </button>
            </div>

            <ul>
              {checklistItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-800 p-3 mb-2 rounded-lg shadow-md text-lg"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleRemoveChecklist(index)}
                    className="text-red-400 hover:text-red-500 text-xl"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      case "itinerary": {
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">🗓️ 일정 관리</h2>

            <div className="grid md:grid-cols-4 gap-3 mb-6">
              <div>
                <p className="text-gray-300 mb-4">📅 날짜를 선택하세요</p>
                <input
                  type="date"
                  value={newPlan.date}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, date: e.target.value })
                  }
                  className="bg-gray-800 border border-gray-700 p-2 rounded-lg w-full"
                />
              </div>

              <div>
                <p className="text-gray-300 mb-4">🕒 시간을 선택하세요</p>
                <input
                  type="time"
                  value={newPlan.time}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, time: e.target.value })
                  }
                  className="bg-gray-800 border border-gray-700 p-2 rounded-lg w-full"
                />
              </div>

              <div>
                <p className="text-gray-300 mb-4">📍 장소를 입력하세요</p>
                <div className="flex">
                  <input
                    placeholder="장소"
                    value={newPlan.place}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, place: e.target.value })
                    }
                    className="bg-gray-800 border border-gray-700 p-2 rounded-lg w-full mr-2"
                  />
                  <button
                    onClick={() => handleOpenModal("place")}
                    className="bg-blue-600  cursor-pointer hover:bg-blue-700 px-3 py-2 rounded-lg text-white w-20"
                  >
                    검색
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-300 mb-4">✏️ 내용을 작성하세요</p>
                <input
                  placeholder="내용"
                  value={newPlan.content}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, content: e.target.value })
                  }
                  className="bg-gray-800 border border-gray-700 p-2 rounded-lg w-full"
                />
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={handleAddPlan}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold"
              >
                일정 추가
              </button>
            </div>

            {(travelData.itinerary || []).length === 0 ? (
              <p className="text-gray-400 text-center">아직 일정이 없습니다.</p>
            ) : (
              (travelData.itinerary || []).map((p, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 p-4 rounded-lg mb-3 shadow-md flex justify-between items-center hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-semibold text-xl">
                      {p.date} {p.time}
                    </p>
                    <p>{p.content}</p>
                  </div>
                  <div>
                    {p.place && (
                      <button
                        onClick={() => openKakaoMap(p.place)}
                        className="text-blue-400 hover:underline mr-5"
                      >
                        📍 {p.place}
                      </button>
                    )}
                    <button
                      onClick={() => handleRemovePlan(idx)}
                      className="text-red-400 hover:text-red-500 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      }

      case "reservations": {
        const fields = getReservationFields(reservationType);
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4">📑 예약 정보</h2>

            <div className="mb-4">
              <label className="mr-3 text-lg">유형 선택:</label>
              <select
                value={reservationType}
                onChange={(e) => setReservationType(e.target.value)}
                className="bg-gray-800 border border-gray-700 p-2 rounded-lg"
              >
                <option>교통</option>
                <option>숙소</option>
                <option>음식점</option>
              </select>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <p className="text-gray-300 mb-3 text-lg font-medium">
                ✏️ {reservationType} 예약 정보를 입력하세요.
              </p>

              {fields.map((f) => {
                const type = getInputType(f);
                const isSearchable =
                  f.includes("주소") ||
                  f.includes("전화") ||
                  ["출발지", "도착지", "숙소이름", "식당이름"].includes(f);
                return (
                  <div key={f} className="flex gap-2 mb-2">
                    <input
                      type={type}
                      placeholder={f}
                      value={newReservation[f] || ""}
                      onChange={(e) =>
                        setNewReservation({
                          ...newReservation,
                          [f]: e.target.value,
                        })
                      }
                      className="bg-gray-900 border border-gray-700 p-2 rounded-lg w-full"
                    />
                    {isSearchable && (
                      <button
                        onClick={() => handleOpenModal(f)}
                        className="bg-blue-600  cursor-pointer hover:bg-blue-700 px-3 py-2 rounded-lg text-white w-20"
                      >
                        검색
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={handleAddReservation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold"
              >
                예약 추가
              </button>
            </div>

            {(travelData.reservations || []).length === 0 ? (
              <p className="text-gray-400 text-center">
                등록된 예약이 없습니다.
              </p>
            ) : (
              (travelData.reservations || []).map((res, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 p-4 rounded-lg mb-3 shadow-md flex justify-between hover:shadow-lg transition"
                >
                  <div>
                    <p className="text-xl font-semibold mb-2">[{res.type}]</p>
                    {Object.entries(res).map(
                      ([k, v]) =>
                        k !== "type" && (
                          <p key={k} className="text-gray-300">
                            <span className="font-semibold">{k}:</span> {v}
                          </p>
                        )
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveReservation(idx)}
                    className="text-red-400 hover:text-red-500 text-xl"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  // 컴포넌트 렌더
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">{plan.travelTitle}</h1>
        <Link to="/">
          <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-lg">
            홈으로
          </button>
        </Link>
      </div>

      <div className="flex border-b border-gray-700 mb-6 text-xl">
        {["info", "checklist", "itinerary", "reservations"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedMenu(tab)}
            className={`px-6 py-3 transition-colors ${
              selectedMenu === tab
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab === "info"
              ? "여행 정보"
              : tab === "checklist"
              ? "체크리스트"
              : tab === "itinerary"
              ? "일정"
              : "예약 정보"}
          </button>
        ))}
      </div>

      {/* 선택된 탭 콘텐츠 */}
      {renderContent()}

      {/* 모달 */}
      {modalOpen && (
        <KakaoMapModal
          onSelect={handleSelectPlace}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
