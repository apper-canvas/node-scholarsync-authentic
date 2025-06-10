import gradesData from '../mockData/grades.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let grades = [...gradesData]

const gradeService = {
  async getAll() {
    await delay(300)
    return [...grades]
  },

  async getById(id) {
    await delay(200)
    const grade = grades.find(g => g.id === id)
    if (!grade) throw new Error('Grade not found')
    return { ...grade }
  },

  async create(gradeData) {
    await delay(400)
    const newGrade = {
      id: Date.now().toString(),
      ...gradeData
    }
    grades.push(newGrade)
    return { ...newGrade }
  },

  async update(id, updates) {
    await delay(350)
    const index = grades.findIndex(g => g.id === id)
    if (index === -1) throw new Error('Grade not found')
    
    grades[index] = { ...grades[index], ...updates }
    return { ...grades[index] }
  },

  async delete(id) {
    await delay(250)
    const index = grades.findIndex(g => g.id === id)
    if (index === -1) throw new Error('Grade not found')
    
    grades.splice(index, 1)
    return true
  }
}

export default gradeService