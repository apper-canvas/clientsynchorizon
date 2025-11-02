import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const dealStages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

export const dealsService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const newDeal = {
      ...dealData,
      Id: Math.max(...deals.map(d => d.Id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals[index] = {
      ...deals[index],
      ...dealData,
      Id: parseInt(id)
    };
    return { ...deals[index] };
  },

  async delete(id) {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals.splice(index, 1);
    return true;
  },

  async updateStage(id, newStage) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    if (!dealStages.includes(newStage)) {
      throw new Error("Invalid deal stage");
    }
    deals[index] = {
      ...deals[index],
      stage: newStage,
      probability: newStage === "Closed Won" ? 100 : newStage === "Closed Lost" ? 0 : deals[index].probability
    };
    return { ...deals[index] };
  },

  async getDealsByStage() {
    await delay(200);
    const dealsByStage = {};
    dealStages.forEach(stage => {
      dealsByStage[stage] = deals.filter(deal => deal.stage === stage);
    });
    return dealsByStage;
  },

  getDealStages() {
    return [...dealStages];
  }
};