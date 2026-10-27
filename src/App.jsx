import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { StudyProvider } from './context/StudyContext';
import { useStudy } from './context/useStudy';
import { Layout } from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SmartPlan from './pages/SmartPlan';
import HabitTracker from './pages/HabitTracker';
import TaskManager from './pages/TaskManager';
import Pomodoro from './pages/Pomodoro';
import Analytics from './pages/Analytics';
import GoalPlanner from './pages/GoalPlanner';
import CalendarView from './pages/CalendarView';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { user } = useStudy();
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
    <Routes location={location}>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/smart-plan" element={<ProtectedRoute><SmartPlan /></ProtectedRoute>} />
      <Route path="/habits" element={<ProtectedRoute><HabitTracker /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><TaskManager /></ProtectedRoute>} />
      <Route path="/pomodoro" element={<ProtectedRoute><Pomodoro /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><GoalPlanner /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Redirect fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <StudyProvider>
      <Router>
        <AppRoutes />
      </Router>
    </StudyProvider>
  );
}
