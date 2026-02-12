
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadPage from './pages/UploadPage';
import FilesPage from './pages/FilesPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 pt-24 flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          } />

          <Route path="/files" element={
            <ProtectedRoute>
              <FilesPage />
            </ProtectedRoute>
          } />

          <Route path="/search" element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/" element={
            <div className="animate-fade-in">
              <LandingPage />
            </div>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <footer className="w-full bg-[var(--bg-primary)] border-t border-[var(--border-color)] py-8 transition-colors duration-300 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} Secure File Guardian. <span className="text-brand-blue">AI-Driven Secure File Storage & Sharing Platform.</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
