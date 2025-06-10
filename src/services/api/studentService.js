import studentsData from '../mockData/students.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let students = [...studentsData]

const studentService = {
  async getAll() {
    await delay(300)
    return [...students]
  },

  async getById(id) {
    await delay(200)
    const student = students.find(s => s.id === id)
    if (!student) throw new Error('Student not found')
    return { ...student }
  },

  async create(studentData) {
    await delay(400)
    const newStudent = {
      id: Date.now().toString(),
      ...studentData,
      enrollmentDate: new Date().toISOString()
    }
    students.push(newStudent)
    return { ...newStudent }
  },

  async update(id, updates) {
    await delay(350)
    const index = students.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Student not found')
    
    students[index] = { ...students[index], ...updates }
    return { ...students[index] }
  },

  async delete(id) {
    await delay(250)
    const index = students.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Student not found')
    
    students.splice(index, 1)
    return true
  }
}

export default studentService