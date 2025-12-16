// src/api/adminService.js

import axios from 'axios'; // axios를 사용합니다.

// 백엔드 API의 기본 URL
const API_BASE_URL = 'https://saboten-server.fly.dev/api/admin';

// axios 인스턴스를 생성하여 공통 설정을 적용합니다.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// TODO: 나중에 로그인 기능이 추가되면, 여기에 인터셉터를 사용하여
// 모든 요청에 자동으로 인증 토큰을 추가할 수 있습니다.
// apiClient.interceptors.request.use(config => { ... });

/**
 * 특정 상태의 가게 목록을 조회합니다.
 * @param {string} status - 조회할 상태 (예: 'PENDING_REVIEW', 'APPROVED'). 비어있으면 전체 조회.
 * @returns {Promise<Array>} 가게 목록 배열
 */
export const getStoresByStatus = async (status = '') => {
  try {
    const response = await apiClient.get(`/stores?status=${status}`);
    
    // ★★★ 여기가 수정된 부분입니다. ★★★
    // 1. response.data가 존재하는지 먼저 확인합니다.
    if (!response.data) {
      return [];
    }

    // 2. response.data 안에 'data' 키가 있는지 확인합니다. (이중 포장된 경우)
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // 3. response.data 자체가 배열인지 확인합니다. (단일 포장된 경우)
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // 두 경우 모두 아니면, 예상치 못한 형식이므로 에러를 기록하고 빈 배열을 반환합니다.
    console.error("API response is not in the expected format:", response.data);
    return [];

  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

/**
 * 특정 가게의 상태를 변경합니다 (승인/반려).
 * @param {string} storeId - 상태를 변경할 가게의 ID
 * @param {string} newStatus - 새로운 상태 ('APPROVED' 또는 'REJECTED')
 * @param {string} [comment] - 반려 시의 코멘트 (선택 사항)
 * @returns {Promise<object>} 업데이트된 가게 라이센스 정보
 */
export const updateStoreStatus = async (storeId, newStatus, comment = '') => {
  try {
    const payload = {
      status: newStatus,
      comment: comment,
    };
    await apiClient.patch(`/stores/${storeId}/status`, payload);
    return true; // 성공했다는 의미로 true를 반환
  } catch (error) {
    console.error('Error updating store status:', error);
    throw error;
  }
};

/**
 * 비공개 영업 허가증 이미지에 대한 임시 접근 URL을 가져옵니다.
 * @param {string} imageKey - DB에 저장된 이미지 파일의 고유 키 (예: 'uuid.jpg')
 * @returns {Promise<string>} 5분간 유효한 이미지 URL
 */
export const getLicenseImageUrl = async (imageKey) => {
  // imageKey가 비어있으면 요청을 보내지 않습니다.
  if (!imageKey) {
    return '';
  }
  
  try {
    const response = await apiClient.get(`/license-image-url?key=${imageKey}`);
    
    // 백엔드는 { "data": { "url": "..." } } 또는 { "url": "..." } 형태로 응답할 수 있습니다.
    const url = response.data?.data?.url || response.data?.url || '';
    return url;
  } catch (error) {
    console.error('Error fetching license image URL:', error);
    // 에러 발생 시 빈 문자열을 반환하여 이미지가 깨지는 것을 방지합니다.
    return ''; 
  }
};