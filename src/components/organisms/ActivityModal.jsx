import React, { useState, useEffect } from "react";
import { activitiesService } from "@/services/api/activitiesService";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";

const ActivityModal = ({ isOpen, onClose, activity, contacts, deals, onActivitySaved }) => {
  const [formData, setFormData] = useState({
    type: "Task",
    subject: "",
    description: "",
    contactId: "",
    dealId: "",
    dueDate: "",
    completed: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const activityTypes = ["Call", "Email", "Meeting", "Task", "Note"];

  useEffect(() => {
    if (activity) {
      const dueDate = activity.dueDate ? new Date(activity.dueDate) : new Date();
      const dateString = dueDate.toISOString().slice(0, 16);
      
      setFormData({
        type: activity.type || "Task",
        subject: activity.subject || "",
        description: activity.description || "",
        contactId: activity.contactId?.toString() || "",
        dealId: activity.dealId?.toString() || "",
        dueDate: dateString,
        completed: activity.completed || false
      });
    } else {
      const defaultDate = new Date();
      defaultDate.setHours(defaultDate.getHours() + 1);
      const dateString = defaultDate.toISOString().slice(0, 16);
      
      setFormData({
        type: "Task",
        subject: "",
        description: "",
        contactId: "",
        dealId: "",
        dueDate: dateString,
        completed: false
      });
    }
    setErrors({});
  }, [activity, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    if (!formData.type) {
      newErrors.type = "Activity type is required";
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
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        dueDate: new Date(formData.dueDate).toISOString()
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
            error={errors.type}
            required
          >
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              error={errors.type}
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
            name="dueDate"
            type="datetime-local"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
            required
          />
        </div>

        <FormField
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          error={errors.subject}
          required
          placeholder="Brief description of the activity"
        />

        <FormField
          label="Description"
          type="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of what needs to be done..."
          error={errors.description}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Related Contact"
            error={errors.contactId}
          >
            <Select
              name="contactId"
              value={formData.contactId}
              onChange={handleChange}
              error={errors.contactId}
            >
              <option value="">Select a contact (optional)</option>
              {contacts.map(contact => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Related Deal"
            error={errors.dealId}
          >
            <Select
              name="dealId"
              value={formData.dealId}
              onChange={handleChange}
              error={errors.dealId}
            >
              <option value="">Select a deal (optional)</option>
              {deals.map(deal => (
                <option key={deal.Id} value={deal.Id}>
                  {deal.title}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        {activity && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="h-4 w-4 text-success-600 focus:ring-success-500 border-slate-300 rounded"
            />
            <label htmlFor="completed" className="ml-2 text-sm text-slate-700">
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