import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const classService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'subject', 'period', 'room', 'student_ids', 'teacher_id',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      };
      
      const response = await apperClient.fetchRecords('class', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform API response to match UI expectations
      return response.data.map(record => ({
        id: record.Id.toString(),
        name: record.Name || '',
        subject: record.subject || '',
        period: record.period || 0,
        room: record.room || '',
        studentIds: record.student_ids ? record.student_ids.split(',').map(id => id.trim()) : [],
        teacherId: record.teacher_id || '',
        tags: record.Tags || '',
        owner: record.Owner || '',
        createdOn: record.CreatedOn || '',
        createdBy: record.CreatedBy || '',
        modifiedOn: record.ModifiedOn || '',
        modifiedBy: record.ModifiedBy || ''
      }));
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'subject', 'period', 'room', 'student_ids', 'teacher_id',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      };
      
      const response = await apperClient.getRecordById('class', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      const record = response.data;
      return {
        id: record.Id.toString(),
        name: record.Name || '',
        subject: record.subject || '',
        period: record.period || 0,
        room: record.room || '',
        studentIds: record.student_ids ? record.student_ids.split(',').map(id => id.trim()) : [],
        teacherId: record.teacher_id || '',
        tags: record.Tags || '',
        owner: record.Owner || '',
        createdOn: record.CreatedOn || '',
        createdBy: record.CreatedBy || '',
        modifiedOn: record.ModifiedOn || '',
        modifiedBy: record.ModifiedBy || ''
      };
    } catch (error) {
      console.error('Error fetching class:', error);
      toast.error('Failed to load class');
      return null;
    }
  },

  async create(classData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const recordData = {
        Name: classData.name || '',
        subject: classData.subject || '',
        period: parseInt(classData.period) || 0,
        room: classData.room || '',
        student_ids: Array.isArray(classData.studentIds) ? classData.studentIds.join(',') : '',
        teacher_id: classData.teacherId ? parseInt(classData.teacherId) : null,
        Tags: classData.tags || '',
        Owner: classData.owner || ''
      };
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.createRecord('class', params);
      
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
          subject: record.subject || '',
          period: record.period || 0,
          room: record.room || '',
          studentIds: record.student_ids ? record.student_ids.split(',').map(id => id.trim()) : [],
          teacherId: record.teacher_id || ''
        };
      }
      
      throw new Error('Failed to create class');
    } catch (error) {
      console.error('Error creating class:', error);
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
      
      if (updates.name !== undefined) recordData.Name = updates.name;
      if (updates.subject !== undefined) recordData.subject = updates.subject;
      if (updates.period !== undefined) recordData.period = parseInt(updates.period);
      if (updates.room !== undefined) recordData.room = updates.room;
      if (updates.studentIds !== undefined) {
        recordData.student_ids = Array.isArray(updates.studentIds) ? updates.studentIds.join(',') : '';
      }
      if (updates.teacherId !== undefined) {
        recordData.teacher_id = updates.teacherId ? parseInt(updates.teacherId) : null;
      }
      if (updates.tags !== undefined) recordData.Tags = updates.tags;
      if (updates.owner !== undefined) recordData.Owner = updates.owner;
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.updateRecord('class', params);
      
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
          subject: record.subject || '',
          period: record.period || 0,
          room: record.room || '',
          studentIds: record.student_ids ? record.student_ids.split(',').map(id => id.trim()) : [],
          teacherId: record.teacher_id || ''
        };
      }
      
      throw new Error('Failed to update class');
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('class', params);
      
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
      console.error('Error deleting class:', error);
      throw error;
    }
  }
};

export default classService;