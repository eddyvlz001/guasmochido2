import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SplashScreen from './components/splash-screen/SplashScreen';
import Login from './components/auth/login/Login';
import Register from './components/auth/register/Register';
import DashboardHome from './components/dashboard/dashboard-home/DashboardHome';
import ControlPanel from './components/dashboard/control-panel/ControlPanel';
import History from './components/dashboard/history/History';
import SelectPanel from './components/dashboard/select-panel/SelectPanel';
import ProtectedRoute from './components/auth/guards/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <DashboardHome />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/control-panel" 
              element={
                <ProtectedRoute>
                  <ControlPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/control-panel/:id" 
              element={
                <ProtectedRoute>
                  <ControlPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/history" 
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/select-panel" 
              element={
                <ProtectedRoute>
                  <SelectPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;