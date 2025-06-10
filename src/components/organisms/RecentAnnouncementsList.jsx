import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import AnnouncementItem from '@/components/molecules/AnnouncementItem';

const RecentAnnouncementsList = ({ announcements, motionDelay }) => {
  const getAudienceBadgeColor = (audience) => {
    const colors = {
      'all': 'bg-primary/10 text-primary',
      'students': 'bg-secondary/10 text-secondary',
      'staff': 'bg-accent/10 text-accent',
      'parents': 'bg-success/10 text-success'
    };
    return colors[audience] || 'bg-surface-100 text-surface-800';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const announcementDate = new Date(date);
    const diffTime = Math.abs(now - announcementDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return announcementDate.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: motionDelay }}
      className="bg-white rounded-lg shadow-sm border border-surface-200"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Heading as="h2" className="text-lg font-semibold text-surface-900">
            Recent Announcements
          </Heading>
          <ApperIcon name="Megaphone" className="w-5 h-5 text-surface-400" />
        </div>

        <div className="space-y-4">
          {announcements.length === 0 ? (
            <Paragraph className="text-sm text-surface-500 italic">No recent announcements.</Paragraph>
          ) : (
            announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="border-l-4 border-accent pl-4"
              >
                <Heading as="h3" className="font-medium text-surface-900 mb-1">
                  {announcement.title}
                </Heading>
                <Paragraph className="text-sm text-surface-600 mb-2 line-clamp-2">
                  {announcement.content}
                </Paragraph>
                <div className="flex items-center justify-between text-xs text-surface-500">
                  <span>By {announcement.author}</span>
                  <span>{getTimeAgo(announcement.createdAt)}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RecentAnnouncementsList;