import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import KakaoMapModal from "../components/Map/KakaoMapModal";

const fetchTravelDetail = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: "2025 제주 여행",
        user: "홍길동",
        duration: "2025-10-23 ~ 2025-10-25",
        reservations: [],
        checklist: [
          "교통편",
          "숙소",
          "세안도구",
          "의류",
          "충전기",
          "보조배터리",
          "상비약",
        ],
        itinerary: [],
      });
    }, 500);
  });
};

// ✅ 필드명별 타입 자동 지정
const getInputType = (label) => {
  if (label.includes("날짜")) return "date";
  if (label.includes("시간")) return "time";
  if (label.includes("전화")) return "tel";
  if (label.includes("주소")) return "text"; // 주소는 카카오맵 검색으로 처리
  return "text";
};

export default function TravelDetail() {
  const { id } = useParams();
  const [travelData, setTravelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("info");

  const [newChecklist, setNewChecklist] = useState("");
  const [newPlan, setNewPlan] = useState({
    date: "",
    time: "",
    place: "",
    content: "",
  });

  const [reservationType, setReservationType] = useState("교통");
  const [newReservation, setNewReservation] = useState({});

  // 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [modalField, setModalField] = useState(""); // 주소 / 전화 선택

  // 예약 input 클릭 시 모달 열기
  const handleOpenModal = (field) => {
    setModalField(field);
    setModalOpen(true);
  };

  // 모달에서 선택 시
  const handleSelectPlace = ({ address, phone }) => {
    setNewReservation((prev) => ({
      ...prev,
      [modalField]: modalField.includes("주소") ? address : phone,
    }));
    setModalOpen(false);
  };

  useEffect(() => {
    const getData = async () => {
      const data = await fetchTravelDetail(id);
      setTravelData(data);
      setLoading(false);
    };
    getData();
  }, [id]);

  // ✅ 카카오맵 주소 검색
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

  // 체크리스트 추가/삭제
  const handleAddChecklist = () => {
    if (!newChecklist.trim()) return;
    setTravelData((prev) => ({
      ...prev,
      checklist: [...prev.checklist, newChecklist],
    }));
    setNewChecklist("");
  };
  const handleRemoveChecklist = (index) => {
    setTravelData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index),
    }));
  };

  // 일정 추가/삭제
  const handleAddPlan = () => {
    if (!newPlan.date || !newPlan.time || !newPlan.content) return;
    setTravelData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newPlan],
    }));
    setNewPlan({ date: "", time: "", place: "", content: "" });
  };
  const handleRemovePlan = (index) => {
    setTravelData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  // 예약 유형별 필드 자동 설정
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

  const handleAddReservation = () => {
    const fields = getReservationFields(reservationType);
    if (
      fields.some((f) => !newReservation[f] || newReservation[f].trim() === "")
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    setTravelData((prev) => ({
      ...prev,
      reservations: [
        ...prev.reservations,
        { type: reservationType, ...newReservation },
      ],
    }));
    setNewReservation({});
  };

  const handleRemoveReservation = (index) => {
    setTravelData((prev) => ({
      ...prev,
      reservations: prev.reservations.filter((_, i) => i !== index),
    }));
  };

  if (loading)
    return <div className="text-center p-8 text-gray-400">로딩 중...</div>;

  const renderContent = () => {
    switch (selectedMenu) {
      case "info":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4">🧭 여행 정보</h2>
            <p className="text-xl mb-2">제목: {travelData.title}</p>
            <p className="text-lg text-gray-400">
              작성자: {travelData.user} | 기간: {travelData.duration}
            </p>
          </div>
        );

      case "checklist":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4">📋 체크리스트</h2>
            <div className="mb-4 flex gap-2">
              <input
                className="bg-gray-800 border border-gray-700 p-2 rounded-lg text-lg w-full"
                value={newChecklist}
                onChange={(e) => setNewChecklist(e.target.value)}
                placeholder="항목 추가 (예: 보조배터리)"
              />
              <button
                onClick={handleAddChecklist}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-lg font-semibold"
              >
                +
              </button>
            </div>

            <ul>
              {travelData.checklist.map((item, index) => (
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

      case "itinerary":
        return (
          <div>
            <h2 className="text-3xl font-bold mb-10">🗓️ 일정 추가</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
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
                    className="bg-gray-800 border border-gray-700 p-2 rounded-lg w-full"
                  />
                  {/* <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600  cursor-pointer hover:bg-blue-700 px-3 py-2 rounded-lg text-white w-20"
                  >
                    검색
                  </button> */}
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

            <button
              onClick={handleAddPlan}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold mb-6"
            >
              일정 추가
            </button>

            {travelData.itinerary.map((p, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg mb-3 shadow-md flex justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <p className="font-semibold text-xl">
                    {p.date} {p.time}
                  </p>
                  <p>{p.content}</p>
                  {p.place && (
                    <button
                      onClick={() => openKakaoMap(p.place)}
                      className="text-blue-400 hover:underline"
                    >
                      📍 {p.place} (길찾기)
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleRemovePlan(index)}
                  className="text-red-400 hover:text-red-500 text-xl"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        );

      case "reservations":
        const fields = getReservationFields(reservationType);
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4">📑 예약 정보</h2>

            <div className="mb-3">
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

            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-gray-300 mb-3 text-lg font-medium">
                ✏️ {reservationType} 예약 정보를 입력하세요.
              </p>
              {fields.map((f) => {
                const type = getInputType(f);
                const isAddressOrPhone =
                  f.includes("주소") || f.includes("전화");
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
                      className="bg-gray-900 border border-gray-700 p-2 rounded-lg w-full hover:bg-gray-800"
                    />
                    {isAddressOrPhone && (
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

            <button
              onClick={handleAddReservation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold mb-6"
            >
              예약 추가
            </button>

            {travelData.reservations.map((res, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg mb-3 shadow-md hover:shadow-lg transition flex justify-between"
              >
                <div>
                  <p className="text-xl font-semibold mb-1">[{res.type}]</p>
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
                  onClick={() => handleRemoveReservation(index)}
                  className="text-red-400 hover:text-red-500 text-xl"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">{travelData.title}</h1>
        <Link to="/">
          <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-lg">
            홈으로
          </button>
        </Link>
      </div>

      {/* 상단 메뉴 */}
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

      {/* 선택한 메뉴 출력 */}
      {renderContent()}

      {/* 모달 출력 */}
      {modalOpen && (
        <KakaoMapModal
          fieldName={modalField}
          onSelect={handleSelectPlace}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
