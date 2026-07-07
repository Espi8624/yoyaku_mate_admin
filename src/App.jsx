import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StoreApprovalPage from './pages/StoreApprovalPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <StoreApprovalPage />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;