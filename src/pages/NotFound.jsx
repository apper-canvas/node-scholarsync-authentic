import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="MapPin" className="w-12 h-12 text-surface-400" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-surface-900 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-surface-600 mb-6 max-w-md">
          The page you're looking for doesn't exist. Let's get you back to managing your school.
        </p>
        
        <div className="space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors duration-200"
          >
            Go Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            Go Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound