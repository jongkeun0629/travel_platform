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

  // 저장 유틸: plan 과 travelData를 합쳐 localStorage에 덮어쓰기 (중복 추가 방지)
  const saveToLocalStorage = (updatedPlan) => {
    const savedPlans = JSON.parse(localStorage.getItem("travelPlans") || "[]");
    const filtered = savedPlans.filter(
      (p) => Number(p.id) !== Number(updatedPlan.id)
    );
    // 최신 항목을 배열 끝에 넣기
    const newArr = [...filtered, updatedPlan];
    localStorage.setItem("travelPlans", JSON.stringify(newArr));
  };

  // plan 업데이트 + travelData 동기화 + 저장을 하나의 함수로 통일
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

  // 초기 로드: location.state 있으면 새로 생성된 여행으로 처리하고 localStorage에 저장,
  // 없으면 localStorage에서 id로 찾아서 불러옴.
  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem("travelPlans") || "[]");

    if (location.state && location.state.id) {
      // CreatePlan에서 navigate로 전달된 state (새로 만든 여행)
      const newPlan = {
        id: location.state.id,
        travelTitle: location.state.travelTitle,
        selectedCities: location.state.selectedCities || [],
        travelPeriod: location.state.travelPeriod,
        author: location.state.author,
        travelData: location.state.travelData || {
          checklist: ["교통편", "숙소", "세면도구", "의류", "충전기"],
          itinerary: [],
          reservations: [],
        },
      };
      setPlan(newPlan);
      setTravelData(newPlan.travelData);
      saveToLocalStorage(newPlan); // 한 번만 저장
    } else {
      // 기존 여행 불러오기 (홈에서 보기 클릭)
      const existing = savedPlans.find((p) => Number(p.id) === Number(id));
      if (existing) {
        setPlan(existing);
        setTravelData(
          existing.travelData || {
            checklist: ["교통편", "숙소", "세면도구", "의류", "충전기"],
            itinerary: [],
            reservations: [],
          }
        );
      } else {
        // id로도 찾을 수 없는 경우: 빈 플랜 생성
        setPlan({
          id,
          travelTitle: "알 수 없는 여행",
          selectedCities: [],
          travelPeriod: null,
          author: null,
          travelData: {
            checklist: ["교통편", "숙소", "세면도구", "의류", "충전기"],
            itinerary: [],
            reservations: [],
          },
        });
        setTravelData({
          checklist: ["교통편", "숙소", "세면도구", "의류", "충전기"],
          itinerary: [],
          reservations: [],
        });
      }
    }
    setLoading(false);
  }, [id]);

  // 카카오맵 모달/검색 관련
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

  // 카카오 주소 검색(간단)
  const openKakaoAddressSearch = (fieldName) => {
    if (!window.kakao || !window.kakao.maps) {
      alert("카카오맵 SDK가 로드되지 않았습니다.");
      return;
    }
    const ps = new window.kakao.maps.services.Places();
    const keyword = prompt("검색할 장소를 입력하세요:");
    if (!keyword) return;
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const place = data[0];
        const address = place.address_name || place.road_address_name;
        const phone = place.phone || "";
        setNewReservation((prev) => ({
          ...prev,
          ...(fieldName.includes("주소") ? { [fieldName]: address } : {}),
          ...(fieldName.includes("전화") ? { [fieldName]: phone } : {}),
        }));
        alert(`📍 ${place.place_name}\n주소: ${address}\n전화번호: ${phone}`);
      } else {
        alert("검색 결과를 찾을 수 없습니다.");
      }
    });
  };

  const openKakaoMap = (place) => {
    const url = `https://map.kakao.com/?q=${encodeURIComponent(place)}`;
    window.open(url, "_blank");
  };

  // 핸들러들 (모두 const로 정리, updateAndSave 사용)
  const handleAddChecklist = () => {
    const text = newChecklist?.trim();
    if (!text) return;
    const updated = {
      ...travelData,
      checklist: [...(travelData.checklist || []), text],
    };
    updateAndSave(updated);
    setNewChecklist("");
  };

  const handleRemoveChecklist = (index) => {
    const updated = {
      ...travelData,
      checklist: (travelData.checklist || []).filter((_, i) => i !== index),
    };
    updateAndSave(updated);
  };

  const handleAddPlan = () => {
    if (!newPlan.date || !newPlan.time || !newPlan.content) {
      alert("날짜, 시간, 내용을 모두 입력해 주세요.");
      return;
    }
    const updated = {
      ...travelData,
      itinerary: [...(travelData.itinerary || []), newPlan],
    };
    updateAndSave(updated);
    setNewPlan({ date: "", time: "", place: "", content: "" });
  };

  const handleRemovePlan = (index) => {
    const updated = {
      ...travelData,
      itinerary: (travelData.itinerary || []).filter((_, i) => i !== index),
    };
    updateAndSave(updated);
  };

  const handleAddReservation = () => {
    const fields = getReservationFields(reservationType);
    // required check: (간단히) 필드가 비어있지 않은지 확인
    const missing = fields.some((f) => {
      if (f === "메모") return false; // 메모는 선택
      const val = newReservation[f];
      return !val || String(val).trim() === "";
    });
    if (missing) {
      alert("예약의 필수 항목을 모두 입력해 주세요.");
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

  const handleRemoveReservation = (index) => {
    const updated = {
      ...travelData,
      reservations: (travelData.reservations || []).filter(
        (_, i) => i !== index
      ),
    };
    updateAndSave(updated);
  };

  // 로딩/없음 처리
  if (loading)
    return <div className="text-center p-8 text-gray-400">로딩 중...</div>;
  if (!plan)
    return (
      <div className="text-center p-8 text-gray-400">
        해당 여행 계획을 찾을 수 없습니다.
      </div>
    );

  // renderContent 함수: 탭별 렌더링 (getReservationFields/getInputType는 상단에서 정의됨)
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
            <p className="mb-6 text-lg">
              여행 기간:{" "}
              {plan.travelPeriod
                ? `${new Date(
                    plan.travelPeriod.startDate
                  ).toLocaleDateString()} ~ ${new Date(
                    plan.travelPeriod.endDate
                  ).toLocaleDateString()}`
                : "미정"}
            </p>
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
