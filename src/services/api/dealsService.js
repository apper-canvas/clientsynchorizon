import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const dealStages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

export const dealsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "companyId_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('deal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "companyId_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const createData = {
        Name: dealData.title_c,
        title_c: dealData.title_c,
        value_c: parseFloat(dealData.value_c),
        stage_c: dealData.stage_c,
        probability_c: parseInt(dealData.probability_c),
        closeDate_c: dealData.closeDate_c,
        notes_c: dealData.notes_c || "",
        createdAt_c: new Date().toISOString(),
        contactId_c: parseInt(dealData.contactId_c),
        companyId_c: parseInt(dealData.companyId_c)
      };

      const response = await apperClient.createRecord('deal_c', {
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
          console.error(`Failed to create ${failed.length} deal:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Deal created successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      toast.error("Failed to create deal. Please try again.");
      return null;
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateData = {
        Id: parseInt(id),
        Name: dealData.title_c,
        title_c: dealData.title_c,
        value_c: parseFloat(dealData.value_c),
        stage_c: dealData.stage_c,
        probability_c: parseInt(dealData.probability_c),
        closeDate_c: dealData.closeDate_c,
        notes_c: dealData.notes_c || "",
        contactId_c: parseInt(dealData.contactId_c),
        companyId_c: parseInt(dealData.companyId_c)
      };

      const response = await apperClient.updateRecord('deal_c', {
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
          console.error(`Failed to update ${failed.length} deal:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Deal updated successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
      toast.error("Failed to update deal. Please try again.");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('deal_c', {
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
          console.error(`Failed to delete ${failed.length} deal:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Deal deleted successfully!");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      toast.error("Failed to delete deal. Please try again.");
      return false;
    }
  },

  async updateStage(id, newStage) {
    try {
      if (!dealStages.includes(newStage)) {
        throw new Error("Invalid deal stage");
      }

      const apperClient = getApperClient();
      const probability = newStage === "Closed Won" ? 100 : newStage === "Closed Lost" ? 0 : null;
      
      const updateData = {
        Id: parseInt(id),
        stage_c: newStage
      };

      if (probability !== null) {
        updateData.probability_c = probability;
      }

      const response = await apperClient.updateRecord('deal_c', {
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
          console.error(`Failed to update deal stage:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Deal stage updated successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating deal stage:", error?.response?.data?.message || error);
      toast.error("Failed to update deal stage. Please try again.");
      return null;
    }
  },

  async getDealsByStage() {
    try {
      const deals = await this.getAll();
      const dealsByStage = {};
      
      dealStages.forEach(stage => {
        dealsByStage[stage] = deals.filter(deal => deal.stage_c === stage);
      });
      
      return dealsByStage;
    } catch (error) {
      console.error("Error fetching deals by stage:", error?.response?.data?.message || error);
      return {};
    }
  },

  getDealStages() {
    return [...dealStages];
  }
};