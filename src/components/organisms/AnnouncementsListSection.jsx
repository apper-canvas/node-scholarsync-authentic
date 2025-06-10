import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import Select from '@/components/atoms/Select';
import EmptyStateDisplay from '@/components/organisms/EmptyStateDisplay';
import AnnouncementItem from '@/components/molecules/AnnouncementItem';
import Paragraph from '@/components/atoms/Paragraph';

const AnnouncementsListSection = ({
  filteredAnnouncements,
  audienceFilter,
  setAudienceFilter,
  onDeleteAnnouncement,
  announcementsLength,
  setShowComposeForm,
  motionDelay
}) => {

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
    <>
      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-surface-200 p-4"
      >
        <div className="flex items-center space-x-4">
          <ApperIcon name="Filter" className="w-5 h-5 text-surface-500" />
          <Select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="px-4 py-2"
          >
            <option value="">All Audiences</option>
            <option value="all">Everyone</option>
            <option value="students">Students</option>
            <option value="staff">Staff</option>
            <option value="parents">Parents</option>
          </Select>
          <Paragraph className="text-sm text-surface-600">
            {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? 's' : ''}
          </Paragraph>
        </div>
      </motion.div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <EmptyStateDisplay
          icon="Megaphone"
          title={announcementsLength === 0 ? 'No announcements yet' : 'No announcements for selected audience'}
          description={announcementsLength === 0
            ? "Create your first announcement to get started"
            : "Try selecting a different audience filter"
          }
          actionButton={announcementsLength === 0 ? { label: 'Create Announcement', onClick: () => setShowComposeForm(true) } : null}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: motionDelay }}
          className="space-y-4"
        >
          {filteredAnnouncements.map((announcement, index) => (
            <AnnouncementItem
              key={announcement.id}
              announcement={announcement}
              index={index}
              getAudienceBadgeColor={getAudienceBadgeColor}
              getTimeAgo={getTimeAgo}
              onDelete={onDeleteAnnouncement}
            />
          ))}
</motion.div>
      )}
    </>
  );
};

export default AnnouncementsListSection;