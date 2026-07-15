// src/api/adminService.js

import axios from 'axios';

// 環境変数に指定されたAPI Base URL使用
// ローカル開発サーバー駆動中(import.meta.env.DEVがtrue)の時はCORS回避のために'/api/admin'プロキシパスを使用します。
const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev ? '/api/admin' : (import.meta.env.VITE_API_BASE_URL || '/api/admin');

// axiosインスタンス生成
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * 特定ステータスの店舗一覧を取得します。
 * @param {string} status - 取得するステータス (例: 'PENDING_REVIEW', 'APPROVED')。空の場合は全て取得。
 * @returns {Promise<Array>} 店舗一覧の配列
 */
export const getStoresByStatus = async (status = '') => {
  try {
    const response = await apiClient.get(`/stores?status=${status}`);

    // 1. response.dataが存在するかまず確認します。
    if (!response.data) {
      return [];
    }

    // 2. response.dataの中に'data'キーがあるか確認します。（二重ラップの場合）
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // 3. response.data自体が配列か確認します。（単一ラップの場合）
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // どちらでもない場合、予期しない形式なのでエラーを記録して空配列を返します。
    console.error("API response is not in the expected format:", response.data);
    return [];

  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

/**
 * 特定店舗のステータスを変更します（承認/拒否）。
 * @param {string} storeId - ステータスを変更する店舗のID
 * @param {string} newStatus - 新しいステータス ('APPROVED' または 'REJECTED')
 * @param {string} [comment] - 拒否時のコメント（任意）
 * @returns {Promise<object>} 更新された店舗ライセンス情報
 */
export const updateStoreStatus = async (storeId, newStatus, comment = '') => {
  try {
    const payload = {
      status: newStatus,
      comment: comment,
    };
    await apiClient.patch(`/stores/${storeId}/status`, payload);
    return true;
  } catch (error) {
    console.error('Error updating store status:', error);
    throw error;
  }
};

/**
 * 非公開の営業許可証画像への一時アクセスURLを取得します。
 * @param {string} imageKey - DBに保存された画像ファイルの一意なキー (例: 'uuid.jpg')
 * @returns {Promise<string>} 5分間有効な画像URL
 */
export const getLicenseImageUrl = async (imageKey) => {
  if (!imageKey) {
    return '';
  }
  try {
    const response = await apiClient.get(`/license-image-url?key=${imageKey}`);
    const url = response.data?.data?.url || response.data?.url || '';
    return url;
  } catch (error) {
    console.error('Error fetching license image URL:', error);
    return '';
  }
};

/**
 * エラー統計(カウント)を取得します。
 * @returns {Promise<object>}
 */
export const getErrorMetrics = async () => {
  try {
    const response = await apiClient.get('/metrics/errors');
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching error metrics:', error);
    throw error;
  }
};

/**
 * 詳細エラーログ一覧を取得します。
 * @returns {Promise<Array>}
 */
export const getErrorLogs = async () => {
  try {
    const response = await apiClient.get('/metrics/error-logs');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching error logs:', error);
    return [];
  }
};

/**
 * リクエスト統計(カウント)を取得します。
 * @returns {Promise<object>}
 */
export const getRequestMetrics = async () => {
  try {
    const response = await apiClient.get('/metrics/requests');
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching request metrics:', error);
    throw error;
  }
};

/**
 * 詳細リクエストログ一覧を取得します。
 * @returns {Promise<Array>}
 */
export const getRequestLogs = async () => {
  try {
    const response = await apiClient.get('/metrics/request-logs');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching request logs:', error);
    return [];
  }
};

/**
 * アクティブユーザーの統計情報を取得します。
 * @returns {Promise<object>}
 */
export const getActiveUserMetrics = async () => {
  try {
    const response = await apiClient.get('/metrics/active-users');
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching active user metrics:', error);
    throw error;
  }
};

/**
 * SSEブローカーのリアルタイム接続状況を取得します。
 * @returns {Promise<object>} SSEMetricsオブジェクト
 */
export const getSseMetrics = async () => {
  try {
    const response = await apiClient.get('/metrics/sse-status');
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching SSE metrics:', error);
    throw error;
  }
};