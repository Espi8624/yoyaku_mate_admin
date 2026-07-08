// src/api/adminService.js

import axios from 'axios';

// 環境ごとのAPIベースURL
// ローカル開発時はViteプロキシ経由でCORSを回避する
const isDev = import.meta.env.DEV;

export const ENV_URLS = {
  dev: isDev ? '/proxy-dev' : `${import.meta.env.VITE_PROXY_DEV_TARGET}/api/admin`,
  prod: isDev ? '/proxy-prod' : `${import.meta.env.VITE_PROXY_PROD_TARGET}/api/admin`,
};

// 環境に応じたaxiosインスタンスを生成する関数
const createApiClient = (environment) => {
  return axios.create({
    baseURL: ENV_URLS[environment] || ENV_URLS.dev,
  });
};

/**
 * 特定ステータスの店舗一覧を取得します。
 * @param {string} status - 取得するステータス (例: 'PENDING_REVIEW', 'APPROVED')。空の場合は全て取得。
 * @param {string} environment - 使用する環境 ('dev' または 'prod')
 * @returns {Promise<Array>} 店舗一覧の配列
 */
export const getStoresByStatus = async (status = '', environment = 'dev') => {
  const apiClient = createApiClient(environment);
  try {
    const response = await apiClient.get(`/stores?status=${status}`);

    // ★★★ ここが修正された部分です。 ★★★
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
 * @param {string} environment - 使用する環境 ('dev' または 'prod')
 * @returns {Promise<object>} 更新された店舗ライセンス情報
 */
export const updateStoreStatus = async (storeId, newStatus, comment = '', environment = 'dev') => {
  const apiClient = createApiClient(environment);
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
 * @param {string} environment - 使用する環境 ('dev' または 'prod')
 * @returns {Promise<string>} 5分間有効な画像URL
 */
export const getLicenseImageUrl = async (imageKey, environment = 'dev') => {
  if (!imageKey) {
    return '';
  }
  const apiClient = createApiClient(environment);
  try {
    const response = await apiClient.get(`/license-image-url?key=${imageKey}`);
    const url = response.data?.data?.url || response.data?.url || '';
    return url;
  } catch (error) {
    console.error('Error fetching license image URL:', error);
    return '';
  }
};