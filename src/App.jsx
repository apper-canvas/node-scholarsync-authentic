import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from './Layout'
import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import StudentsPage from '@/components/pages/StudentsPage';
import ClassesPage from '@/components/pages/ClassesPage';
import AttendancePage from '@/components/pages/AttendancePage';
import GradesPage from '@/components/pages/GradesPage';
import AnnouncementsPage from '@/components/pages/AnnouncementsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
<Route index element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="grades" element={<GradesPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </BrowserRouter>
  )
}

export default App