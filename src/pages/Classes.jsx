import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { classService, studentService } from '../services'

const Classes = () => {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ])
      setClasses(classesData)
      setStudents(studentsData)
    } catch (err) {
      setError(err.message || 'Failed to load classes')
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const filteredClasses = classes.filter(cls => 
    selectedPeriod === '' || cls.period.toString() === selectedPeriod
  )

  const periods = [...new Set(classes.map(c => c.period))].sort()

  const getClassStudents = (classObj) => {
    return students.filter(student => 
      classObj.studentIds?.includes(student.id)
    )
  }

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'English': 'bg-green-100 text-green-800',
      'Science': 'bg-purple-100 text-purple-800',
      'History': 'bg-orange-100 text-orange-800',
      'Art': 'bg-pink-100 text-pink-800',
      'Physical Education': 'bg-red-100 text-red-800'
    }
    return colors[subject] || 'bg-surface-100 text-surface-800'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-64 mb-4"></div>
          <div className="h-12 bg-surface-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-surface-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load classes</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">
            Classes
          </h1>
          <p className="text-surface-600">
            Manage class schedules and student rosters
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Class</span>
        </motion.button>
      </motion.div>

      {/* Schedule Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-surface-900">
            Today's Schedule
          </h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Periods</option>
            {periods.map(period => (
              <option key={period} value={period}>Period {period}</option>
            ))}
          </select>
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredClasses.map((classObj, index) => (
            <motion.div
              key={classObj.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="bg-surface-50 rounded-lg p-4 border border-surface-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {classObj.period}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(classObj.subject)}`}>
                    {classObj.subject}
                  </span>
                </div>
                <ApperIcon name="MapPin" className="w-4 h-4 text-surface-500" />
              </div>

              <h3 className="font-medium text-surface-900 mb-1">
                {classObj.name}
              </h3>
              <p className="text-sm text-surface-600 mb-3">
                Room {classObj.room}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Users" className="w-4 h-4 text-surface-500" />
                  <span className="text-sm text-surface-600">
                    {getClassStudents(classObj).length} students
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-primary hover:bg-primary/10 p-1 rounded transition-colors duration-200"
                >
                  <ApperIcon name="ArrowRight" className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Class Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-heading font-semibold text-surface-900">
          Class Rosters
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClasses.map((classObj, index) => (
            <motion.div
              key={classObj.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="bg-white rounded-lg shadow-sm border border-surface-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-surface-900">
                      {classObj.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(classObj.subject)}`}>
                        {classObj.subject}
                      </span>
                      <span className="text-sm text-surface-500">
                        Period {classObj.period} • Room {classObj.room}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {getClassStudents(classObj).length}
                    </p>
                    <p className="text-xs text-surface-500">Students</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-surface-700 mb-2">
                    Enrolled Students
                  </h4>
                  {getClassStudents(classObj).length === 0 ? (
                    <p className="text-sm text-surface-500 italic">
                      No students enrolled
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {getClassStudents(classObj).map(student => (
                        <div
                          key={student.id}
                          className="flex items-center space-x-3 p-2 bg-surface-50 rounded-lg"
                        >
                          <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {student.firstName[0]}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-900 truncate">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-surface-500">
                              Grade {student.grade}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t border-surface-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 text-sm border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors duration-200"
                  >
                    Edit
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {filteredClasses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="BookOpen" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">
            {selectedPeriod ? `No classes for period ${selectedPeriod}` : 'No classes found'}
          </h3>
          <p className="mt-2 text-surface-500">
            {classes.length === 0 
              ? "Get started by creating your first class"
              : "Try selecting a different period"
            }
          </p>
          {classes.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              Create Class
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default Classes