import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

export const companiesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('company_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('company_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(companyData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const createData = {
        Name: companyData.name_c,
        name_c: companyData.name_c,
        industry_c: companyData.industry_c,
        size_c: companyData.size_c,
        website_c: companyData.website_c || "",
        address_c: companyData.address_c || "",
        notes_c: companyData.notes_c || "",
        createdAt_c: new Date().toISOString()
      };

      const response = await apperClient.createRecord('company_c', {
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
          console.error(`Failed to create ${failed.length} company:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Company created successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error);
      toast.error("Failed to create company. Please try again.");
      return null;
    }
  },

  async update(id, companyData) {
    try {
      const apperClient = getApperClient();
      
      // Only include Updateable fields
      const updateData = {
        Id: parseInt(id),
        Name: companyData.name_c,
        name_c: companyData.name_c,
        industry_c: companyData.industry_c,
        size_c: companyData.size_c,
        website_c: companyData.website_c || "",
        address_c: companyData.address_c || "",
        notes_c: companyData.notes_c || ""
      };

      const response = await apperClient.updateRecord('company_c', {
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
          console.error(`Failed to update ${failed.length} company:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Company updated successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error);
      toast.error("Failed to update company. Please try again.");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('company_c', {
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
          console.error(`Failed to delete ${failed.length} company:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Company deleted successfully!");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error);
      toast.error("Failed to delete company. Please try again.");
      return false;
    }
  },

  async searchCompanies(query) {
    try {
      if (!query) return await this.getAll();
      
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('company_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "name_c", "operator": "Contains", "values": [query]},
                {"fieldName": "industry_c", "operator": "Contains", "values": [query]},
                {"fieldName": "size_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching companies:", error?.response?.data?.message || error);
      return [];
return [];
    }
  }
};