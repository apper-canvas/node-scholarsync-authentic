import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';

const AnnouncementItem = ({ announcement, index, getAudienceBadgeColor, getTimeAgo, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
      className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Heading as="h3" className="font-medium text-surface-900">
              {announcement.title}
            </Heading>
            <Badge className={getAudienceBadgeColor(announcement.audience)}>
              {announcement.audience === 'all' ? 'Everyone' : announcement.audience.charAt(0).toUpperCase() + announcement.audience.slice(1)}
            </Badge>
          </div>

          <Paragraph className="text-surface-700 mb-4 leading-relaxed break-words line-clamp-2">
            {announcement.content}
          </Paragraph>

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
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(announcement.id)}
            className="p-2 text-surface-600 hover:text-error hover:bg-error/10 rounded-lg transition-all duration-200"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementItem;