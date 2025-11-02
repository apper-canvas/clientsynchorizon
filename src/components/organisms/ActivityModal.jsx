import React, { useState, useEffect } from "react";
import { activitiesService } from "@/services/api/activitiesService";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";

const ActivityModal = ({ isOpen, onClose, activity, contacts, deals, onActivitySaved }) => {
const [formData, setFormData] = useState({
    type_c: "Task",
    subject_c: "",
    description_c: "",
    contactId_c: "",
    dealId_c: "",
    dueDate_c: "",
    completed_c: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const activityTypes = ["Call", "Email", "Meeting", "Task", "Note"];

  useEffect(() => {
if (activity) {
      const dueDate = activity.dueDate_c ? new Date(activity.dueDate_c) : new Date();
      const dateString = dueDate.toISOString().slice(0, 16);
      
      setFormData({
        type_c: activity.type_c || "Task",
        subject_c: activity.subject_c || "",
        description_c: activity.description_c || "",
        contactId_c: activity.contactId_c?.Id?.toString() || activity.contactId_c?.toString() || "",
        dealId_c: activity.dealId_c?.Id?.toString() || activity.dealId_c?.toString() || "",
        dueDate_c: dateString,
        completed_c: activity.completed_c || false
      });
    } else {
      const defaultDate = new Date();
      defaultDate.setHours(defaultDate.getHours() + 1);
      const dateString = defaultDate.toISOString().slice(0, 16);
setFormData({
        type_c: "Task",
        subject_c: "",
        description_c: "",
        contactId_c: "",
        dealId_c: "",
        dueDate_c: dateString,
        completed_c: false
      });
    }
    setErrors({});
  }, [activity, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
if (!formData.subject_c.trim()) {
      newErrors.subject_c = "Subject is required";
    }
    if (!formData.description_c.trim()) {
      newErrors.description_c = "Description is required";
    }
    if (!formData.dueDate_c) {
      newErrors.dueDate_c = "Due date is required";
    }
    if (!formData.type_c) {
      newErrors.type_c = "Activity type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
const activityData = {
        ...formData,
        contactId_c: formData.contactId_c ? parseInt(formData.contactId_c) : null,
        dealId_c: formData.dealId_c ? parseInt(formData.dealId_c) : null,
        dueDate_c: new Date(formData.dueDate_c).toISOString()
      };

      let savedActivity;
      if (activity) {
        savedActivity = await activitiesService.update(activity.Id, activityData);
      } else {
        savedActivity = await activitiesService.create(activityData);
      }

      onActivitySaved(savedActivity);
    } catch (err) {
      console.error("Error saving activity:", err);
      setErrors({ general: "Failed to save activity. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activity ? "Edit Activity" : "Add New Activity"}
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
            label="Activity Type"
            error={errors.type_c}
            required
          >
            <Select
              name="type_c"
              value={formData.type_c}
              onChange={handleChange}
              error={errors.type_c}
            >
              {activityTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Due Date & Time"
            name="dueDate_c"
            type="datetime-local"
            value={formData.dueDate_c}
            onChange={handleChange}
            error={errors.dueDate_c}
            required
          />
        </div>

        <FormField
label="Subject"
          name="subject_c"
          value={formData.subject_c}
          onChange={handleChange}
          error={errors.subject_c}
          required
          placeholder="Brief description of the activity"
        />

        <FormField
          label="Description"
          type="textarea"
          name="description_c"
          value={formData.description_c}
          onChange={handleChange}
          placeholder="Detailed description of what needs to be done..."
          error={errors.description_c}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
            label="Related Contact"
            error={errors.contactId_c}
          >
            <Select
              name="contactId_c"
              value={formData.contactId_c}
              onChange={handleChange}
              error={errors.contactId_c}
            >
              <option value="">Select a contact (optional)</option>
              {contacts.map(contact => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.firstName_c} {contact.lastName_c}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Related Deal"
            error={errors.dealId_c}
          >
            <Select
              name="dealId_c"
              value={formData.dealId_c}
              onChange={handleChange}
              error={errors.dealId_c}
            >
              <option value="">Select a deal (optional)</option>
              {deals.map(deal => (
                <option key={deal.Id} value={deal.Id}>
                  {deal.title_c}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

{activity && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="completed_c"
              name="completed_c"
              checked={formData.completed_c}
              onChange={handleChange}
              className="h-4 w-4 text-success-600 focus:ring-success-500 border-slate-300 rounded"
            />
            <label htmlFor="completed_c" className="ml-2 text-sm text-slate-700">
              Mark as completed
            </label>
          </div>
        )}

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
            {loading ? "Saving..." : activity ? "Update Activity" : "Create Activity"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ActivityModal;