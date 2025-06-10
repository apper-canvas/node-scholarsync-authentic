import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

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

        <Heading as="h1" className="text-4xl font-bold text-surface-900 mb-2">
          404 - Page Not Found
        </Heading>
        <Paragraph className="text-surface-600 mb-6 max-w-md">
          The page you're looking for doesn't exist. Let's get you back to managing your school.
        </Paragraph>

        <div className="space-x-4">
          <Button
            onClick={() => navigate(-1)}
            className="border border-surface-300 text-surface-700 hover:bg-surface-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="bg-primary text-white hover:bg-primary/90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;