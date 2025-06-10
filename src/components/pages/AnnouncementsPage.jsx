import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { announcementService } from '@/services';

import PageHeader from '@/components/organisms/PageHeader';
import LoadingOverlay from '@/components/organisms/LoadingOverlay';
import ErrorDisplayPage from '@/components/organisms/ErrorDisplayPage';
import ComposeAnnouncementForm from '@/components/organisms/ComposeAnnouncementForm';
import AnnouncementsListSection from '@/components/organisms/AnnouncementsListSection';
import Button from '@/components/atoms/Button';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [audienceFilter, setAudienceFilter] = useState('');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await announcementService.getAll();
      setAnnouncements(data);
    } catch (err) {
      setError(err.message || 'Failed to load announcements');
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (announcementData) => {
    try {
      const newAnnouncement = await announcementService.create(announcementData);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      setShowComposeForm(false);
      toast.success('Announcement created successfully');
    } catch (error) {
      toast.error('Failed to create announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementService.delete(id);
        setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
        toast.success('Announcement deleted successfully');
      } catch (error) {
        toast.error('Failed to delete announcement');
      }
    }
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    audienceFilter === '' || announcement.audience === audienceFilter
  );

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return <ErrorDisplayPage message={error} onRetry={loadAnnouncements} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Create and manage school announcements"
        actionButton={{
          label: 'Compose Announcement',
          onClick: () => setShowComposeForm(true),
          icon: 'Plus'
        }}
      />

      <AnnouncementsListSection
        filteredAnnouncements={filteredAnnouncements}
        audienceFilter={audienceFilter}
        setAudienceFilter={setAudienceFilter}
        onDeleteAnnouncement={handleDeleteAnnouncement}
        announcementsLength={announcements.length}
        setShowComposeForm={setShowComposeForm}
        motionDelay={0.2}
      />

      <AnimatePresence>
        {showComposeForm && (
          <ComposeAnnouncementForm
            onClose={() => setShowComposeForm(false)}
            onSubmit={handleCreateAnnouncement}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementsPage;