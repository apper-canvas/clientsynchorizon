import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { contactsService } from "@/services/api/contactsService";
import { dealsService } from "@/services/api/dealsService";
import { activitiesService } from "@/services/api/activitiesService";
import { companiesService } from "@/services/api/companiesService";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { format } from "date-fns";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalCompanies: 0,
    activeDeals: 0,
    totalRevenue: 0,
    wonDeals: 0,
    pipelineValue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [dealsByStage, setDealsByStage] = useState({});
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [
        contactsData,
        companiesData,
        dealsData,
        activitiesData,
        dealsByStageData,
        upcomingActivitiesData
      ] = await Promise.all([
        contactsService.getAll(),
        companiesService.getAll(),
        dealsService.getAll(),
        activitiesService.getAll(),
        dealsService.getDealsByStage(),
        activitiesService.getUpcoming(5)
      ]);

      // Calculate statistics
      const activeDeals = dealsData.filter(deal => 
        !["Closed Won", "Closed Lost"].includes(deal.stage)
      ).length;

      const wonDeals = dealsData.filter(deal => deal.stage === "Closed Won");
      const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);

      const pipelineValue = dealsData
        .filter(deal => !["Closed Won", "Closed Lost"].includes(deal.stage))
        .reduce((sum, deal) => sum + deal.value, 0);

      setStats({
        totalContacts: contactsData.length,
        totalCompanies: companiesData.length,
        activeDeals,
        totalRevenue,
        wonDeals: wonDeals.length,
        pipelineValue
      });

      // Recent activities (last 5 completed)
      const recentCompleted = activitiesData
        .filter(activity => activity.completed)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentActivities(recentCompleted);
      setUpcomingActivities(upcomingActivitiesData);
      setDealsByStage(dealsByStageData);
      setContacts(contactsData);
      setCompanies(companiesData);
      
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getContactName = (contactId) => {
    if (!contactId) return "General Task";
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : "Unknown Contact";
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

  // Chart data for deal pipeline
  const pipelineChartData = {
    series: Object.values(dealsByStage).map(deals => deals.length),
    options: {
      chart: {
        type: "donut",
        toolbar: { show: false }
      },
      labels: Object.keys(dealsByStage),
      colors: ["#64748b", "#1e40af", "#f59e0b", "#ef4444", "#10b981", "#6b7280"],
      legend: {
        position: "bottom",
        fontSize: "14px"
      },
      plotOptions: {
        pie: {
          donut: {
            size: "60%"
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          }
        }
      }]
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to ClientSync</h1>
        <p className="text-primary-100">
          Here's an overview of your sales pipeline and recent activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts.toLocaleString()}
            icon="Users"
            change="+12%"
            changeType="positive"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Active Deals"
            value={stats.activeDeals.toLocaleString()}
            icon="Target"
            change="+8%"
            changeType="positive"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Pipeline Value"
            value={formatCurrency(stats.pipelineValue)}
            icon="DollarSign"
            change="+15%"
            changeType="positive"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Revenue (Closed Won)"
            value={formatCurrency(stats.totalRevenue)}
            icon="TrendingUp"
            change="+22%"
            changeType="positive"
          />
        </motion.div>
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pipeline Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-1"
        >
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="PieChart" className="h-5 w-5 mr-2 text-primary-600" />
                Deal Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(dealsByStage).length > 0 ? (
                <Chart
                  options={pipelineChartData.options}
                  series={pipelineChartData.series}
                  type="donut"
                  height={280}
                />
              ) : (
                <div className="h-[280px] flex items-center justify-center text-slate-500">
                  No deals to display
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent & Upcoming Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="xl:col-span-2"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-fit">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="Clock" className="h-5 w-5 mr-2 text-success-600" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
                  {recentActivities.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">
                      No recent activities
                    </p>
                  ) : (
                    recentActivities.map((activity) => (
                      <div key={activity.Id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="h-8 w-8 bg-gradient-to-br from-success-500/10 to-success-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ApperIcon 
                            name={getActivityIcon(activity.type)} 
                            className="h-4 w-4 text-success-600" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {activity.subject}
                          </p>
                          <p className="text-xs text-slate-600 truncate">
                            {getContactName(activity.contactId)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                        <Badge variant="success" size="sm">
                          {activity.type}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="Calendar" className="h-5 w-5 mr-2 text-warning-600" />
                  Upcoming Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
                  {upcomingActivities.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">
                      No upcoming activities
                    </p>
                  ) : (
                    upcomingActivities.map((activity) => (
                      <div key={activity.Id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="h-8 w-8 bg-gradient-to-br from-warning-500/10 to-warning-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ApperIcon 
                            name={getActivityIcon(activity.type)} 
                            className="h-4 w-4 text-warning-600" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {activity.subject}
                          </p>
                          <p className="text-xs text-slate-600 truncate">
                            {getContactName(activity.contactId)}
                          </p>
                          <p className="text-xs text-slate-500">
                            Due: {format(new Date(activity.dueDate), "MMM d, h:mm a")}
                          </p>
                        </div>
                        <Badge variant="warning" size="sm">
                          {activity.type}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Zap" className="h-5 w-5 mr-2 text-primary-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-center space-y-2"
                onClick={() => window.location.href = "/contacts"}
              >
                <ApperIcon name="UserPlus" className="h-6 w-6" />
                <span>Add Contact</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-center space-y-2"
                onClick={() => window.location.href = "/companies"}
              >
                <ApperIcon name="Building2" className="h-6 w-6" />
                <span>Add Company</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-center space-y-2"
                onClick={() => window.location.href = "/deals"}
              >
                <ApperIcon name="Target" className="h-6 w-6" />
                <span>Add Deal</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-center space-y-2"
                onClick={() => window.location.href = "/activities"}
              >
                <ApperIcon name="Plus" className="h-6 w-6" />
                <span>Log Activity</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;