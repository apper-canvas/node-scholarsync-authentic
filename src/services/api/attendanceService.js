import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const attendanceService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'student_id', 'class_id', 'date', 'status', 'notes',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      };
      
      const response = await apperClient.fetchRecords('attendance', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform API response to match UI expectations
      return response.data.map(record => ({
        id: record.Id.toString(),
        name: record.Name || '',
        studentId: record.student_id ? record.student_id.toString() : '',
        classId: record.class_id ? record.class_id.toString() : '',
        date: record.date || new Date().toISOString(),
        status: record.status || 'present',
        notes: record.notes || '',
        tags: record.Tags || '',
        owner: record.Owner || '',
        createdOn: record.CreatedOn || '',
        createdBy: record.CreatedBy || '',
        modifiedOn: record.ModifiedOn || '',
        modifiedBy: record.ModifiedBy || ''
      }));
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast.error('Failed to load attendance records');
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'student_id', 'class_id', 'date', 'status', 'notes',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      };
      
      const response = await apperClient.getRecordById('attendance', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      const record = response.data;
      return {
        id: record.Id.toString(),
        name: record.Name || '',
        studentId: record.student_id ? record.student_id.toString() : '',
        classId: record.class_id ? record.class_id.toString() : '',
        date: record.date || new Date().toISOString(),
        status: record.status || 'present',
        notes: record.notes || '',
        tags: record.Tags || '',
        owner: record.Owner || '',
        createdOn: record.CreatedOn || '',
        createdBy: record.CreatedBy || '',
        modifiedOn: record.ModifiedOn || '',
        modifiedBy: record.ModifiedBy || ''
      };
    } catch (error) {
      console.error('Error fetching attendance record:', error);
      toast.error('Failed to load attendance record');
      return null;
    }
  },

  async create(attendanceData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const recordData = {
        Name: `Attendance - ${attendanceData.status || 'present'}`,
        student_id: attendanceData.studentId ? parseInt(attendanceData.studentId) : null,
        class_id: attendanceData.classId ? parseInt(attendanceData.classId) : null,
        date: attendanceData.date || new Date().toISOString(),
        status: attendanceData.status || 'present',
        notes: attendanceData.notes || '',
        Tags: attendanceData.tags || '',
        Owner: attendanceData.owner || ''
      };
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.createRecord('attendance', params);
      
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
          studentId: record.student_id ? record.student_id.toString() : '',
          classId: record.class_id ? record.class_id.toString() : '',
          date: record.date || new Date().toISOString(),
          status: record.status || 'present',
          notes: record.notes || ''
        };
      }
      
      throw new Error('Failed to create attendance record');
    } catch (error) {
      console.error('Error creating attendance record:', error);
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
      
      if (updates.status !== undefined) {
        recordData.Name = `Attendance - ${updates.status}`;
        recordData.status = updates.status;
      }
      if (updates.studentId !== undefined) {
        recordData.student_id = updates.studentId ? parseInt(updates.studentId) : null;
      }
      if (updates.classId !== undefined) {
        recordData.class_id = updates.classId ? parseInt(updates.classId) : null;
      }
      if (updates.date !== undefined) recordData.date = updates.date;
      if (updates.notes !== undefined) recordData.notes = updates.notes;
      if (updates.tags !== undefined) recordData.Tags = updates.tags;
      if (updates.owner !== undefined) recordData.Owner = updates.owner;
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.updateRecord('attendance', params);
      
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
          studentId: record.student_id ? record.student_id.toString() : '',
          classId: record.class_id ? record.class_id.toString() : '',
          date: record.date || new Date().toISOString(),
          status: record.status || 'present',
          notes: record.notes || ''
        };
      }
      
      throw new Error('Failed to update attendance record');
    } catch (error) {
      console.error('Error updating attendance record:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('attendance', params);
      
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
      console.error('Error deleting attendance record:', error);
      throw error;
    }
  }
};

export default attendanceService;