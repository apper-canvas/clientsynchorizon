import companiesData from "@/services/mockData/companies.json";

let companies = [...companiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const companiesService = {
  async getAll() {
    await delay(300);
    return [...companies];
  },

  async getById(id) {
    await delay(200);
    const company = companies.find(c => c.Id === parseInt(id));
    if (!company) {
      throw new Error("Company not found");
    }
    return { ...company };
  },

  async create(companyData) {
    await delay(400);
    const newCompany = {
      ...companyData,
      Id: Math.max(...companies.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    companies.push(newCompany);
    return { ...newCompany };
  },

  async update(id, companyData) {
    await delay(350);
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }
    companies[index] = {
      ...companies[index],
      ...companyData,
      Id: parseInt(id)
    };
    return { ...companies[index] };
  },

  async delete(id) {
    await delay(300);
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }
    companies.splice(index, 1);
    return true;
  },

  async searchCompanies(query) {
    await delay(250);
    if (!query) return [...companies];
    
    const searchTerm = query.toLowerCase();
    return companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm) ||
      company.industry.toLowerCase().includes(searchTerm) ||
      company.size.toLowerCase().includes(searchTerm)
    );
  }
};