import React, { useEffect, useState } from "react";
import { contactsService } from "@/services/api/contactsService";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";

const ContactModal = ({ isOpen, onClose, contact, companies, onContactSaved }) => {
  const [formData, setFormData] = useState({
firstName_c: "",
    lastName_c: "",
    email_c: "",
    phone_c: "",
    companyId_c: "",
    title_c: "",
    notes_c: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
setFormData({
        firstName_c: contact.firstName_c || "",
        lastName_c: contact.lastName_c || "",
        email_c: contact.email_c || "",
        phone_c: contact.phone_c || "",
        companyId_c: contact.companyId_c?.Id?.toString() || contact.companyId_c?.toString() || "",
        title_c: contact.title_c || "",
        notes_c: contact.notes_c || ""
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
    
if (!formData.firstName_c.trim()) {
      newErrors.firstName_c = "First name is required";
    }
    if (!formData.lastName_c.trim()) {
      newErrors.lastName_c = "Last name is required";
    }
    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email";
    }
    if (!formData.phone_c.trim()) {
      newErrors.phone_c = "Phone number is required";
    }
    if (!formData.companyId_c) {
      newErrors.companyId_c = "Company is required";
    }
    if (!formData.title_c.trim()) {
      newErrors.title_c = "Job title is required";
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
        companyId_c: parseInt(formData.companyId_c)
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
    size="lg">
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errors.general && <div
            className="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
            {errors.general}
        </div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                label="First Name"
                name="firstName_c"
                value={formData.firstName_c}
                onChange={handleChange}
                error={errors.firstName_c}
                required />
            <FormField
                label="Last Name"
                name="lastName_c"
                value={formData.lastName_c}
                onChange={handleChange}
                error={errors.lastName_c}
                required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                label="Email"
                name="email_c"
                type="email"
                value={formData.email_c}
                onChange={handleChange}
                error={errors.email_c}
                required />
            <FormField
                label="Phone"
                name="phone_c"
                value={formData.phone_c}
                onChange={handleChange}
                error={errors.phone_c}
                required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Company" error={errors.companyId_c} required>
                <Select
                    name="companyId_c"
                    value={formData.companyId_c}
                    onChange={handleChange}
                    error={errors.companyId_c}>
                    <option value="">Select a company</option>
                    {companies.map(company => <option key={company.Id} value={company.Id}>
                        {company.name_c}
                    </option>)}
                </Select>
            </FormField>
            <FormField
                label="Job Title"
                name="title_c"
                value={formData.title_c}
                onChange={handleChange}
                error={errors.title_c}
                required
                placeholder="e.g., Software Engineer, Marketing Director" />
            <FormField
                label="Notes"
                type="textarea"
                name="notes_c"
                value={formData.notes_c}
                onChange={handleChange}
                placeholder="Additional notes about this contact..."
                error={errors.notes_c} />
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel
                              </Button>
                <Button type="submit" className="btn-gradient" disabled={loading}>
                    {loading ? "Saving..." : contact ? "Update Contact" : "Create Contact"}
                </Button>
            </div>
        </div></form>
</Modal>
  );
};

export default ContactModal;