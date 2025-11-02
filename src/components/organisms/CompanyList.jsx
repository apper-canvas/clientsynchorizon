import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { companiesService } from "@/services/api/companiesService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent } from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CompanyModal from "./CompanyModal";
import { format } from "date-fns";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      const companiesData = await companiesService.getAll();
      setCompanies(companiesData);
      setFilteredCompanies(companiesData);
    } catch (err) {
      setError("Failed to load companies. Please try again.");
      console.error("Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.size.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchTerm, companies]);

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = async (companyId) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      await companiesService.delete(companyId);
      setCompanies(companies.filter(c => c.Id !== companyId));
      toast.success("Company deleted successfully");
    } catch (err) {
      toast.error("Failed to delete company");
      console.error("Error deleting company:", err);
    }
  };

  const handleCompanySaved = (savedCompany) => {
    if (selectedCompany) {
      // Update existing company
      setCompanies(companies.map(c => 
        c.Id === savedCompany.Id ? savedCompany : c
      ));
      toast.success("Company updated successfully");
    } else {
      // Add new company
      setCompanies([savedCompany, ...companies]);
      toast.success("Company created successfully");
    }
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const getSizeColor = (size) => {
    const colors = {
      "Small": "default",
      "Mid-Market": "primary",
      "Large": "warning",
      "Enterprise": "success"
    };
    return colors[size] || "default";
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      "Technology": "Cpu",
      "Software Development": "Code",
      "SaaS": "Cloud",
      "Retail": "Store",
      "Healthcare": "Heart",
      "Financial Services": "DollarSign",
      "Consulting": "Users",
      "Manufacturing": "Cog",
      "Education": "GraduationCap",
      "Logistics": "Truck"
    };
    return icons[industry] || "Building2";
  };

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Companies</h2>
          <p className="text-slate-600 mt-1">
            Manage company profiles and organizational relationships
          </p>
        </div>
        <Button onClick={handleAddCompany} className="btn-gradient">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search companies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {/* Company List */}
      {filteredCompanies.length === 0 ? (
        <Empty
          title="No companies found"
          description={searchTerm ? 
            "No companies match your search criteria. Try adjusting your search." :
            "Get started by adding your first company to organize your business relationships."
          }
          icon="Building2"
          actionLabel="Add First Company"
          onAction={searchTerm ? undefined : handleAddCompany}
          showAction={!searchTerm}
        />
      ) : (
        <div className="grid gap-6">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-xl flex items-center justify-center border border-primary-200">
                        <ApperIcon 
                          name={getIndustryIcon(company.industry)} 
                          className="h-8 w-8 text-primary-600" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-1">
                              {company.name}
                            </h3>
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge variant="primary">
                                {company.industry}
                              </Badge>
                              <Badge variant={getSizeColor(company.size)}>
                                {company.size}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {company.website && (
                            <div className="flex items-center text-sm text-slate-600">
                              <ApperIcon name="Globe" className="h-4 w-4 mr-2 text-slate-400" />
                              <a 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 truncate"
                              >
                                {company.website}
                              </a>
                            </div>
                          )}
                          {company.address && (
                            <div className="flex items-start text-sm text-slate-600">
                              <ApperIcon name="MapPin" className="h-4 w-4 mr-2 text-slate-400 mt-0.5" />
                              <span className="truncate">{company.address}</span>
                            </div>
                          )}
                        </div>

                        {company.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {company.notes}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Created: {format(new Date(company.createdAt), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCompany(company)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCompany(company.Id)}
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

      {/* Company Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={selectedCompany}
        onCompanySaved={handleCompanySaved}
      />
    </div>
  );
};

export default CompanyList;