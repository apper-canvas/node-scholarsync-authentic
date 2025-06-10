import attendanceData from '../mockData/attendance.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let attendanceRecords = [...attendanceData]

const attendanceService = {
  async getAll() {
    await delay(300)
    return [...attendanceRecords]
  },

  async getById(id) {
    await delay(200)
    const record = attendanceRecords.find(a => a.id === id)
    if (!record) throw new Error('Attendance record not found')
    return { ...record }
  },

  async create(attendanceData) {
    await delay(400)
    const newRecord = {
      id: Date.now().toString(),
      ...attendanceData
    }
    attendanceRecords.push(newRecord)
    return { ...newRecord }
  },

  async update(id, updates) {
    await delay(350)
    const index = attendanceRecords.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Attendance record not found')
    
    attendanceRecords[index] = { ...attendanceRecords[index], ...updates }
    return { ...attendanceRecords[index] }
  },

  async delete(id) {
    await delay(250)
    const index = attendanceRecords.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Attendance record not found')
    
    attendanceRecords.splice(index, 1)
    return true
  }
}

export default attendanceService