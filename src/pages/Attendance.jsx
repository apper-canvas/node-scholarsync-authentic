import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { attendanceService, classService, studentService } from '../services'

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedClass && selectedDate) {
      loadAttendanceData()
    }
  }, [selectedClass, selectedDate])

  const loadInitialData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ])
      setClasses(classesData)
      setStudents(studentsData)
      
      if (classesData.length > 0) {
        setSelectedClass(classesData[0])
      }
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadAttendanceData = async () => {
    try {
      const data = await attendanceService.getAll()
      const filteredRecords = data.filter(record => 
        record.classId === selectedClass.id && 
        record.date.split('T')[0] === selectedDate
      )
      setAttendanceRecords(filteredRecords)
    } catch (error) {
      toast.error('Failed to load attendance data')
    }
  }

  const markAttendance = async (studentId, status) => {
    try {
      const existingRecord = attendanceRecords.find(
        record => record.studentId === studentId
      )

      if (existingRecord) {
        const updated = await attendanceService.update(existingRecord.id, {
          ...existingRecord,
          status
        })
        setAttendanceRecords(prev => 
          prev.map(record => record.id === updated.id ? updated : record)
        )
      } else {
        const newRecord = await attendanceService.create({
          studentId,
          classId: selectedClass.id,
          date: new Date(selectedDate + 'T08:00:00.000Z').toISOString(),
          status,
          notes: ''
        })
        setAttendanceRecords(prev => [...prev, newRecord])
      }
      
      toast.success(`Attendance marked as ${status}`)
    } catch (error) {
      toast.error('Failed to mark attendance')
    }
  }

  const markAllPresent = async () => {
    const classStudents = getClassStudents()
    try {
      for (const student of classStudents) {
        await markAttendance(student.id, 'present')
      }
      toast.success('All students marked present')
    } catch (error) {
      toast.error('Failed to mark all present')
    }
  }

  const getClassStudents = () => {
    if (!selectedClass) return []
    return students.filter(student => 
      selectedClass.studentIds?.includes(student.id)
    )
  }

  const getStudentAttendance = (studentId) => {
    return attendanceRecords.find(record => record.studentId === studentId)
  }

  const getAttendanceStats = () => {
    const classStudents = getClassStudents()
    const totalStudents = classStudents.length
    const presentCount = attendanceRecords.filter(record => record.status === 'present').length
    const absentCount = attendanceRecords.filter(record => record.status === 'absent').length
    const lateCount = attendanceRecords.filter(record => record.status === 'late').length
    const unmarked = totalStudents - attendanceRecords.length

    return {
      total: totalStudents,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      unmarked,
      attendanceRate: totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0
    }
  }

  const stats = getAttendanceStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-64 mb-4"></div>
          <div className="h-12 bg-surface-200 rounded mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-200 rounded"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load attendance</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadInitialData}
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
            Attendance
          </h1>
          <p className="text-surface-600">
            Track student attendance by class and date
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <select
            value={selectedClass?.id || ''}
            onChange={(e) => {
              const classObj = classes.find(c => c.id === e.target.value)
              setSelectedClass(classObj)
            }}
            className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name} - Period {cls.period}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Attendance Stats */}
      {selectedClass && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users" className="w-5 h-5 text-surface-500" />
              <div>
                <p className="text-sm text-surface-600">Total</p>
                <p className="text-xl font-bold text-surface-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
            <div className="flex items-center space-x-2">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-surface-600">Present</p>
                <p className="text-xl font-bold text-success">{stats.present}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
            <div className="flex items-center space-x-2">
              <ApperIcon name="XCircle" className="w-5 h-5 text-error" />
              <div>
                <p className="text-sm text-surface-600">Absent</p>
                <p className="text-xl font-bold text-error">{stats.absent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm text-surface-600">Late</p>
                <p className="text-xl font-bold text-warning">{stats.late}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Percent" className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-surface-600">Rate</p>
                <p className="text-xl font-bold text-primary">{stats.attendanceRate}%</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Attendance Sheet */}
      {selectedClass ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-heading font-semibold text-surface-900">
                  {selectedClass.name} - {new Date(selectedDate).toLocaleDateString()}
                </h2>
                <p className="text-surface-600">
                  Period {selectedClass.period} • Room {selectedClass.room}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAllPresent}
                className="px-4 py-2 bg-success text-white rounded-lg font-medium hover:bg-success/90 transition-colors duration-200 flex items-center space-x-2"
              >
                <ApperIcon name="CheckCircle" className="w-4 h-4" />
                <span>Mark All Present</span>
              </motion.button>
            </div>

            <div className="space-y-3">
              {getClassStudents().map((student, index) => {
                const attendance = getStudentAttendance(student.id)
                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-surface-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-surface-500">Grade {student.grade}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {['present', 'absent', 'late'].map((status) => (
                        <motion.button
                          key={status}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => markAttendance(student.id, status)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            attendance?.status === status
                              ? status === 'present'
                                ? 'bg-success text-white shadow-sm'
                                : status === 'absent'
                                ? 'bg-error text-white shadow-sm'
                                : 'bg-warning text-white shadow-sm'
                              : 'bg-white border border-surface-300 text-surface-600 hover:bg-surface-50'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {getClassStudents().length === 0 && (
              <div className="text-center py-8">
                <ApperIcon name="Users" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500">No students enrolled in this class</p>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Calendar" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">Select a class to begin</h3>
          <p className="mt-2 text-surface-500">
            Choose a class from the dropdown above to start taking attendance
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Attendance