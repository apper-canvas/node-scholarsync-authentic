import classesData from '../mockData/classes.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let classes = [...classesData]

const classService = {
  async getAll() {
    await delay(300)
    return [...classes]
  },

  async getById(id) {
    await delay(200)
    const classObj = classes.find(c => c.id === id)
    if (!classObj) throw new Error('Class not found')
    return { ...classObj }
  },

  async create(classData) {
    await delay(400)
    const newClass = {
      id: Date.now().toString(),
      ...classData,
      studentIds: classData.studentIds || []
    }
    classes.push(newClass)
    return { ...newClass }
  },

  async update(id, updates) {
    await delay(350)
    const index = classes.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Class not found')
    
    classes[index] = { ...classes[index], ...updates }
    return { ...classes[index] }
  },

  async delete(id) {
    await delay(250)
    const index = classes.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Class not found')
    
    classes.splice(index, 1)
    return true
  }
}

export default classService