import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const gradeService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'assignment_name', 'score', 'max_score', 'date', 'student_id', 'class_id',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      };
      
      const response = await apperClient.fetchRecords('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform API response to match UI expectations
      return response.data.map(record => ({
        id: record.Id.toString(),
        name: record.Name || '',
        assignmentName: record.assignment_name || '',
        score: parseFloat(record.score) || 0,
        maxScore: parseFloat(record.max_score) || 100,
        date: record.date || new Date().toISOString(),
        studentId: record.student_id ? record.student_id.toString() : '',
        classId: record.class_id ? record.class_id.toString() : '',
        tags: record.Tags || '',
        owner: record.Owner || '',
        createdOn: record.CreatedOn || '',
        createdBy: record.CreatedBy || '',
        modifiedOn: record.ModifiedOn || '',
        modifiedBy: record.ModifiedBy || ''
      }));
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast.error('Failed to load grades');
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'assignment_name', 'score', 'max_score', 'date', 'student_id', 'class_id',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      };
      
      const response = await apperClient.getRecordById('grade', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      const record = response.data;
      return {
        id: record.Id.toString(),
        name: record.Name || '',
        assignmentName: record.assignment_name || '',
        score: parseFloat(record.score) || 0,
        maxScore: parseFloat(record.max_score) || 100,
        date: record.date || new Date().toISOString(),
        studentId: record.student_id ? record.student_id.toString() : '',
        classId: record.class_id ? record.class_id.toString() : '',
        tags: record.Tags || '',
        owner: record.Owner || '',
        createdOn: record.CreatedOn || '',
        createdBy: record.CreatedBy || '',
        modifiedOn: record.ModifiedOn || '',
        modifiedBy: record.ModifiedBy || ''
      };
    } catch (error) {
      console.error('Error fetching grade:', error);
      toast.error('Failed to load grade');
      return null;
    }
  },

  async create(gradeData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const recordData = {
        Name: gradeData.assignmentName || 'Grade Record',
        assignment_name: gradeData.assignmentName || '',
        score: parseFloat(gradeData.score) || 0,
        max_score: parseFloat(gradeData.maxScore) || 100,
        date: gradeData.date || new Date().toISOString(),
        student_id: gradeData.studentId ? parseInt(gradeData.studentId) : null,
        class_id: gradeData.classId ? parseInt(gradeData.classId) : null,
        Tags: gradeData.tags || '',
        Owner: gradeData.owner || ''
      };
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.createRecord('grade', params);
      
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
          assignmentName: record.assignment_name || '',
          score: parseFloat(record.score) || 0,
          maxScore: parseFloat(record.max_score) || 100,
          date: record.date || new Date().toISOString(),
          studentId: record.student_id ? record.student_id.toString() : '',
          classId: record.class_id ? record.class_id.toString() : ''
        };
      }
      
      throw new Error('Failed to create grade');
    } catch (error) {
      console.error('Error creating grade:', error);
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
      
      if (updates.assignmentName !== undefined) {
        recordData.Name = updates.assignmentName;
        recordData.assignment_name = updates.assignmentName;
      }
      if (updates.score !== undefined) recordData.score = parseFloat(updates.score);
      if (updates.maxScore !== undefined) recordData.max_score = parseFloat(updates.maxScore);
      if (updates.date !== undefined) recordData.date = updates.date;
      if (updates.studentId !== undefined) {
        recordData.student_id = updates.studentId ? parseInt(updates.studentId) : null;
      }
      if (updates.classId !== undefined) {
        recordData.class_id = updates.classId ? parseInt(updates.classId) : null;
      }
      if (updates.tags !== undefined) recordData.Tags = updates.tags;
      if (updates.owner !== undefined) recordData.Owner = updates.owner;
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.updateRecord('grade', params);
      
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
          assignmentName: record.assignment_name || '',
          score: parseFloat(record.score) || 0,
          maxScore: parseFloat(record.max_score) || 100,
          date: record.date || new Date().toISOString(),
          studentId: record.student_id ? record.student_id.toString() : '',
          classId: record.class_id ? record.class_id.toString() : ''
        };
      }
      
      throw new Error('Failed to update grade');
    } catch (error) {
      console.error('Error updating grade:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('grade', params);
      
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
      console.error('Error deleting grade:', error);
      throw error;
    }
  }
};

export default gradeService;