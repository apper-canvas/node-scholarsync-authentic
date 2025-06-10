import announcementsData from '../mockData/announcements.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let announcements = [...announcementsData]

const announcementService = {
  async getAll() {
    await delay(300)
    return [...announcements]
  },

  async getById(id) {
    await delay(200)
    const announcement = announcements.find(a => a.id === id)
    if (!announcement) throw new Error('Announcement not found')
    return { ...announcement }
  },

  async create(announcementData) {
    await delay(400)
    const newAnnouncement = {
      id: Date.now().toString(),
      ...announcementData,
      createdAt: new Date().toISOString()
    }
    announcements.unshift(newAnnouncement)
    return { ...newAnnouncement }
  },

  async update(id, updates) {
    await delay(350)
    const index = announcements.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Announcement not found')
    
    announcements[index] = { ...announcements[index], ...updates }
    return { ...announcements[index] }
  },

  async delete(id) {
    await delay(250)
    const index = announcements.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Announcement not found')
    
    announcements.splice(index, 1)
    return true
  }
}

export default announcementService