import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const activityTypes = ["Call", "Email", "Meeting", "Task", "Note"];

export const activitiesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('activity_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(activityData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const createData = {
        Name: activityData.subject_c,
        type_c: activityData.type_c,
        subject_c: activityData.subject_c,
        description_c: activityData.description_c,
        dueDate_c: activityData.dueDate_c,
        completed_c: activityData.completed_c || false,
        createdAt_c: new Date().toISOString(),
        contactId_c: activityData.contactId_c ? parseInt(activityData.contactId_c) : null,
        dealId_c: activityData.dealId_c ? parseInt(activityData.dealId_c) : null
      };

      const response = await apperClient.createRecord('activity_c', {
        records: [createData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activity:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Activity created successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      toast.error("Failed to create activity. Please try again.");
      return null;
    }
  },

  async update(id, activityData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateData = {
        Id: parseInt(id),
        Name: activityData.subject_c,
        type_c: activityData.type_c,
        subject_c: activityData.subject_c,
        description_c: activityData.description_c,
        dueDate_c: activityData.dueDate_c,
        completed_c: activityData.completed_c || false,
        contactId_c: activityData.contactId_c ? parseInt(activityData.contactId_c) : null,
        dealId_c: activityData.dealId_c ? parseInt(activityData.dealId_c) : null
      };

      const response = await apperClient.updateRecord('activity_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} activity:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Activity updated successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error);
      toast.error("Failed to update activity. Please try again.");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('activity_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activity:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Activity deleted successfully!");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error);
      toast.error("Failed to delete activity. Please try again.");
      return false;
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}}
        ],
        where: [{
          "FieldName": "contactId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contactId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by contact:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}}
        ],
        where: [{
          "FieldName": "dealId_c",
          "Operator": "EqualTo", 
          "Values": [parseInt(dealId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.response?.data?.message || error);
      return [];
    }
  },

  async markCompleted(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('activity_c', {
        records: [{
          Id: parseInt(id),
          completed_c: true
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to mark activity ${id} as completed:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error marking activity as completed:", error?.response?.data?.message || error);
      return null;
    }
  },

  async getUpcoming(limit = 10) {
    try {
      const apperClient = getApperClient();
      const now = new Date().toISOString();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}}
        ],
        where: [
          {
            "FieldName": "completed_c",
            "Operator": "EqualTo",
            "Values": [false]
          },
          {
            "FieldName": "dueDate_c",
            "Operator": "GreaterThanOrEqualTo",
            "Values": [now]
          }
        ],
        orderBy: [{
          "fieldName": "dueDate_c",
          "sorttype": "ASC"
        }],
        pagingInfo: {
          "limit": limit,
          "offset": 0
        }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming activities:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getOverdue() {
    try {
      const apperClient = getApperClient();
      const now = new Date().toISOString();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}}
        ],
        where: [
          {
            "FieldName": "completed_c",
            "Operator": "EqualTo",
            "Values": [false]
          },
          {
            "FieldName": "dueDate_c",
            "Operator": "LessThan",
            "Values": [now]
          }
        ],
        orderBy: [{
          "fieldName": "dueDate_c",
          "sorttype": "ASC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching overdue activities:", error?.response?.data?.message || error);
      return [];
    }
  },

  getActivityTypes() {
    return [...activityTypes];
  }
};