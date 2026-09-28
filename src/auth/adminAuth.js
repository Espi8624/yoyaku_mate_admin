// src/auth/adminAuth.js
// 管理者共有パスワードログインで発行されたセッショントークンをlocalStorageで管理するヘルパー

const TOKEN_KEY = 'admin_session_token';

/**
 * 保存されているセッショントークンを取得します。
 * @returns {string | null}
 */
export const getAdminToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to read admin token from localStorage:', error);
    return null;
  }
};

/**
 * セッショントークンを保存します。
 * @param {string} token
 */
export const setAdminToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to persist admin token to localStorage:', error);
  }
};

/**
 * セッショントークンを削除します(ログアウト、または401応答受信時に使用)。
 */
export const clearAdminToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear admin token from localStorage:', error);
  }
};

/**
 * トークンが存在するかどうかだけを判定します。
 * - 有効期限や署名の検証はサーバー側(各APIリクエストへの401応答)に委ね、
 *   ここでは「ログイン画面を出すべきか」の簡易判定のみ行う
 * @returns {boolean}
 */
export const hasAdminToken = () => Boolean(getAdminToken());
