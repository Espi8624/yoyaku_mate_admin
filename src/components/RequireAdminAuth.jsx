import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasAdminToken } from '../auth/adminAuth';

// - セッショントークンの署名/有効期限の実際の検証はサーバー側(各APIの401応答)が行う。
//   ここではトークンの有無だけを見て、無ければログイン画面へリダイレクトする簡易ガード
function RequireAdminAuth({ children }) {
  const location = useLocation();

  if (!hasAdminToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default RequireAdminAuth;
