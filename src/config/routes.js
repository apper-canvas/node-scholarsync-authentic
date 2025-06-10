import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import StudentsPage from '@/components/pages/StudentsPage';
import ClassesPage from '@/components/pages/ClassesPage';
import AttendancePage from '@/components/pages/AttendancePage';
import GradesPage from '@/components/pages/GradesPage';
import AnnouncementsPage from '@/components/pages/AnnouncementsPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: DashboardPage
  },
  students: {
    id: 'students',
    label: 'Students',
    path: '/students',
    icon: 'Users',
component: StudentsPage
  },
  classes: {
    id: 'classes',
    label: 'Classes',
    path: '/classes',
    icon: 'BookOpen',
component: ClassesPage
  },
  attendance: {
    id: 'attendance',
    label: 'Attendance',
    path: '/attendance',
    icon: 'Calendar',
component: AttendancePage
  },
  grades: {
    id: 'grades',
    label: 'Grades',
    path: '/grades',
    icon: 'Award',
component: GradesPage
  },
  announcements: {
    id: 'announcements',
    label: 'Announcements',
    path: '/announcements',
    icon: 'Megaphone',
component: AnnouncementsPage
  }
}

export const routeArray = Object.values(routes)