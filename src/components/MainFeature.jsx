import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { attendanceService, classService, studentService, gradeService } from '../services'

const MainFeature = () => {
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('attendance')

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ])
      setClasses(classesData)
      setStudents(studentsData)
      
      if (classesData.length > 0) {
        setSelectedClass(classesData[0])
        await loadClassData(classesData[0].id)
      }
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadClassData = async (classId) => {
    try {
      const [attendanceData, gradesData] = await Promise.all([
        attendanceService.getAll(),
        gradeService.getAll()
      ])
      
      setAttendanceRecords(attendanceData.filter(record => record.classId === classId))
      setGrades(gradesData.filter(grade => grade.classId === classId))
    } catch (error) {
      toast.error('Failed to load class data')
    }
  }

  const handleClassChange = async (classObj) => {
    setSelectedClass(classObj)
    await loadClassData(classObj.id)
  }

  const markAttendance = async (studentId, status) => {
    try {
      const today = new Date().toISOString()
      const existingRecord = attendanceRecords.find(
        record => record.studentId === studentId && 
        record.date.split('T')[0] === today.split('T')[0]
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
          date: today,
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

  const addGrade = async (studentId, assignmentName, score, maxScore) => {
    try {
      const newGrade = await gradeService.create({
        studentId,
        classId: selectedClass.id,
        assignmentName,
        score: parseFloat(score),
        maxScore: parseFloat(maxScore),
        date: new Date().toISOString()
      })
      
      setGrades(prev => [...prev, newGrade])
      toast.success('Grade added successfully')
    } catch (error) {
      toast.error('Failed to add grade')
    }
  }

  const getStudentAttendance = (studentId) => {
    const today = new Date().toISOString().split('T')[0]
    return attendanceRecords.find(
      record => record.studentId === studentId && 
      record.date.split('T')[0] === today
    )
  }

  const getStudentGradeAverage = (studentId) => {
    const studentGrades = grades.filter(grade => grade.studentId === studentId)
    if (studentGrades.length === 0) return 'N/A'
    
    const average = studentGrades.reduce((sum, grade) => 
      sum + (grade.score / grade.maxScore), 0
    ) / studentGrades.length
    
    return Math.round(average * 100) + '%'
  }

  const classStudents = students.filter(student => 
    selectedClass?.studentIds?.includes(student.id)
  )

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-heading font-bold text-surface-900">
          Class Management
        </h2>
        
        {/* Class Selector */}
        <select
          value={selectedClass?.id || ''}
          onChange={(e) => {
            const classObj = classes.find(c => c.id === e.target.value)
            if (classObj) handleClassChange(classObj)
          }}
          className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name} - {cls.subject}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-surface-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'attendance'
                ? 'border-primary text-primary'
                : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'grades'
                ? 'border-primary text-primary'
                : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
            }`}
          >
            Grades
          </button>
        </nav>
      </div>

      {/* Content */}
      {selectedClass ? (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'attendance' && (
            <AttendanceTab
              students={classStudents}
              getStudentAttendance={getStudentAttendance}
              markAttendance={markAttendance}
            />
          )}
          
          {activeTab === 'grades' && (
            <GradesTab
              students={classStudents}
              grades={grades}
              getStudentGradeAverage={getStudentGradeAverage}
              addGrade={addGrade}
            />
          )}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <ApperIcon name="BookOpen" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No classes available</h3>
          <p className="text-surface-500">Create a class to get started with management</p>
        </div>
      )}
    </div>
  )
}

const AttendanceTab = ({ students, getStudentAttendance, markAttendance }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-surface-200">
      <div className="p-6">
        <h3 className="text-lg font-medium text-surface-900 mb-4">
          Today's Attendance
        </h3>
        
        <div className="space-y-3">
          {students.map((student) => {
            const attendance = getStudentAttendance(student.id)
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-surface-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
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
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                        attendance?.status === status
                          ? status === 'present'
                            ? 'bg-success text-white'
                            : status === 'absent'
                            ? 'bg-error text-white'
                            : 'bg-warning text-white'
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
      </div>
    </div>
  )
}

const GradesTab = ({ students, grades, getStudentGradeAverage, addGrade }) => {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [assignmentName, setAssignmentName] = useState('')
  const [score, setScore] = useState('')
  const [maxScore, setMaxScore] = useState('100')

  const handleAddGrade = async (e) => {
    e.preventDefault()
    if (!selectedStudent || !assignmentName || !score || !maxScore) {
      toast.error('Please fill all fields')
      return
    }

    await addGrade(selectedStudent, assignmentName, score, maxScore)
    setSelectedStudent('')
    setAssignmentName('')
    setScore('')
    setMaxScore('100')
  }

  return (
    <div className="space-y-6">
      {/* Add Grade Form */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <h3 className="text-lg font-medium text-surface-900 mb-4">Add New Grade</h3>
        
        <form onSubmit={handleAddGrade} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          >
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
            placeholder="Assignment name"
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
          
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Score"
            min="0"
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
          
          <input
            type="number"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            placeholder="Max score"
            min="1"
            className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Add Grade
          </motion.button>
        </form>
      </div>

      {/* Student Grades */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-surface-900 mb-4">Student Averages</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-surface-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-surface-900">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-surface-500">Grade {student.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {getStudentGradeAverage(student.id)}
                    </p>
                    <p className="text-xs text-surface-500">Average</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFeature