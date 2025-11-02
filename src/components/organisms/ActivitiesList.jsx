import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { activitiesService } from "@/services/api/activitiesService";
import { contactsService } from "@/services/api/contactsService";
import { dealsService } from "@/services/api/dealsService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent } from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ActivityModal from "./ActivityModal";
import { format, isAfter, isBefore } from "date-fns";

const ActivitiesList = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activitiesService.getAll(),
        contactsService.getAll(),
        dealsService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
      setFilteredActivities(activitiesData);
    } catch (err) {
      setError("Failed to load activities. Please try again.");
      console.error("Error loading activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = activities;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus === "completed") {
      filtered = filtered.filter(activity => activity.completed);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter(activity => !activity.completed);
    } else if (filterStatus === "overdue") {
      const now = new Date();
      filtered = filtered.filter(activity => 
        !activity.completed && isBefore(new Date(activity.dueDate), now)
      );
    }

    // Sort by due date
    filtered = filtered.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    setFilteredActivities(filtered);
  }, [searchTerm, filterStatus, activities]);

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleDeleteActivity = async (activityId) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      await activitiesService.delete(activityId);
      setActivities(activities.filter(a => a.Id !== activityId));
      toast.success("Activity deleted successfully");
    } catch (err) {
      toast.error("Failed to delete activity");
      console.error("Error deleting activity:", err);
    }
  };

  const handleActivitySaved = (savedActivity) => {
    if (selectedActivity) {
      setActivities(activities.map(a => 
        a.Id === savedActivity.Id ? savedActivity : a
      ));
      toast.success("Activity updated successfully");
    } else {
      setActivities([savedActivity, ...activities]);
      toast.success("Activity created successfully");
    }
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const handleToggleComplete = async (activity) => {
    try {
      if (activity.completed) {
        // If already completed, update to mark as incomplete
        const updatedActivity = await activitiesService.update(activity.Id, {
          ...activity,
          completed: false
        });
        setActivities(activities.map(a => 
          a.Id === activity.Id ? updatedActivity : a
        ));
        toast.success("Activity marked as incomplete");
      } else {
        // Mark as completed
        const completedActivity = await activitiesService.markCompleted(activity.Id);
        setActivities(activities.map(a => 
          a.Id === activity.Id ? completedActivity : a
        ));
        toast.success("Activity completed!");
      }
    } catch (err) {
      toast.error("Failed to update activity status");
      console.error("Error updating activity:", err);
    }
  };

  const getContactName = (contactId) => {
    if (!contactId) return "General Activity";
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : "Unknown Contact";
  };

  const getDealTitle = (dealId) => {
    if (!dealId) return null;
    const deal = deals.find(d => d.Id === dealId);
    return deal ? deal.title : "Unknown Deal";
  };

  const getActivityIcon = (type) => {
    const icons = {
      "Call": "Phone",
      "Email": "Mail", 
      "Meeting": "Calendar",
      "Task": "CheckSquare",
      "Note": "FileText"
    };
    return icons[type] || "CheckSquare";
  };

  const getActivityColor = (activity) => {
    if (activity.completed) return "success";
    
    const now = new Date();
    const dueDate = new Date(activity.dueDate);
    
    if (isBefore(dueDate, now)) return "danger";
    if (isBefore(dueDate, new Date(now.getTime() + 24 * 60 * 60 * 1000))) return "warning";
    return "primary";
  };

  const getStatusText = (activity) => {
    if (activity.completed) return "Completed";
    
    const now = new Date();
    const dueDate = new Date(activity.dueDate);
    
    if (isBefore(dueDate, now)) return "Overdue";
    if (isBefore(dueDate, new Date(now.getTime() + 24 * 60 * 60 * 1000))) return "Due Soon";
    return "Pending";
  };

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Activities</h2>
          <p className="text-slate-600 mt-1">
            Track tasks, calls, meetings, and follow-ups to stay organized
          </p>
        </div>
        <Button onClick={handleAddActivity} className="btn-gradient">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === "overdue" ? "danger" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("overdue")}
          >
            Overdue
          </Button>
          <Button
            variant={filterStatus === "completed" ? "success" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <Empty
          title="No activities found"
          description={searchTerm || filterStatus !== "all" ? 
            "No activities match your current filters. Try adjusting your search or filters." :
            "Get started by adding your first activity to track tasks and follow-ups."
          }
          icon="CheckSquare"
          actionLabel="Add First Activity"
          onAction={searchTerm || filterStatus !== "all" ? undefined : handleAddActivity}
          showAction={!searchTerm && filterStatus === "all"}
        />
      ) : (
        <div className="grid gap-4">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`card-hover ${activity.completed ? "opacity-75" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleToggleComplete(activity)}
                          className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-colors ${
                            activity.completed
                              ? "bg-success-500 border-success-500 text-white"
                              : "border-slate-300 hover:border-success-500"
                          }`}
                        >
                          {activity.completed && (
                            <ApperIcon name="Check" className="h-3 w-3" />
                          )}
                        </button>
                        <div className={`h-12 w-12 bg-gradient-to-br rounded-xl flex items-center justify-center ${
                          activity.completed 
                            ? "from-slate-500/10 to-slate-600/10" 
                            : "from-primary-500/10 to-primary-600/10"
                        }`}>
                          <ApperIcon 
                            name={getActivityIcon(activity.type)} 
                            className={`h-6 w-6 ${
                              activity.completed ? "text-slate-500" : "text-primary-600"
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`text-lg font-semibold ${
                            activity.completed ? "text-slate-500 line-through" : "text-slate-900"
                          }`}>
                            {activity.subject}
                          </h3>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge variant={getActivityColor(activity)} size="sm">
                              {getStatusText(activity)}
                            </Badge>
                            <Badge variant="outline" size="sm">
                              {activity.type}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-3">
                          {activity.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-500">
                          <div className="flex items-center">
                            <ApperIcon name="User" className="h-4 w-4 mr-2" />
                            {getContactName(activity.contactId)}
                          </div>
                          {activity.dealId && (
                            <div className="flex items-center">
                              <ApperIcon name="Target" className="h-4 w-4 mr-2" />
                              {getDealTitle(activity.dealId)}
                            </div>
                          )}
                          <div className="flex items-center">
                            <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                            Due: {format(new Date(activity.dueDate), "MMM d, yyyy h:mm a")}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditActivity(activity)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteActivity(activity.Id)}
                        className="text-error-600 hover:text-error-700"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Activity Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activity={selectedActivity}
        contacts={contacts}
        deals={deals}
        onActivitySaved={handleActivitySaved}
      />
    </div>
  );
};

export default ActivitiesList;