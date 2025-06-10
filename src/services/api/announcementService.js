import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const announcementService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'title', 'content', 'author', 'audience', 'created_at',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ],
        orderBy: [
          {
            fieldName: 'created_at',
            SortType: 'DESC'
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('announcement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform API response to match UI expectations
      return response.data.map(record => ({
        id: record.Id.toString(),
        name: record.Name || '',
        title: record.title || '',
        content: record.content || '',
        author: record.author || '',
        audience: record.audience || 'all',
        createdAt: record.created_at || record.CreatedOn || new Date().toISOString(),
        tags: record.Tags || '',
        owner: record.Owner || '',
        createdBy: record.CreatedBy || '',
        modifiedOn: record.ModifiedOn || '',
        modifiedBy: record.ModifiedBy || ''
      }));
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'title', 'content', 'author', 'audience', 'created_at',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      };
      
      const response = await apperClient.getRecordById('announcement', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      const record = response.data;
      return {
        id: record.Id.toString(),
        name: record.Name || '',
        title: record.title || '',
        content: record.content || '',
        author: record.author || '',
        audience: record.audience || 'all',
        createdAt: record.created_at || record.CreatedOn || new Date().toISOString(),
        tags: record.Tags || '',
        owner: record.Owner || '',
        createdBy: record.CreatedBy || '',
        modifiedOn: record.ModifiedOn || '',
        modifiedBy: record.ModifiedBy || ''
      };
    } catch (error) {
      console.error('Error fetching announcement:', error);
      toast.error('Failed to load announcement');
      return null;
    }
  },

  async create(announcementData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const recordData = {
        Name: announcementData.title || 'Announcement',
        title: announcementData.title || '',
        content: announcementData.content || '',
        author: announcementData.author || '',
        audience: announcementData.audience || 'all',
        created_at: new Date().toISOString(),
        Tags: announcementData.tags || '',
        Owner: announcementData.owner || ''
      };
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.createRecord('announcement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        const record = successfulRecords[0].data;
        return {
          id: record.Id.toString(),
          name: record.Name || '',
          title: record.title || '',
          content: record.content || '',
          author: record.author || '',
          audience: record.audience || 'all',
          createdAt: record.created_at || new Date().toISOString()
        };
      }
      
      throw new Error('Failed to create announcement');
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const recordData = {
        Id: parseInt(id)
      };
      
      if (updates.title !== undefined) {
        recordData.Name = updates.title;
        recordData.title = updates.title;
      }
      if (updates.content !== undefined) recordData.content = updates.content;
      if (updates.author !== undefined) recordData.author = updates.author;
      if (updates.audience !== undefined) recordData.audience = updates.audience;
      if (updates.createdAt !== undefined) recordData.created_at = updates.createdAt;
      if (updates.tags !== undefined) recordData.Tags = updates.tags;
      if (updates.owner !== undefined) recordData.Owner = updates.owner;
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.updateRecord('announcement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        const record = successfulUpdates[0].data;
        return {
          id: record.Id.toString(),
          name: record.Name || '',
          title: record.title || '',
          content: record.content || '',
          author: record.author || '',
          audience: record.audience || 'all',
          createdAt: record.created_at || new Date().toISOString()
        };
      }
      
      throw new Error('Failed to update announcement');
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('announcement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulDeletions.length > 0;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  }
};

export default announcementService;