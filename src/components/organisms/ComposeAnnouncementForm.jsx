import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';

const ComposeAnnouncementForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Current User',
    audience: 'all'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Please fill all required fields');
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AnimatePresence>
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
              <Heading as="h3" className="text-xl font-semibold text-surface-900">
                Compose Announcement
              </Heading>
              <Button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter announcement title"
                required
              />

              <FormField
                label="Audience"
                type="select"
                value={formData.audience}
                onChange={(e) => handleChange('audience', e.target.value)}
                required
                options={[
                  { value: 'all', label: 'Everyone' },
                  { value: 'students', label: 'Students Only' },
                  { value: 'staff', label: 'Staff Only' },
                  { value: 'parents', label: 'Parents Only' }
                ]}
              />

              <FormField
                label="Author"
                type="text"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Your name"
              />

              <FormField
                label="Content"
                type="textarea"
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Write your announcement content here..."
                rows={6}
                required
              />
              <Paragraph className="text-xs text-surface-500 mt-1">
                {formData.content.length} characters
              </Paragraph>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-white hover:bg-primary/90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Publish Announcement
                </Button>
                <Button
                  type="button"
                  onClick={onClose}
                  className="border border-surface-300 text-surface-700 hover:bg-surface-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComposeAnnouncementForm;