import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentRegistration from './pages/StudentRegistration';
import Sessions from './pages/Sessions';
import IrisEnrollment from './pages/IrisEnrollment';
import IrisVerification from './pages/IrisVerification';
import AttendanceReport from './pages/AttendanceReport';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentRegistration />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sessions"
            element={
              <ProtectedRoute>
                <Sessions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/enrollment"
            element={
              <ProtectedRoute>
                <IrisEnrollment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verification"
            element={
              <ProtectedRoute>
                <IrisVerification />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <AttendanceReport />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;