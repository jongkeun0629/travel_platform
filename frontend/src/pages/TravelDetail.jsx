import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import KakaoMapModal from "../components/Map/KakaoMapModal";
import { FaRegEdit } from "react-icons/fa";
import { CreatePlanForm } from "./CreatePlan";
import itemService from "../services/item";
import useItemStore from "../store/itemStore";
import usePlanStore from "../store/planStore";
import reservationService from "../services/reservation";
import planDetailService from "../services/planDetail";

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
        "교통 수단",
        "출발지",
        "출발 시간",
        "도착지",
        "도착 시간",
        "좌석",
        "예약 번호",
        "메모",
      ];
    case "숙소":
      return [
        "숙소 이름",
        "주소",
        "체크인 날짜",
        "체크인 시간",
        "체크아웃 날짜",
        "체크아웃 시간",
        "전화 번호",
        "예약 번호",
        "메모",
      ];
    case "음식점":
      return [
        "식당 이름",
        "주소",
        "예약 날짜",
        "예약 시간",
        "전화 번호",
        "메모",
      ];
    default:
      return [];
  }
};

export default function TravelDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { createItem, getItem } = useItemStore();

  const [plan, setPlan] = useState(null);
  const [travelData, setTravelData] = useState({
    checklist: [], // ItemService
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

  // 수정용 modal (CreatePlanForm)
  const [editInfoOpen, setEditInfoOpen] = useState(false);

  // 일정/예약 편집 인덱스 및 임시 데이터
  const [editingItineraryIndex, setEditingItineraryIndex] = useState(null);
  const [editingItineraryData, setEditingItineraryData] = useState(null);
  const [editingReservationIndex, setEditingReservationIndex] = useState(null);
  const [editingReservationData, setEditingReservationData] = useState(null);

  const createPlan = usePlanStore((s) => s.createPlan);
  const updatePlan = usePlanStore((s) => s.updatePlan);
  const deletePlan = usePlanStore((s) => s.deletePlan);
  const getPlanById = usePlanStore((s) => s.getPlanById);

  // 예약 정보 출력
  const renderReservationInfo = (res) => {
    console.log("🔍 렌더링할 예약 데이터:", res); // ✅ 디버깅

    // 날짜만 출력 (YYYY-MM-DD)
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } catch (e) {
        return dateStr;
      }
    };

    // 시간만 출력 (HH:MM)
    const formatTime = (timeStr) => {
      if (!timeStr) return "";
      try {
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return timeStr;
        return date.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (e) {
        return timeStr;
      }
    };

    // ✅ 타입 체크 수정: 백엔드 응답에 맞춤
    const isTransport =
      res.type === "TransportReservation" || res.type === "교통";
    const isAccommodation =
      res.type === "AccommodationReservation" || res.type === "숙소";
    const isRestaurant =
      res.type === "RestaurantReservation" || res.type === "음식점";

    // 교통 예약
    if (isTransport) {
      const fields = [];

      if (res.name) fields.push({ label: "교통 수단", value: res.name });
      if (res.startLocation)
        fields.push({ label: "출발지", value: res.startLocation });
      if (res.endLocation)
        fields.push({ label: "도착지", value: res.endLocation });
      if (res.startTime)
        fields.push({ label: "출발 시간", value: formatTime(res.startTime) });
      if (res.endTime)
        fields.push({ label: "도착 시간", value: formatTime(res.endTime) });
      if (res.seat) fields.push({ label: "좌석", value: res.seat });
      if (res.reservationNo)
        fields.push({ label: "예약 번호", value: res.reservationNo });
      if (res.memo) fields.push({ label: "메모", value: res.memo });

      return (
        <div className="space-y-1">
          {fields.map((field, idx) => (
            <p key={idx} className="text-gray-300">
              <span className="font-semibold">{field.label}:</span>{" "}
              {field.value}
            </p>
          ))}
        </div>
      );
    }

    // 숙소 예약
    if (isAccommodation) {
      const fields = [];

      if (res.name) fields.push({ label: "숙소 이름", value: res.name });
      if (res.address) fields.push({ label: "주소", value: res.address });
      if (res.checkInDate)
        fields.push({
          label: "체크인 날짜",
          value: formatDate(res.checkInDate),
        });
      if (res.checkInTime)
        fields.push({
          label: "체크인 시간",
          value: formatTime(res.checkInTime),
        });
      if (res.checkOutDate)
        fields.push({
          label: "체크아웃 날짜",
          value: formatDate(res.checkOutDate),
        });
      if (res.checkOutTime)
        fields.push({
          label: "체크아웃 시간",
          value: formatTime(res.checkOutTime),
        });
      if (res.call) fields.push({ label: "전화번호", value: res.call });
      if (res.reservationNo)
        fields.push({ label: "예약 번호", value: res.reservationNo });
      if (res.memo) fields.push({ label: "메모", value: res.memo });

      return (
        <div className="space-y-1">
          {fields.map((field, idx) => (
            <p key={idx} className="text-gray-300">
              <span className="font-semibold">{field.label}:</span>{" "}
              {field.value}
            </p>
          ))}
        </div>
      );
    }

    // 음식점 예약
    if (isRestaurant) {
      const fields = [];

      if (res.name) fields.push({ label: "식당 이름", value: res.name });
      if (res.address) fields.push({ label: "주소", value: res.address });
      if (res.reservationDate)
        fields.push({
          label: "예약 날짜",
          value: formatDate(res.reservationDate),
        });
      if (res.reservationTime)
        fields.push({
          label: "예약 시간",
          value: formatTime(res.reservationTime),
        });
      if (res.call) fields.push({ label: "전화번호", value: res.call });
      if (res.reservationNo)
        fields.push({ label: "예약 번호", value: res.reservationNo });
      if (res.memo) fields.push({ label: "메모", value: res.memo });

      return (
        <div className="space-y-1">
          {fields.map((field, idx) => (
            <p key={idx} className="text-gray-300">
              <span className="font-semibold">{field.label}:</span>{" "}
              {field.value}
            </p>
          ))}
        </div>
      );
    }

    // 기타 (기본)
    return null;
  };

  /* ------------------------------
      서버 저장/업데이트 유틸 함수
  ------------------------------ */
  const saveToBackend = async (fullPlan) => {
    try {
      if (!fullPlan.id && !fullPlan.planId) {
        const created = await createPlan(fullPlan);
        setPlan(created);
        setTravelData(created.travelData || fullPlan.travelData || travelData);
        return created;
      } else {
        const planId = fullPlan.id ?? fullPlan.planId;
        const updated = await updatePlan(planId, fullPlan);
        setPlan(updated);
        setTravelData(updated.travelData || fullPlan.travelData || travelData);
        return updated;
      }
    } catch (err) {
      console.error("Backend save failed:", err);
      alert(
        "서버에 저장하는 데 실패했습니다. 네트워크 또는 서버 상태를 확인하세요."
      );
      throw err;
    }
  };

  const updateAndSave = async (updatedTravelData) => {
    const updatedPlan = {
      ...(plan || {}),
      id: plan?.id ?? id,
      travelData: updatedTravelData,
    };
    setPlan(updatedPlan);
    setTravelData(updatedTravelData);
    await saveToBackend(updatedPlan);
  };

  // 여행 기본 정보 수정 핸들러 (CreatePlanForm의 onSave)
  const handleUpdateInfo = async (updated) => {
    const merged = { ...(plan || {}), ...updated };
    setPlan(merged);
    if (updated.travelData) setTravelData(updated.travelData);
    try {
      await saveToBackend(merged);
      setEditInfoOpen(false);
      alert("기본 정보가 저장되었습니다.");
    } catch (err) {}
  };

  /* ------------------------------
      유틸: 날짜+시간 합치기, payload 매핑 등
      백엔드 DTO/엔티티 구조에 맞춘 매핑/정규화 로직 추가
  ------------------------------ */
  // YYYY-MM-DD + HH:mm -> ISO string (no timezone)
  const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr && !timeStr) return null;
    const date = dateStr || new Date().toISOString().slice(0, 10);
    const time = timeStr || "00:00";
    // return ISO-like string acceptable by backend (LocalDateTime)
    return `${date}T${time}:00`;
  };

  //UI 입력(한글 라벨) -> 백엔드 DTO 필드 매핑
  const mapReservationPayload = (
    type,
    newRes,
    planDetailId,
    planDetailTripday
  ) => {
    const fallbackDate =
      newRes["예약 날짜"] ||
      newRes["예약날짜"] ||
      planDetailTripday ||
      new Date().toISOString().slice(0, 10);

    //  PlaceRequest 객체 생성
    const extractPlace = (reservationData) => {
      // 주소나 전화번호가 있으면 PlaceRequest로 구성
      if (
        reservationData["주소"] ||
        reservationData["전화 번호"] ||
        reservationData["전화"] ||
        reservationData.address ||
        reservationData.call
      ) {
        return {
          placeName:
            reservationData["숙소 이름"] ||
            reservationData["식당 이름"] ||
            reservationData["출발지"] ||
            reservationData["도착지"] ||
            null,
          address: reservationData["주소"] || reservationData.address || null,
          call:
            reservationData["전화 번호"] ||
            reservationData["전화"] ||
            reservationData.call ||
            null,
          classification: null,
          kakaoPlaceId: null,
        };
      }
      return null;
    };

    const basePayload = {
      planDetailId: Number(planDetailId),
      place: extractPlace(newRes),
    };

    if (type === "교통") {
      return {
        ...basePayload,
        name: newRes["교통 수단"] || newRes.name || null,
        startLocation: newRes["출발지"] || null,
        endLocation: newRes["도착지"] || null,
        startTime: combineDateTime(fallbackDate, newRes["출발 시간"]),
        endTime: combineDateTime(fallbackDate, newRes["도착 시간"]),
        seat: newRes["좌석"] || null,
        reservationNo: newRes["예약 번호"] || newRes["예약번호"] || null,
        memo: newRes["메모"] || null,
      };
    }

    if (type === "숙소") {
      return {
        ...basePayload,
        name: newRes["숙소 이름"] || newRes.name || null,
        address: newRes["주소"] || null,
        checkInDate: combineDateTime(
          newRes["체크인 날짜"] || fallbackDate,
          "00:00"
        ),
        checkInTime: combineDateTime(
          newRes["체크인 날짜"] || fallbackDate,
          newRes["체크인 시간"] || "00:00"
        ),
        checkOutDate: combineDateTime(
          newRes["체크아웃 날짜"] || fallbackDate,
          "00:00"
        ),
        checkOutTime: combineDateTime(
          newRes["체크아웃 날짜"] || fallbackDate,
          newRes["체크아웃 시간"] || "00:00"
        ),
        call: newRes["전화 번호"] || newRes["전화"] || null,
        reservationNo: newRes["예약 번호"] || null,
        memo: newRes["메모"] || null,
      };
    }

    if (type === "음식점") {
      return {
        ...basePayload,
        name: newRes["식당 이름"] || newRes.name || null,
        address: newRes["주소"] || null,
        reservationDate: combineDateTime(
          newRes["예약 날짜"] || fallbackDate,
          "00:00"
        ),
        reservationTime: combineDateTime(
          newRes["예약 날짜"] || fallbackDate,
          newRes["예약 시간"] || "00:00"
        ),
        call: newRes["전화 번호"] || newRes["전화"] || null,
        reservationNo: newRes["예약 번호"] || null,
        memo: newRes["메모"] || null,
      };
    }

    return { ...basePayload, ...newRes };
  };

  // PlanDetailResponse 또는 기존 UI 일정 객체를 화면용 객체로 정규화
  const normalizePlanDetailToItineraryItem = (detail) => {
    try {
      const details = detail.details ? JSON.parse(detail.details) : null;

      // ✅ placeholder 체크
      if (details && details.note === "reservation placeholder") {
        return null; // placeholder는 반환하지 않음
      }

      return {
        id: detail.id,
        date: detail.tripday || (details && details.date) || "",
        time: (details && details.time) || "",
        place: (details && details.place) || "",
        content: (details && details.content) || detail.reserveInfo || "",
        raw: detail,
      };
    } catch (e) {
      // placeholder 체크
      if (
        detail.details &&
        detail.details.includes("reservation placeholder")
      ) {
        return null;
      }

      return {
        id: detail.id,
        date: detail.tripday || "",
        time: "",
        place: "",
        content: detail.details || "",
        raw: detail,
      };
    }
  };

  /* ------------------------------
      초기 로드
  ------------------------------ */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const fetched = await getPlanById(id);
        if (!fetched) {
          setPlan(null);
          alert("해당 여행 계획을 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        const planId = fetched.planId ?? fetched.id;

        // 병렬로 체크리스트와 PlanDetails 로드
        const [checklistResponse, planDetailsResponse] =
          await Promise.allSettled([
            itemService.getItem(planId),
            planDetailService.getPlanDetail(planId),
          ]);

        // 체크리스트 처리
        let checklistData = [];
        if (
          checklistResponse.status === "fulfilled" &&
          Array.isArray(checklistResponse.value)
        ) {
          checklistData = checklistResponse.value.map((it) => {
            if (typeof it === "string") {
              return { name: it, checked: false, id: null };
            } else {
              return {
                id: it.id,
                name: it.text || it.name || it.checklistName || "",
                checked: it.checked ?? it.isChecked ?? false, // ✅ checked 또는 isChecked 모두 확인
              };
            }
          });
        }

        // PlanDetails 처리
        let itineraryData = [];
        if (
          planDetailsResponse.status === "fulfilled" &&
          Array.isArray(planDetailsResponse.value)
        ) {
          itineraryData = planDetailsResponse.value
            .map((detail) => normalizePlanDetailToItineraryItem(detail))
            .filter((item) => item !== null);
        }

        // Reservations 로드 - 각 planDetail에 대한 예약 가져오기
        let allReservations = [];
        if (
          planDetailsResponse.status === "fulfilled" &&
          Array.isArray(planDetailsResponse.value)
        ) {
          const planDetailsWithIds = planDetailsResponse.value.filter(
            (detail) => detail.id
          );

          const reservationPromises = planDetailsWithIds.map((detail) =>
            reservationService
              .getReservation(detail.id)
              .then((reservations) => {
                console.log(
                  `✅ PlanDetail ${detail.id} 예약 데이터:`,
                  reservations
                ); // ✅ 디버깅
                return Array.isArray(reservations) ? reservations : [];
              })
              .catch((err) => {
                console.error(
                  `❌ PlanDetail ${detail.id} 예약 조회 실패:`,
                  err
                );
                return [];
              })
          );

          const reservationResults = await Promise.all(reservationPromises);
          allReservations = reservationResults.flat();
          console.log("✅ 총 예약 데이터:", allReservations);
        }

        // 최종 데이터 설정
        setPlan(fetched);
        setTravelData({
          checklist: checklistData,
          itinerary: itineraryData,
          reservations: allReservations,
        });
      } catch (err) {
        console.error("Failed to fetch plan from backend:", err);
        alert(
          "서버에서 여행 계획을 불러오는 데 실패했습니다. 네트워크 또는 서버 상태를 확인하세요."
        );
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, location.state, getPlanById]);

  /* ------------------------------
      모달(카카오맵) 관련
  ------------------------------ */
  const handleOpenModal = (field) => {
    setModalField(field);
    setModalOpen(true);
  };

  const handleSelectPlace = ({ address, phone, place_name }) => {
    if (modalField === "place") {
      // place를 문자열이 아니라 PlaceRequest에 맞춘 객체로 저장
      setNewPlan((prev) => ({
        ...prev,
        place: {
          placeName: place_name,
          address: address || null,
          call: phone || null,
          classification: null,
          kakaoPlaceId: null,
        },
      }));
    } else {
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

  /* ------------------------------
      체크리스트 핸들러
  ------------------------------ */
  const handleAddChecklist = async () => {
    if (!newChecklist.trim()) return;
    try {
      const planId = plan?.planId ?? plan?.id ?? id;
      const createdItem = await itemService.createItem(planId, {
        name: newChecklist.trim(), // text -> name으로 변경
      });
      // service가 반환한 필드명에 맞춰 정규화 (name/checked/id)
      const itemForUi = {
        id: createdItem.id ?? createdItem.itemId ?? null,
        name: createdItem.name ?? newChecklist.trim(),
        checked: createdItem.checked ?? false,
      };
      setTravelData((prev) => ({
        ...prev,
        checklist: [...(prev.checklist || []), itemForUi],
      }));
      setNewChecklist("");
    } catch (err) {
      console.error("Failed to add checklist item:", err);
      alert("체크리스트 항목을 서버에 저장하지 못했습니다.");
    }
  };

  const handleRemoveChecklist = async (i) => {
    try {
      const item = travelData.checklist[i];
      const planId = plan?.planId ?? plan?.id ?? id;
      if (item?.id) {
        await itemService.deleteItem(planId, item.id);
      }
      setTravelData((prev) => ({
        ...prev,
        checklist: prev.checklist.filter((_, idx) => idx !== i),
      }));
    } catch (err) {
      console.error("Failed to remove checklist item:", err);
      alert("체크리스트 항목을 삭제하지 못했습니다.");
    }
  };

  const handleToggleChecklist = async (i) => {
    try {
      const planId = plan?.planId ?? plan?.id ?? id;
      const item = travelData.checklist[i];

      if (item?.id) {
        // 서버에서 토글하고 업데이트된 상태 받기
        const updated = await itemService.updateItem(planId, item.id);

        // 응답 데이터를 UI 형식으로 정규화
        const uiUpdated = {
          id: updated.id ?? item.id,
          name: updated.name ?? item.name,
          checked: updated.checked ?? !item.checked,
        };

        // UI 상태 업데이트
        setTravelData((prev) => ({
          ...prev,
          checklist: prev.checklist.map((it, idx) =>
            idx === i ? uiUpdated : it
          ),
        }));
      } else {
        // ID가 없는 경우 새로 생성
        const created = await itemService.createItem(planId, {
          name: item.name, // text -> name으로 변경
        }); // checked는 제거 (기본값이 false이므로)

        const uiCreated = {
          id: created.id ?? null,
          name: created.name ?? item.name,
          checked: created.checked ?? false, // 서버에서 받은 checked 사용
        };

        setTravelData((prev) => ({
          ...prev,
          checklist: prev.checklist.map((it, idx) =>
            idx === i ? uiCreated : it
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to toggle checklist item:", err);
      alert("체크리스트 상태를 저장하지 못했습니다.");
    }
  };

  /* ------------------------------
      일정 핸들러 (planDetail 연동)
      planDetailService 사용, returned PlanDetailResponse -> UI 포맷으로 변환
  ------------------------------ */
  const handleAddPlan = async () => {
    if (!newPlan.date || !newPlan.time || !newPlan.content) {
      alert("날짜, 시간, 내용을 모두 입력하세요.");
      return;
    }

    try {
      const planId = plan?.planId ?? plan?.id ?? id;

      // placeId 없으면 PlaceRequest 형태의 place 필드 제공 (백엔드 요구)
      const placePayload =
        newPlan.place && typeof newPlan.place === "object"
          ? {
              placeName: newPlan.place.placeName || "장소명 없음",
              address: newPlan.place.address || "",
              call: newPlan.place.call || null,
              classification: newPlan.place.classification || null,
              kakaoPlaceId: newPlan.place.kakaoPlaceId || null,
            }
          : newPlan.place
          ? {
              placeName: String(newPlan.place),
              address: "",
            }
          : null;

      const payload = {
        planId: Number(planId),
        placeId: null,
        tripday: newPlan.date,
        reserveInfo: null,
        placeType: null,
        place: placePayload, // PlaceRequest 형태로 전송
        details: JSON.stringify({
          time: newPlan.time,
          place:
            typeof newPlan.place === "object"
              ? newPlan.place.placeName
              : newPlan.place,
          content: newPlan.content,
        }),
      };

      const createdPlanDetail = await planDetailService.createPlanDetail(
        payload
      );

      const itineraryItem =
        normalizePlanDetailToItineraryItem(createdPlanDetail);

      const updated = {
        ...travelData,
        itinerary: [...(travelData.itinerary || []), itineraryItem],
      };

      await updateAndSave(updated);

      setNewPlan({ date: "", time: "", place: "", content: "" });
    } catch (err) {
      console.error("Failed to create planDetail:", err);
      alert("상세 일정을 서버에 저장하지 못했습니다.");
    }
  };

  const handleRemovePlan = async (i) => {
    // 서버에서 planDetail 삭제 엔드포인트 호출 가능 -> 여기선 기존 방식 유지 (plan.travelData 업데이트)
    const item = travelData.itinerary[i];
    try {
      if (item?.id) {
        await planDetailService.deletePlanDetail(item.id);
      }
    } catch (err) {
      console.warn("Failed to delete planDetail on server:", err);
    }
    const updated = {
      ...travelData,
      itinerary: travelData.itinerary.filter((_, idx) => idx !== i),
    };
    try {
      await updateAndSave(updated);
    } catch (err) {}
  };

  const startEditItinerary = (i) => {
    setEditingItineraryIndex(i);
    setEditingItineraryData(travelData.itinerary[i]);
    setSelectedMenu("itinerary");
  };

  const saveEditItinerary = async () => {
    if (editingItineraryIndex === null) return;
    const item = editingItineraryData;

    try {
      if (item?.id) {
        const pdPayload = {
          planId: Number(plan?.planId ?? plan?.id ?? id),
          placeId: item.raw?.place?.id || null, // ✅ place 객체에서 id 추출
          place: null, // ✅ place 객체 전체 전송 필요 없음
          tripday: item.date,
          reserveInfo: item.raw?.reserveInfo ?? null,
          placeType: item.raw?.placeType ?? null,
          details: JSON.stringify({
            time: item.time,
            place: item.place,
            content: item.content,
          }),
        };

        const updatedDetail = await planDetailService.updatePlanDetail(
          item.id,
          pdPayload
        );

        // ✅ 서버에서 받은 데이터로 UI 업데이트
        const updatedItineraryItem =
          normalizePlanDetailToItineraryItem(updatedDetail);

        const updatedItinerary = travelData.itinerary.map((it, idx) =>
          idx === editingItineraryIndex ? updatedItineraryItem : it
        );
        const updated = { ...travelData, itinerary: updatedItinerary };

        setTravelData(updated);

        setEditingItineraryIndex(null);
        setEditingItineraryData(null);
      }
    } catch (err) {
      console.error("Failed to save edited itinerary:", err);
      console.error("Error details:", err.response?.data || err);
      alert(
        "일정 수정 저장에 실패했습니다: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  /* ------------------------------
      예약 핸들러 (reservation 연동)
      PlanDetail 필요성 처리, payload 매핑, reservationService 호출
  ------------------------------ */
  const handleAddReservation = async () => {
    const fields = getReservationFields(reservationType);
    const missing = fields.some(
      (f) =>
        f !== "메모" &&
        (!newReservation[f] || newReservation[f].toString().trim() === "")
    );
    if (missing) {
      alert("필수 항목을 모두 입력하세요.");
      return;
    }

    try {
      const planId = plan?.planId ?? plan?.id ?? id;

      // 1) planDetailId 확보: 사용자가 특정 planDetail을 지정하지 않으면 새로 생성
      let planDetailId = newReservation.planDetailId ?? null;
      let planDetailTripday = null;
      if (!planDetailId) {
        const placeObj =
          newReservation["주소"] ||
          newReservation.address ||
          newReservation["식당 이름"] ||
          newReservation["숙소 이름"] ||
          newReservation["출발지"] ||
          newReservation["도착지"]
            ? {
                placeName:
                  newReservation["식당 이름"] ||
                  newReservation["숙소 이름"] ||
                  newReservation["출발지"] ||
                  newReservation["도착지"] ||
                  null,
                address:
                  newReservation["주소"] || newReservation.address || null,
                call:
                  newReservation["전화 번호"] || newReservation["전화"] || null,
                classification: null,
                kakaoPlaceId: null,
              }
            : null;

        const placeholder = {
          planId: Number(planId),
          placeId: null,
          place: placeObj, // PlaceRequest 형태로 전송
          tripday:
            newReservation["예약 날짜"] ||
            newReservation["예약날짜"] ||
            newReservation.tripday ||
            "",
          reserveInfo: null,
          placeType: null,
          details: JSON.stringify({ note: "reservation placeholder" }),
        };
        const createdPlanDetail = await planDetailService.createPlanDetail(
          placeholder
        );
        planDetailId = createdPlanDetail.id ?? createdPlanDetail.planDetailId;
        planDetailTripday = createdPlanDetail.tripday || null;
      }

      // 2) payload 매핑
      const payload = mapReservationPayload(
        reservationType,
        newReservation,
        planDetailId,
        planDetailTripday
      );

      // 3) 타입별 API 호출
      let createdReservation = null;
      if (reservationType === "교통") {
        createdReservation =
          await reservationService.createTransportReservation(payload);
      } else if (reservationType === "숙소") {
        createdReservation =
          await reservationService.createAccommodationReservation(payload);
      } else if (reservationType === "음식점") {
        createdReservation =
          await reservationService.createRestaurantReservation(payload);
      } else {
        createdReservation = payload;
      }

      // 4) UI용 저장: 서버응답을 그대로 reservations 배열에 추가 (정규화 필요시 추가 변환)
      const updated = {
        ...travelData,
        reservations: [...(travelData.reservations || []), createdReservation],
      };
      await updateAndSave(updated);

      setNewReservation({});
    } catch (err) {
      console.error("Failed to add reservation:", err);
      alert("예약 정보를 서버에 저장하지 못했습니다.");
    }
  };

  const handleRemoveReservation = async (i) => {
    const res = travelData.reservations[i];
    try {
      if (res?.id) {
        await reservationService.deleteReservation(res.id);
      }
    } catch (err) {
      console.warn("Failed to delete reservation on server:", err);
    }
    const updated = {
      ...travelData,
      reservations: travelData.reservations.filter((_, idx) => idx !== i),
    };
    try {
      await updateAndSave(updated);
    } catch (err) {}
  };

  const startEditReservation = (i) => {
    const reservation = travelData.reservations[i];

    // 예약 타입 설정
    if (
      reservation.type === "TransportReservation" ||
      reservation.type === "교통"
    ) {
      setReservationType("교통");
    } else if (
      reservation.type === "AccommodationReservation" ||
      reservation.type === "숙소"
    ) {
      setReservationType("숙소");
    } else if (
      reservation.type === "RestaurantReservation" ||
      reservation.type === "음식점"
    ) {
      setReservationType("음식점");
    }

    // 백엔드 응답을 UI 입력 폼 형식으로 변환
    let convertedData = {};

    if (reservation.type === "TransportReservation") {
      convertedData = {
        "교통 수단": reservation.name || "",
        출발지: reservation.startLocation || "",
        도착지: reservation.endLocation || "",
        "출발 시간": reservation.startTime
          ? new Date(reservation.startTime).toTimeString().slice(0, 5)
          : "",
        "도착 시간": reservation.endTime
          ? new Date(reservation.endTime).toTimeString().slice(0, 5)
          : "",
        좌석: reservation.seat || "",
        "예약 번호": reservation.reservationNo || "",
        메모: reservation.memo || "",
      };
    } else if (reservation.type === "AccommodationReservation") {
      convertedData = {
        "숙소 이름": reservation.name || "",
        주소: reservation.address || "",
        "체크인 날짜": reservation.checkInDate
          ? reservation.checkInDate.slice(0, 10)
          : "",
        "체크인 시간": reservation.checkInTime
          ? new Date(reservation.checkInTime).toTimeString().slice(0, 5)
          : "",
        "체크아웃 날짜": reservation.checkOutDate
          ? reservation.checkOutDate.slice(0, 10)
          : "",
        "체크아웃 시간": reservation.checkOutTime
          ? new Date(reservation.checkOutTime).toTimeString().slice(0, 5)
          : "",
        "전화 번호": reservation.call || "",
        "예약 번호": reservation.reservationNo || "",
        메모: reservation.memo || "",
      };
    } else if (reservation.type === "RestaurantReservation") {
      convertedData = {
        "식당 이름": reservation.name || "",
        주소: reservation.address || "",
        "예약 날짜": reservation.reservationDate
          ? reservation.reservationDate.slice(0, 10)
          : "",
        "예약 시간": reservation.reservationTime
          ? new Date(reservation.reservationTime).toTimeString().slice(0, 5)
          : "",
        "전화 번호": reservation.call || "",
        "예약 번호": reservation.reservationNo || "",
        메모: reservation.memo || "",
      };
    }

    setEditingReservationIndex(i);
    setEditingReservationData(reservation); // 원본 예약 데이터도 저장
    setNewReservation(convertedData); // UI 입력 필드에 로드
    setSelectedMenu("reservations");
  };

  const saveEditReservation = async () => {
    if (editingReservationIndex === null) return;
    const editedReservation = travelData.reservations[editingReservationIndex];

    try {
      if (editedReservation?.id) {
        // UI 입력 데이터를 백엔드 DTO 형식으로 변환
        const updatedPayload = mapReservationPayload(
          reservationType,
          newReservation,
          editedReservation.planDetailId,
          editedReservation.tripday || null
        );

        // 타입별 update endpoints 호출
        let updatedReservation = null;

        if (
          reservationType === "교통" ||
          editedReservation.type === "TransportReservation"
        ) {
          updatedReservation =
            await reservationService.updateTransportReservation(
              editedReservation.id,
              updatedPayload
            );
        } else if (
          reservationType === "숙소" ||
          editedReservation.type === "AccommodationReservation"
        ) {
          updatedReservation =
            await reservationService.updateAccommodationReservation(
              editedReservation.id,
              updatedPayload
            );
        } else if (
          reservationType === "음식점" ||
          editedReservation.type === "RestaurantReservation"
        ) {
          updatedReservation =
            await reservationService.updateRestaurantReservation(
              editedReservation.id,
              updatedPayload
            );
        }

        // UI 업데이트
        const updatedReservations = travelData.reservations.map((it, idx) =>
          idx === editingReservationIndex ? updatedReservation : it
        );

        setTravelData({
          ...travelData,
          reservations: updatedReservations,
        });

        // 상태 초기화
        setEditingReservationIndex(null);
        setEditingReservationData(null);
        setNewReservation({});

        alert("예약 정보가 수정되었습니다.");
      }
    } catch (err) {
      console.error("Failed to save edited reservation:", err);
      alert("예약 수정 저장에 실패했습니다.");
    }
  };

  const saveToServer = async () => {
    if (!plan) {
      alert("저장할 계획이 없습니다.");
      return;
    }
    try {
      const payload = { ...plan, travelData };
      await saveToBackend(payload);
      alert("저장되었습니다.");
    } catch (err) {}
  };

  const handleDeletePlan = async () => {
    if (!confirm("정말로 이 여행 계획을 삭제하시겠습니까?")) return;
    try {
      const planId = plan?.planId ?? plan?.id ?? id;
      if (planId) {
        await deletePlan(planId);
        navigate("/", { replace: true });
      } else {
        console.log(plan);
        alert("삭제할 계획 ID가 없습니다.");
      }
    } catch (err) {
      console.error("Failed to delete plan:", err);
      alert("서버에서 삭제하는 데 실패했습니다.");
    }
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
              작성자: {plan.user?.username || "알 수 없음"}
            </p>
            <p className="mb-2 text-lg">여행 도시: {plan.destination}</p>
            <p className="mb-2 text-lg">
              여행 기간: {new Date(plan.startDate).toLocaleDateString()} ~{" "}
              {new Date(plan.endDate).toLocaleDateString()}
            </p>
            <p className="mb-2 text-lg">여행 타입: {plan.type}</p>
            <p className="mb-2 text-lg">공개 여부: {plan.visibility}</p>

            <button
              onClick={() => setEditInfoOpen(true)}
              className="bg-gray-800 hover:bg-gray-700 mt-4 px-4 py-2 rounded-lg text-lg"
            >
              수정
            </button>

            {editInfoOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
                <div className="w-full max-w-3xl bg-gray-900 rounded-lg overflow-auto max-h-[90vh]">
                  <CreatePlanForm
                    initialData={plan}
                    onCancel={() => setEditInfoOpen(false)}
                    onSave={(updated) => handleUpdateInfo(updated)}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case "checklist": {
        const checklistItems =
          travelData.checklist && travelData.checklist.length
            ? travelData.checklist
            : [];
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
                  key={item.id ?? index}
                  className="flex justify-between items-center bg-gray-800 p-3 mb-2 rounded-lg shadow-md text-lg"
                >
                  <div className="flex items-center gap-5">
                    <input
                      type="checkbox"
                      checked={!!item.checked}
                      onChange={() => handleToggleChecklist(index)}
                      className="w-5 h-5"
                    />
                    <span
                      className={`${
                        item.checked ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
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
                  value={
                    editingItineraryIndex !== null
                      ? editingItineraryData?.date || ""
                      : newPlan.date
                  }
                  onChange={(e) =>
                    editingItineraryIndex !== null
                      ? setEditingItineraryData({
                          ...editingItineraryData,
                          date: e.target.value,
                        })
                      : setNewPlan({ ...newPlan, date: e.target.value })
                  }
                  className="bg-gray-800 border border-gray-700 p-2 rounded-lg w-full"
                />
              </div>

              <div>
                <p className="text-gray-300 mb-4">🕒 시간을 선택하세요</p>
                <input
                  type="time"
                  value={
                    editingItineraryIndex !== null
                      ? editingItineraryData?.time || ""
                      : newPlan.time
                  }
                  onChange={(e) =>
                    editingItineraryIndex !== null
                      ? setEditingItineraryData({
                          ...editingItineraryData,
                          time: e.target.value,
                        })
                      : setNewPlan({ ...newPlan, time: e.target.value })
                  }
                  className="bg-gray-800 border border-gray-700 p-2 rounded-lg w-full"
                />
              </div>

              <div>
                <p className="text-gray-300 mb-4">📍 장소를 입력하세요</p>
                <div className="flex">
                  <input
                    placeholder="장소"
                    value={
                      editingItineraryIndex !== null
                        ? editingItineraryData?.place || ""
                        : // newPlan.place가 객체일 수 있으므로 placeName 또는 문자열 사용
                          (typeof newPlan.place === "string"
                            ? newPlan.place
                            : newPlan.place?.placeName) || ""
                    }
                    onChange={(e) =>
                      editingItineraryIndex !== null
                        ? setEditingItineraryData({
                            ...editingItineraryData,
                            place: e.target.value,
                          })
                        : setNewPlan({ ...newPlan, place: e.target.value })
                    }
                    className="bg-gray-800 border border-gray-700 p-2 rounded-lg w-full mr-2"
                  />
                  <button
                    onClick={() => handleOpenModal("place")}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-3 py-2 rounded-lg text-white w-20"
                  >
                    검색
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-300 mb-4">✏️ 내용을 작성하세요</p>
                <input
                  placeholder="내용"
                  value={
                    editingItineraryIndex !== null
                      ? editingItineraryData?.content || ""
                      : newPlan.content
                  }
                  onChange={(e) =>
                    editingItineraryIndex !== null
                      ? setEditingItineraryData({
                          ...editingItineraryData,
                          content: e.target.value,
                        })
                      : setNewPlan({ ...newPlan, content: e.target.value })
                  }
                  className="bg-gray-800 border border-gray-700 p-2 rounded-lg w-full"
                />
              </div>
            </div>

            <div className="flex justify-center mb-8">
              {editingItineraryIndex !== null ? (
                <>
                  <button
                    onClick={saveEditItinerary}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-lg font-semibold mr-3"
                  >
                    수정 저장
                  </button>
                  <button
                    onClick={() => {
                      setEditingItineraryIndex(null);
                      setEditingItineraryData(null);
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-lg font-semibold"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddPlan}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold"
                >
                  일정 추가
                </button>
              )}
            </div>

            {(travelData.itinerary || []).length === 0 ? (
              <p className="text-gray-400 text-center">아직 일정이 없습니다.</p>
            ) : (
              (travelData.itinerary || []).map((p, idx) => (
                <div
                  key={p.id ?? idx}
                  className="bg-gray-800 p-4 rounded-lg mb-3 shadow-md flex justify-between items-center hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-semibold text-xl mb-2">
                      {p.date} {p.time}
                    </p>
                    {p.place && (
                      <button
                        onClick={() => openKakaoMap(p.place)}
                        className="text-blue-400 hover:underline mb-2 text-xl"
                      >
                        📍 {p.place}
                      </button>
                    )}
                    <p>{p.content}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => startEditItinerary(idx)}
                      className="mr-5 text-xl"
                    >
                      <FaRegEdit />
                    </button>
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
                  ["출발지", "도착지", "숙소 이름", "식당 이름"].includes(f);
                const currentValue =
                  editingReservationIndex !== null
                    ? newReservation[f] || ""
                    : newReservation[f] || "";

                return (
                  <div key={f} className="flex gap-2 mb-2">
                    <input
                      type={type}
                      placeholder={f}
                      value={currentValue}
                      onChange={(e) => {
                        // ✅ 항상 newReservation을 업데이트
                        setNewReservation({
                          ...newReservation,
                          [f]: e.target.value,
                        });
                      }}
                      className="bg-gray-900 border border-gray-700 p-2 rounded-lg w-full"
                    />
                    {isSearchable && (
                      <button
                        onClick={() => handleOpenModal(f)}
                        className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-3 py-2 rounded-lg text-white w-20"
                      >
                        검색
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mb-8">
              {editingReservationIndex !== null ? (
                <>
                  <button
                    onClick={saveEditReservation}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-lg font-semibold mr-3"
                  >
                    수정 저장
                  </button>
                  <button
                    onClick={() => {
                      setEditingReservationIndex(null);
                      setEditingReservationData(null);
                      setNewReservation({});
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-lg font-semibold"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddReservation}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold"
                >
                  예약 추가
                </button>
              )}
            </div>

            {(travelData.reservations || []).length === 0 ? (
              <p className="text-gray-400 text-center">
                등록된 예약이 없습니다.
              </p>
            ) : (
              (travelData.reservations || []).map((res, idx) => {
                console.log(`🎫 예약 ${idx} 렌더링:`, res); // ✅ 디버깅
                return (
                  <div
                    key={res.id ?? idx}
                    className="bg-gray-800 p-4 rounded-lg mb-3 shadow-md flex justify-between hover:shadow-lg transition"
                  >
                    <div className="w-full">
                      <p className="text-xl font-semibold mb-2 text-blue-400">
                        {res.type === "TransportReservation" ||
                        res.type === "교통"
                          ? "🚌 교통 예약"
                          : ""}
                        {res.type === "AccommodationReservation" ||
                        res.type === "숙소"
                          ? "🛏️ 숙소 예약"
                          : ""}
                        {res.type === "RestaurantReservation" ||
                        res.type === "음식점"
                          ? "🍽️ 음식점 예약"
                          : ""}
                        {!res.type && "📑 예약 정보"}
                      </p>
                      {renderReservationInfo(res)}
                    </div>
                    <div className="flex items-center ml-4">
                      <button
                        onClick={() => startEditReservation(idx)}
                        className="mr-5 text-xl text-blue-400 hover:text-blue-300"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => handleRemoveReservation(idx)}
                        className="text-red-400 hover:text-red-500 text-xl"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">{plan.title}</h1>
        <div className="flex gap-2">
          <Link to="/">
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-lg">
              홈으로
            </button>
          </Link>
          <button
            onClick={handleDeletePlan}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-lg"
          >
            삭제
          </button>
        </div>
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
