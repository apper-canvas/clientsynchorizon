import React, { useState, useEffect } from "react";
import { contactsService } from "@/services/api/contactsService";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";

const ContactModal = ({ isOpen, onClose, contact, companies, onContactSaved }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyId: "",
    title: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        companyId: contact.companyId?.toString() || "",
        title: contact.title || "",
        notes: contact.notes || ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        companyId: "",
        title: "",
        notes: ""
      });
    }
    setErrors({});
  }, [contact, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.companyId) {
      newErrors.companyId = "Company is required";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const contactData = {
        ...formData,
        companyId: parseInt(formData.companyId)
      };

      let savedContact;
      if (contact) {
        savedContact = await contactsService.update(contact.Id, contactData);
      } else {
        savedContact = await contactsService.create(contactData);
      }

      onContactSaved(savedContact);
    } catch (err) {
      console.error("Error saving contact:", err);
      setErrors({ general: "Failed to save contact. Please try again." });
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
      title={contact ? "Edit Contact" : "Add New Contact"}
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
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />

          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <FormField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
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
                  {company.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />
        </div>

        <FormField
          label="Notes"
          type="textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this contact..."
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
            {loading ? "Saving..." : contact ? "Update Contact" : "Create Contact"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactModal;