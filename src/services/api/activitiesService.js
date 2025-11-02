import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const activityTypes = ["Call", "Email", "Meeting", "Task", "Note"];

export const activitiesService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      Id: Math.max(...activities.map(a => a.Id), 0) + 1,
      completed: activityData.completed || false,
      createdAt: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async update(id, activityData) {
    await delay(350);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    activities[index] = {
      ...activities[index],
      ...activityData,
      Id: parseInt(id)
    };
    return { ...activities[index] };
  },

  async delete(id) {
    await delay(300);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    activities.splice(index, 1);
    return true;
  },

  async getByContactId(contactId) {
    await delay(200);
    return activities.filter(activity => activity.contactId === parseInt(contactId));
  },

  async getByDealId(dealId) {
    await delay(200);
    return activities.filter(activity => activity.dealId === parseInt(dealId));
  },

  async markCompleted(id) {
    await delay(250);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    activities[index] = {
      ...activities[index],
      completed: true
    };
    return { ...activities[index] };
  },

  async getUpcoming(limit = 10) {
    await delay(200);
    const now = new Date();
    return activities
      .filter(activity => !activity.completed && new Date(activity.dueDate) >= now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, limit);
  },

  async getOverdue() {
    await delay(200);
    const now = new Date();
    return activities.filter(activity => 
      !activity.completed && new Date(activity.dueDate) < now
    );
  },

  getActivityTypes() {
    return [...activityTypes];
  }
};