import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Students from '../pages/Students'
import Classes from '../pages/Classes'
import Attendance from '../pages/Attendance'
import Grades from '../pages/Grades'
import Announcements from '../pages/Announcements'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  students: {
    id: 'students',
    label: 'Students',
    path: '/students',
    icon: 'Users',
    component: Students
  },
  classes: {
    id: 'classes',
    label: 'Classes',
    path: '/classes',
    icon: 'BookOpen',
    component: Classes
  },
  attendance: {
    id: 'attendance',
    label: 'Attendance',
    path: '/attendance',
    icon: 'Calendar',
    component: Attendance
  },
  grades: {
    id: 'grades',
    label: 'Grades',
    path: '/grades',
    icon: 'Award',
    component: Grades
  },
  announcements: {
    id: 'announcements',
    label: 'Announcements',
    path: '/announcements',
    icon: 'Megaphone',
    component: Announcements
  }
}

export const routeArray = Object.values(routes)