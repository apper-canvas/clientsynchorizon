import React, { useState, useEffect } from "react";
import { dealsService } from "@/services/api/dealsService";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";

const DealModal = ({ isOpen, onClose, deal, contacts, companies, onDealSaved }) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "Lead",
    contactId: "",
    companyId: "",
    probability: "",
    closeDate: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

  useEffect(() => {
    if (deal) {
setFormData({
        title_c: deal.title_c || "",
        value_c: deal.value_c?.toString() || "",
        stage_c: deal.stage_c || "Lead",
        contactId_c: deal.contactId_c?.Id?.toString() || deal.contactId_c?.toString() || "",
        companyId_c: deal.companyId_c?.Id?.toString() || deal.companyId_c?.toString() || "",
        probability_c: deal.probability_c?.toString() || "",
        closeDate_c: deal.closeDate_c ? deal.closeDate_c.split('T')[0] : "",
        notes_c: deal.notes_c || ""
      });
    } else {
      setFormData({
        title: "",
        value: "",
        stage: "Lead",
        contactId: "",
        companyId: "",
        probability: "",
        closeDate: "",
        notes: ""
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }
    if (!formData.value || isNaN(formData.value) || parseFloat(formData.value) <= 0) {
      newErrors.value = "Please enter a valid deal value";
    }
    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }
    if (!formData.companyId) {
      newErrors.companyId = "Company is required";
    }
    if (!formData.probability || isNaN(formData.probability) || 
        parseInt(formData.probability) < 0 || parseInt(formData.probability) > 100) {
      newErrors.probability = "Probability must be between 0 and 100";
    }
    if (!formData.closeDate) {
      newErrors.closeDate = "Expected close date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
contactId_c: parseInt(formData.contactId_c),
        companyId_c: parseInt(formData.companyId_c),
        probability_c: parseInt(formData.probability_c),
        closeDate_c: new Date(formData.closeDate_c).toISOString()
      };

      let savedDeal;
      if (deal) {
        savedDeal = await dealsService.update(deal.Id, dealData);
      } else {
        savedDeal = await dealsService.create(dealData);
      }

      onDealSaved(savedDeal);
    } catch (err) {
      console.error("Error saving deal:", err);
      setErrors({ general: "Failed to save deal. Please try again." });
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

  // Filter contacts based on selected company
const filteredContacts = formData.companyId_c ? 
    contacts.filter(contact => (contact.companyId_c?.Id || contact.companyId_c) === parseInt(formData.companyId_c)) :
    contacts;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? "Edit Deal" : "Add New Deal"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errors.general && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Deal Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            placeholder="Enter deal title"
          />

          <FormField
            label="Deal Value ($)"
            name="value"
            type="number"
            value={formData.value}
            onChange={handleChange}
            error={errors.value}
            required
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Stage"
            error={errors.stage}
            required
          >
            <Select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              error={errors.stage}
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Probability (%)"
            name="probability"
            type="number"
            value={formData.probability}
            onChange={handleChange}
            error={errors.probability}
            required
            placeholder="0"
            min="0"
            max="100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Company"
            error={errors.companyId}
            required
          >
            <Select
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              error={errors.companyId}
            >
              <option value="">Select a company</option>
              {companies.map(company => (
<option key={company.Id} value={company.Id}>
                  {company.name_c}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Related Contact"
            error={errors.contactId_c}
            required
          >
            <Select
              name="contactId_c"
              value={formData.contactId_c}
              onChange={handleChange}
              error={errors.contactId_c}
            >
              <option value="">Select a contact</option>
              {filteredContacts.map(contact => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.firstName_c} {contact.lastName_c}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <FormField
          label="Expected Close Date"
          name="closeDate"
          type="date"
          value={formData.closeDate}
          onChange={handleChange}
          error={errors.closeDate}
          required
        />

        <FormField
          label="Notes"
          type="textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this deal..."
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
            {loading ? "Saving..." : deal ? "Update Deal" : "Create Deal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DealModal;