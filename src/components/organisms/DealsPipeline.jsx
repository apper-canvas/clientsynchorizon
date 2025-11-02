import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { dealsService } from "@/services/api/dealsService";
import { contactsService } from "@/services/api/contactsService";
import { companiesService } from "@/services/api/companiesService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import DealModal from "./DealModal";
import { format } from "date-fns";

const DealsPipeline = () => {
  const [dealsByStage, setDealsByStage] = useState({});
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
  
  const stageColors = {
    "Lead": "default",
    "Qualified": "primary",
    "Proposal": "warning",
    "Negotiation": "danger",
    "Closed Won": "success",
    "Closed Lost": "default"
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [dealsData, contactsData, companiesData] = await Promise.all([
        dealsService.getDealsByStage(),
        contactsService.getAll(),
        companiesService.getAll()
      ]);
      setDealsByStage(dealsData);
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      setError("Failed to load deals. Please try again.");
      console.error("Error loading deals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleDealSaved = (savedDeal) => {
    // Refresh the deals data
    loadData();
    setIsModalOpen(false);
    setSelectedDeal(null);
    toast.success(selectedDeal ? "Deal updated successfully" : "Deal created successfully");
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    if (!draggedDeal || draggedDeal.stage === newStage) return;

    try {
      await dealsService.updateStage(draggedDeal.Id, newStage);
      loadData(); // Refresh data
      toast.success(`Deal moved to ${newStage}`);
    } catch (err) {
      toast.error("Failed to update deal stage");
      console.error("Error updating deal stage:", err);
    } finally {
      setDraggedDeal(null);
    }
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : "Unknown Contact";
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.name : "Unknown Company";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTotalValue = (deals) => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) return <Loading variant="card" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const allDeals = Object.values(dealsByStage).flat();
  const hasDeals = allDeals.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sales Pipeline</h2>
          <p className="text-slate-600 mt-1">
            Track deals through your sales process and close more opportunities
          </p>
        </div>
        <Button onClick={handleAddDeal} className="btn-gradient">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {!hasDeals ? (
        <Empty
          title="No deals in pipeline"
          description="Get started by adding your first deal to begin tracking sales opportunities."
          icon="Target"
          actionLabel="Add First Deal"
          onAction={handleAddDeal}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 min-h-[600px]">
          {stages.map((stage) => {
            const stageDeals = dealsByStage[stage] || [];
            const stageValue = getTotalValue(stageDeals);

            return (
              <div
                key={stage}
                className="bg-slate-50 rounded-xl p-4 min-h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {/* Stage Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{stage}</h3>
                    <Badge variant={stageColors[stage]} size="sm">
                      {stageDeals.length}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    {formatCurrency(stageValue)}
                  </p>
                </div>

                {/* Deals */}
                <div className="space-y-3">
                  {stageDeals.map((deal, index) => (
                    <motion.div
                      key={deal.Id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                    >
                      <Card className="card-hover bg-white shadow-soft">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-slate-900 text-sm mb-1">
                                {deal.title}
                              </h4>
                              <p className="text-xs text-slate-500">
                                {getCompanyName(deal.companyId)}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold gradient-text">
                                {formatCurrency(deal.value)}
                              </span>
                              <Badge 
                                variant="success" 
                                size="sm" 
                                className="text-xs"
                              >
                                {deal.probability}%
                              </Badge>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-slate-500">
                                <ApperIcon name="User" className="h-3 w-3 mr-1" />
                                {getContactName(deal.contactId)}
                              </div>
                              <div className="flex items-center text-xs text-slate-500">
                                <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
                                {format(new Date(deal.closeDate), "MMM d, yyyy")}
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditDeal(deal);
                                }}
                                className="p-1 h-6 w-6"
                              >
                                <ApperIcon name="Edit" className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deal Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deal={selectedDeal}
        contacts={contacts}
        companies={companies}
        onDealSaved={handleDealSaved}
      />
    </div>
  );
};

export default DealsPipeline;