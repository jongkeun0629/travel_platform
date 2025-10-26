import api from "./api";

const reservationService = {
  /**
   * 교통 예약 생성
   * @param {object} reservationData - 교통 예약 데이터
   */
  createTransportReservation: async (reservationData) => {
    const response = await api.post(
      "/api/reservations/transport",
      reservationData
    );
    return response.data;
  },

  /**
   * 숙소 예약 생성
   * @param {object} reservationData - 숙소 예약 데이터
   */
  createAccommodationReservation: async (reservationData) => {
    const response = await api.post(
      "/api/reservations/accommodation",
      reservationData
    );
    return response.data;
  },

  /**
   * 음식점 예약 생성
   * @param {object} reservationData - 음식점 예약 데이터
   */
  createRestaurantReservation: async (reservationData) => {
    const response = await api.post(
      "/api/reservations/restaurant",
      reservationData
    );
    return response.data;
  },

  /**
   * 상세 일정(planDetail)에 해당하는 예약 정보 조회
   * @param {number} planDetailId - 상세 일정 ID
   */
  getReservation: async (planDetailId) => {
    const response = await api.get(
      `/api/reservations/planDetail/${planDetailId}`
    );
    return response.data;
  },

  /**
   * 교통 예약 수정
   * @param {number} reservationId - 예약 ID
   * @param {object} reservationData - 수정할 교통 예약 데이터
   */
  updateTransportReservation: async (reservationId, reservationData) => {
    const response = await api.put(
      `/api/reservations/transport/${reservationId}`,
      reservationData
    );
    return response.data;
  },

  /**
   * 숙소 예약 수정
   * @param {number} reservationId - 예약 ID
   * @param {object} reservationData - 수정할 숙소 예약 데이터
   */
  updateAccommodationReservation: async (reservationId, reservationData) => {
    const response = await api.put(
      `/api/reservations/accommodation/${reservationId}`,
      reservationData
    );
    return response.data;
  },

  /**
   * 음식점 예약 수정
   * @param {number} reservationId - 예약 ID
   * @param {object} reservationData - 수정할 음식점 예약 데이터
   */
  updateRestaurantReservation: async (reservationId, reservationData) => {
    const response = await api.put(
      `/api/reservations/restaurant/${reservationId}`,
      reservationData
    );
    return response.data;
  },

  /**
   * 예약 삭제
   * @param {number} reservationId - 예약 ID
   */
  deleteReservation: async (reservationId) => {
    await api.delete(`/api/reservations/${reservationId}`);
  },
};

export default reservationService;
