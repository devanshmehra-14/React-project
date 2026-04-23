import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './screens/LoginPage';
import DashboardPage from './screens/DashboardPage';
import RecordingPage from './screens/RecordingPage';
import NotePage from './screens/NotePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0F6E56',
            color: '#F5F5F0',
            fontWeight: 500,
          },
          success: {
            iconTheme: { primary: '#F5F5F0', secondary: '#0F6E56' },
          },
          error: {
            style: { background: '#E24B4A', color: '#F5F5F0' },
            iconTheme: { primary: '#F5F5F0', secondary: '#E24B4A' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/record"
          element={
            <ProtectedRoute>
              <RecordingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/note"
          element={
            <ProtectedRoute>
              <NotePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
