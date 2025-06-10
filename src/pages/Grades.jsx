import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { gradeService, classService, studentService } from '../services'

const Grades = () => {
  const [selectedClass, setSelectedClass] = useState(null)
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      loadGrades()
    }
  }, [selectedClass])

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

  const loadGrades = async () => {
    try {
      const data = await gradeService.getAll()
      const classGrades = data.filter(grade => grade.classId === selectedClass.id)
      setGrades(classGrades)
    } catch (error) {
      toast.error('Failed to load grades')
    }
  }

  const handleAddGrade = async (gradeData) => {
    try {
      const newGrade = await gradeService.create({
        ...gradeData,
        classId: selectedClass.id,
        date: new Date().toISOString()
      })
      setGrades(prev => [...prev, newGrade])
      setShowAddForm(false)
      toast.success('Grade added successfully')
    } catch (error) {
      toast.error('Failed to add grade')
    }
  }

  const handleDeleteGrade = async (id) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await gradeService.delete(id)
        setGrades(prev => prev.filter(grade => grade.id !== id))
        toast.success('Grade deleted successfully')
      } catch (error) {
        toast.error('Failed to delete grade')
      }
    }
  }

  const getClassStudents = () => {
    if (!selectedClass) return []
    return students.filter(student => 
      selectedClass.studentIds?.includes(student.id)
    )
  }

  const getStudentGrades = (studentId) => {
    return grades.filter(grade => grade.studentId === studentId)
  }

  const getStudentAverage = (studentId) => {
    const studentGrades = getStudentGrades(studentId)
    if (studentGrades.length === 0) return 'N/A'
    
    const average = studentGrades.reduce((sum, grade) => 
      sum + (grade.score / grade.maxScore), 0
    ) / studentGrades.length
    
    return Math.round(average * 100) + '%'
  }

  const getClassAverage = () => {
    const classStudents = getClassStudents()
    if (classStudents.length === 0) return 'N/A'
    
    const totalAverage = classStudents.reduce((sum, student) => {
      const studentGrades = getStudentGrades(student.id)
      if (studentGrades.length === 0) return sum
      
      const studentAverage = studentGrades.reduce((gradeSum, grade) => 
        gradeSum + (grade.score / grade.maxScore), 0
      ) / studentGrades.length
      
      return sum + studentAverage
    }, 0)
    
    return Math.round((totalAverage / classStudents.length) * 100) + '%'
  }

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    if (percentage >= 60) return 'D'
    return 'F'
  }

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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load grades</h3>
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
            Grades
          </h1>
          <p className="text-surface-600">
            Manage student grades and assignments
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
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
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            disabled={!selectedClass}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Grade</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Class Overview */}
      {selectedClass && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-heading font-semibold text-surface-900">
                {selectedClass.name}
              </h2>
              <p className="text-surface-600">
                {selectedClass.subject} • Period {selectedClass.period} • Room {selectedClass.room}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{getClassAverage()}</p>
              <p className="text-sm text-surface-500">Class Average</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Users" className="w-5 h-5 text-surface-500" />
                <div>
                  <p className="text-sm text-surface-600">Total Students</p>
                  <p className="text-xl font-bold text-surface-900">{getClassStudents().length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="FileText" className="w-5 h-5 text-surface-500" />
                <div>
                  <p className="text-sm text-surface-600">Total Assignments</p>
                  <p className="text-xl font-bold text-surface-900">
                    {[...new Set(grades.map(g => g.assignmentName))].length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Award" className="w-5 h-5 text-surface-500" />
                <div>
                  <p className="text-sm text-surface-600">Total Grades</p>
                  <p className="text-xl font-bold text-surface-900">{grades.length}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Student Grades */}
      {selectedClass ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <div className="p-6">
            <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
              Student Grades
            </h3>
            
            <div className="space-y-4">
              {getClassStudents().map((student, index) => {
                const studentGrades = getStudentGrades(student.id)
                const average = getStudentAverage(student.id)
                const percentage = average !== 'N/A' ? parseInt(average) : 0
                
                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="border border-surface-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
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
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">{average}</p>
                        <p className="text-sm text-surface-500">
                          {average !== 'N/A' && getLetterGrade(percentage)}
                        </p>
                      </div>
                    </div>
                    
                    {studentGrades.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {studentGrades.map(grade => (
                          <div
                            key={grade.id}
                            className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-surface-900">
                                {grade.assignmentName}
                              </p>
                              <p className="text-xs text-surface-500">
                                {new Date(grade.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">
                                {grade.score}/{grade.maxScore}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteGrade(grade.id)}
                                className="p-1 text-surface-400 hover:text-error transition-colors duration-200"
                              >
                                <ApperIcon name="Trash2" className="w-3 h-3" />
                              </motion.button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-surface-500 italic">No grades recorded</p>
                    )}
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
            <ApperIcon name="Award" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">Select a class to begin</h3>
          <p className="mt-2 text-surface-500">
            Choose a class from the dropdown above to start managing grades
          </p>
        </motion.div>
      )}

      {/* Add Grade Modal */}
      <AnimatePresence>
        {showAddForm && selectedClass && (
          <AddGradeModal
            classObj={selectedClass}
            students={getClassStudents()}
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddGrade}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const AddGradeModal = ({ classObj, students, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    assignmentName: '',
    score: '',
    maxScore: '100'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.studentId || !formData.assignmentName || !formData.score || !formData.maxScore) {
      toast.error('Please fill all fields')
      return
    }
    
    onSubmit({
      ...formData,
      score: parseFloat(formData.score),
      maxScore: parseFloat(formData.maxScore)
    })
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-surface-900">
              Add Grade - {classObj.name}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Student *
              </label>
              <select
                value={formData.studentId}
                onChange={(e) => handleChange('studentId', e.target.value)}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Assignment Name *
              </label>
              <input
                type="text"
                value={formData.assignmentName}
                onChange={(e) => handleChange('assignmentName', e.target.value)}
                placeholder="e.g., Math Quiz 1"
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Score *
                </label>
                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) => handleChange('score', e.target.value)}
                  placeholder="85"
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Max Score *
                </label>
                <input
                  type="number"
                  value={formData.maxScore}
                  onChange={(e) => handleChange('maxScore', e.target.value)}
                  placeholder="100"
                  min="1"
                  step="0.1"
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
              >
                Add Grade
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors duration-200"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  )
}

export default Grades