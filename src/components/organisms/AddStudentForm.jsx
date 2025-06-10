import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

const AddStudentForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    email: '',
    phone: '',
    parentContact: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.grade || !formData.email) {
      toast.error('Please fill all required fields');
      return;
    }
    onSubmit({
      ...formData,
      grade: parseInt(formData.grade)
    });
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
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <Heading as="h3" className="text-lg font-semibold text-surface-900">Add New Student</Heading>
            <Button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
              <FormField
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            </div>

            <FormField
              label="Grade"
              type="select"
              value={formData.grade}
              onChange={(e) => handleChange('grade', e.target.value)}
              required
              options={[
                { value: '', label: 'Select Grade' },
                ...[9, 10, 11, 12].map(grade => ({ value: grade, label: grade }))
              ]}
            />

            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />

            <FormField
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />

            <FormField
              label="Parent Contact"
              type="tel"
              value={formData.parentContact}
              onChange={(e) => handleChange('parentContact', e.target.value)}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-primary text-white hover:bg-primary/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Student
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
      </motion.div>
    </AnimatePresence>
  );
};

export default AddStudentForm;