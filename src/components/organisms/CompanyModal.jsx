import React, { useState, useEffect } from "react";
import { companiesService } from "@/services/api/companiesService";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";

const CompanyModal = ({ isOpen, onClose, company, onCompanySaved }) => {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size: "",
    website: "",
    address: "",
    notes: ""
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
        name: company.name || "",
        industry: company.industry || "",
        size: company.size || "",
        website: company.website || "",
        address: company.address || "",
        notes: company.notes || ""
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
    
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }
    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }
    if (!formData.size) {
      newErrors.size = "Company size is required";
    }
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = "Please enter a valid website URL (starting with http:// or https://)";
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
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Enter company name"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Industry"
            error={errors.industry}
            required
          >
            <Select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              error={errors.industry}
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
            error={errors.size}
            required
          >
            <Select
              name="size"
              value={formData.size}
              onChange={handleChange}
              error={errors.size}
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
          name="website"
          value={formData.website}
          onChange={handleChange}
          error={errors.website}
          placeholder="https://example.com"
        />

        <FormField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="Company address"
        />

        <FormField
          label="Notes"
          type="textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this company..."
          error={errors.notes}
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