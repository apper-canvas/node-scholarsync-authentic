import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { studentService, classService, attendanceService, gradeService, announcementService } from '../services'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    todayAttendanceRate: 0,
    averageGrade: 0
  })
  const [todaysSchedule, setTodaysSchedule] = useState([])
  const [recentAnnouncements, setRecentAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [students, classes, attendance, grades, announcements] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll(),
        announcementService.getAll()
      ])

      // Calculate today's attendance
      const today = new Date().toISOString().split('T')[0]
      const todayAttendance = attendance.filter(record => 
        record.date.split('T')[0] === today
      )
      const presentToday = todayAttendance.filter(record => 
        record.status === 'present'
      ).length
      const attendanceRate = todayAttendance.length > 0 
        ? Math.round((presentToday / todayAttendance.length) * 100)
        : 0

      // Calculate average grade
      const totalScore = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore), 0)
      const averageGrade = grades.length > 0 
        ? Math.round((totalScore / grades.length) * 100)
        : 0

      setStats({
        totalStudents: students.length,
        totalClasses: classes.length,
        todayAttendanceRate: attendanceRate,
        averageGrade
      })

      setTodaysSchedule(classes.slice(0, 4)) // Show first 4 classes as today's schedule
      setRecentAnnouncements(announcements.slice(0, 3))
    } catch (error) {
      setError(error.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-surface-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-8 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load dashboard</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">
          Dashboard
        </h1>
        <p className="text-surface-600">
          Overview of your school management activities
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          color="primary"
          delay={0}
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon="BookOpen"
          color="secondary"
          delay={0.1}
        />
        <StatCard
          title="Today's Attendance"
          value={`${stats.todayAttendanceRate}%`}
          icon="Calendar"
          color="success"
          delay={0.2}
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon="Award"
          color="accent"
          delay={0.3}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-surface-900">
                Today's Schedule
              </h2>
              <ApperIcon name="Clock" className="w-5 h-5 text-surface-400" />
            </div>
            
            <div className="space-y-3">
              {todaysSchedule.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-medium text-sm">
                        {classItem.period}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-surface-900">{classItem.name}</p>
                      <p className="text-sm text-surface-500">Room {classItem.room}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                    {classItem.subject}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Announcements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-surface-900">
                Recent Announcements
              </h2>
              <ApperIcon name="Megaphone" className="w-5 h-5 text-surface-400" />
            </div>
            
            <div className="space-y-4">
              {recentAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="border-l-4 border-accent pl-4"
                >
                  <h3 className="font-medium text-surface-900 mb-1">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-surface-600 mb-2 line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-surface-500">
                    <span>By {announcement.author}</span>
                    <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold mb-2">
              Complete Your Daily Tasks
            </h3>
            <p className="text-white/90 mb-4">
              Mark attendance, enter grades, and check announcements to stay on top of your school management.
            </p>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-white text-primary rounded-lg font-medium hover:bg-surface-50 transition-colors duration-200">
                Mark Attendance
              </button>
              <button className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors duration-200">
                Enter Grades
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const StatCard = ({ title, value, icon, color, delay }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    accent: 'bg-accent/10 text-accent'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-surface-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-surface-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard