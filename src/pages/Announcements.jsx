import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { announcementService } from '../services'

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showComposeForm, setShowComposeForm] = useState(false)
  const [audienceFilter, setAudienceFilter] = useState('')

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await announcementService.getAll()
      setAnnouncements(data)
    } catch (err) {
      setError(err.message || 'Failed to load announcements')
      toast.error('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnnouncement = async (announcementData) => {
    try {
      const newAnnouncement = await announcementService.create(announcementData)
      setAnnouncements(prev => [newAnnouncement, ...prev])
      setShowComposeForm(false)
      toast.success('Announcement created successfully')
    } catch (error) {
      toast.error('Failed to create announcement')
    }
  }

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementService.delete(id)
        setAnnouncements(prev => prev.filter(announcement => announcement.id !== id))
        toast.success('Announcement deleted successfully')
      } catch (error) {
        toast.error('Failed to delete announcement')
      }
    }
  }

  const filteredAnnouncements = announcements.filter(announcement => 
    audienceFilter === '' || announcement.audience === audienceFilter
  )

  const getAudienceBadgeColor = (audience) => {
    const colors = {
      'all': 'bg-primary/10 text-primary',
      'students': 'bg-secondary/10 text-secondary',
      'staff': 'bg-accent/10 text-accent',
      'parents': 'bg-success/10 text-success'
    }
    return colors[audience] || 'bg-surface-100 text-surface-800'
  }

  const getTimeAgo = (date) => {
    const now = new Date()
    const announcementDate = new Date(date)
    const diffTime = Math.abs(now - announcementDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return announcementDate.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-64 mb-4"></div>
          <div className="h-12 bg-surface-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-200 rounded-lg"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load announcements</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadAnnouncements}
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
            Announcements
          </h1>
          <p className="text-surface-600">
            Create and manage school announcements
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowComposeForm(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Compose Announcement</span>
        </motion.button>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-4"
      >
        <div className="flex items-center space-x-4">
          <ApperIcon name="Filter" className="w-5 h-5 text-surface-500" />
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Audiences</option>
            <option value="all">Everyone</option>
            <option value="students">Students</option>
            <option value="staff">Staff</option>
            <option value="parents">Parents</option>
          </select>
          <span className="text-sm text-surface-600">
            {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm border border-surface-200"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Megaphone" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">
            {announcements.length === 0 ? 'No announcements yet' : 'No announcements for selected audience'}
          </h3>
          <p className="mt-2 text-surface-500">
            {announcements.length === 0 
              ? "Create your first announcement to get started"
              : "Try selecting a different audience filter"
            }
          </p>
          {announcements.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowComposeForm(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              Create Announcement
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-surface-900">
                      {announcement.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAudienceBadgeColor(announcement.audience)}`}>
                      {announcement.audience === 'all' ? 'Everyone' : announcement.audience.charAt(0).toUpperCase() + announcement.audience.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-surface-700 mb-4 leading-relaxed break-words">
                    {announcement.content}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-surface-500">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="User" className="w-4 h-4" />
                      <span>By {announcement.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Clock" className="w-4 h-4" />
                      <span>{getTimeAgo(announcement.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="p-2 text-surface-600 hover:text-error hover:bg-error/10 rounded-lg transition-all duration-200"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Compose Announcement Modal */}
      <AnimatePresence>
        {showComposeForm && (
          <ComposeAnnouncementModal
            onClose={() => setShowComposeForm(false)}
            onSubmit={handleCreateAnnouncement}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const ComposeAnnouncementModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Current User',
    audience: 'all'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      toast.error('Please fill all required fields')
      return
    }
    onSubmit(formData)
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
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-semibold text-surface-900">
                Compose Announcement
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter announcement title"
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Audience *
                </label>
                <select
                  value={formData.audience}
                  onChange={(e) => handleChange('audience', e.target.value)}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="all">Everyone</option>
                  <option value="students">Students Only</option>
                  <option value="staff">Staff Only</option>
                  <option value="parents">Parents Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Write your announcement content here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  required
                />
                <p className="text-xs text-surface-500 mt-1">
                  {formData.content.length} characters
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                >
                  Publish Announcement
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
        </div>
      </motion.div>
    </>
  )
}

export default Announcements