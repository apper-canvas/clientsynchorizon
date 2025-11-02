import React, { useState, useEffect } from "react";
import { companiesService } from "@/services/api/companiesService";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";

const CompanyModal = ({ isOpen, onClose, company, onCompanySaved }) => {
const [formData, setFormData] = useState({
    name_c: "",
    industry_c: "",
    size_c: "",
    website_c: "",
    address_c: "",
    notes_c: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const industries = [
    "Technology",
    "Software Development", 
    "SaaS",
    "Retail",
    "Healthcare",
    "Financial Services",
    "Consulting",
    "Manufacturing",
    "Education",
    "Logistics",
    "Other"
  ];

  const companySizes = [
    "Small",
    "Mid-Market", 
    "Large",
    "Enterprise"
  ];

  useEffect(() => {
if (company) {
      setFormData({
        name_c: company.name_c || "",
        industry_c: company.industry_c || "",
        size_c: company.size_c || "",
        website_c: company.website_c || "",
        address_c: company.address_c || "",
        notes_c: company.notes_c || ""
      });
    } else {
      setFormData({
        name: "",
        industry: "",
        size: "",
        website: "",
        address: "",
        notes: ""
      });
    }
    setErrors({});
  }, [company, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
if (!formData.name_c.trim()) {
      newErrors.name_c = "Company name is required";
    }
    if (!formData.industry_c) {
      newErrors.industry_c = "Industry is required";
    }
    if (!formData.size_c) {
      newErrors.size_c = "Company size is required";
    }
    if (formData.website_c && !formData.website_c.match(/^https?:\/\/.+/)) {
      newErrors.website_c = "Please enter a valid website URL (starting with http:// or https://)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const companyData = { ...formData };

      let savedCompany;
      if (company) {
        savedCompany = await companiesService.update(company.Id, companyData);
      } else {
        savedCompany = await companiesService.create(companyData);
      }

      onCompanySaved(savedCompany);
    } catch (err) {
      console.error("Error saving company:", err);
      setErrors({ general: "Failed to save company. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={company ? "Edit Company" : "Add New Company"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errors.general && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
            {errors.general}
          </div>
        )}

<FormField
          label="Company Name"
          name="name_c"
          value={formData.name_c}
          onChange={handleChange}
          error={errors.name_c}
          required
          placeholder="Enter company name"
        />

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Industry"
            error={errors.industry_c}
            required
          >
            <Select
              name="industry_c"
              value={formData.industry_c}
              onChange={handleChange}
              error={errors.industry_c}
            >
              <option value="">Select an industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Company Size"
            error={errors.size_c}
            required
          >
            <Select
              name="size_c"
              value={formData.size_c}
              onChange={handleChange}
              error={errors.size_c}
            >
              <option value="">Select company size</option>
              {companySizes.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

<FormField
          label="Website"
          name="website_c"
          value={formData.website_c}
          onChange={handleChange}
          error={errors.website_c}
          placeholder="https://example.com"
        />

        <FormField
          label="Address"
          name="address_c"
          value={formData.address_c}
          onChange={handleChange}
          error={errors.address_c}
          placeholder="Company address"
        />

        <FormField
          label="Notes"
          type="textarea"
          name="notes_c"
          value={formData.notes_c}
          onChange={handleChange}
          placeholder="Additional notes about this company..."
          error={errors.notes_c}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn-gradient"
            disabled={loading}
          >
            {loading ? "Saving..." : company ? "Update Company" : "Create Company"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CompanyModal;