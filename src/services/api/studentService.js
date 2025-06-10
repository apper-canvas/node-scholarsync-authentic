import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const studentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'first_name', 'last_name', 'grade', 'email', 'phone', 
          'parent_contact', 'enrollment_date', 'Tags', 'Owner', 
          'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      };
      
      const response = await apperClient.fetchRecords('student', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform API response to match UI expectations
      return response.data.map(record => ({
        id: record.Id.toString(),
        firstName: record.first_name || '',
        lastName: record.last_name || '',
        grade: record.grade || 0,
        email: record.email || '',
        phone: record.phone || '',
        parentContact: record.parent_contact || '',
        enrollmentDate: record.enrollment_date || new Date().toISOString(),
        name: record.Name || `${record.first_name} ${record.last_name}`,
        tags: record.Tags || '',
        owner: record.Owner || '',
        createdOn: record.CreatedOn || '',
        createdBy: record.CreatedBy || '',
        modifiedOn: record.ModifiedOn || '',
        modifiedBy: record.ModifiedBy || ''
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          'Name', 'first_name', 'last_name', 'grade', 'email', 'phone', 
          'parent_contact', 'enrollment_date', 'Tags', 'Owner', 
          'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      };
      
      const response = await apperClient.getRecordById('student', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      const record = response.data;
      return {
        id: record.Id.toString(),
        firstName: record.first_name || '',
        lastName: record.last_name || '',
        grade: record.grade || 0,
        email: record.email || '',
        phone: record.phone || '',
        parentContact: record.parent_contact || '',
        enrollmentDate: record.enrollment_date || new Date().toISOString(),
        name: record.Name || `${record.first_name} ${record.last_name}`,
        tags: record.Tags || '',
        owner: record.Owner || '',
        createdOn: record.CreatedOn || '',
        createdBy: record.CreatedBy || '',
        modifiedOn: record.ModifiedOn || '',
        modifiedBy: record.ModifiedBy || ''
      };
    } catch (error) {
      console.error('Error fetching student:', error);
      toast.error('Failed to load student');
      return null;
    }
  },

  async create(studentData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const recordData = {
        Name: `${studentData.firstName} ${studentData.lastName}`,
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        grade: parseInt(studentData.grade),
        email: studentData.email,
        phone: studentData.phone || '',
        parent_contact: studentData.parentContact || '',
        enrollment_date: new Date().toISOString(),
        Tags: studentData.tags || '',
        Owner: studentData.owner || ''
      };
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.createRecord('student', params);
      
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
          firstName: record.first_name || '',
          lastName: record.last_name || '',
          grade: record.grade || 0,
          email: record.email || '',
          phone: record.phone || '',
          parentContact: record.parent_contact || '',
          enrollmentDate: record.enrollment_date || new Date().toISOString(),
          name: record.Name || `${record.first_name} ${record.last_name}`
        };
      }
      
      throw new Error('Failed to create student');
    } catch (error) {
      console.error('Error creating student:', error);
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
      
      if (updates.firstName || updates.lastName) {
        recordData.Name = `${updates.firstName || ''} ${updates.lastName || ''}`.trim();
      }
      if (updates.firstName !== undefined) recordData.first_name = updates.firstName;
      if (updates.lastName !== undefined) recordData.last_name = updates.lastName;
      if (updates.grade !== undefined) recordData.grade = parseInt(updates.grade);
      if (updates.email !== undefined) recordData.email = updates.email;
      if (updates.phone !== undefined) recordData.phone = updates.phone;
      if (updates.parentContact !== undefined) recordData.parent_contact = updates.parentContact;
      if (updates.enrollmentDate !== undefined) recordData.enrollment_date = updates.enrollmentDate;
      if (updates.tags !== undefined) recordData.Tags = updates.tags;
      if (updates.owner !== undefined) recordData.Owner = updates.owner;
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.updateRecord('student', params);
      
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
          firstName: record.first_name || '',
          lastName: record.last_name || '',
          grade: record.grade || 0,
          email: record.email || '',
          phone: record.phone || '',
          parentContact: record.parent_contact || '',
          enrollmentDate: record.enrollment_date || new Date().toISOString(),
          name: record.Name || `${record.first_name} ${record.last_name}`
        };
      }
      
      throw new Error('Failed to update student');
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('student', params);
      
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
      console.error('Error deleting student:', error);
      throw error;
    }
  }
};

export default studentService;