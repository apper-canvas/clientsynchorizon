import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { contactsService } from "@/services/api/contactsService";
import { companiesService } from "@/services/api/companiesService";
import { Card, CardContent } from "@/components/atoms/Card";
import ContactModal from "@/components/organisms/ContactModal";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const ContactList = () => {
const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [contactsData, companiesData] = await Promise.all([
        contactsService.getAll(),
        companiesService.getAll()
      ]);
      setContacts(contactsData);
      setCompanies(companiesData);
      setFilteredContacts(contactsData);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter(contact =>
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchTerm, contacts]);

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

const handleDeleteContact = async (contactId) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await contactsService.delete(contactId);
      setContacts(contacts.filter(c => c.Id !== contactId));
      setSelectedContacts(prev => {
        const updated = new Set(prev);
        updated.delete(contactId);
        return updated;
      });
      toast.success("Contact deleted successfully");
    } catch (err) {
      toast.error("Failed to delete contact");
      console.error("Error deleting contact:", err);
    }
  };

  const handleSelectContact = (contactId, isSelected) => {
    setSelectedContacts(prev => {
      const updated = new Set(prev);
      if (isSelected) {
        updated.add(contactId);
      } else {
        updated.delete(contactId);
      }
      return updated;
    });
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedContacts(new Set(filteredContacts.map(c => c.Id)));
    } else {
      setSelectedContacts(new Set());
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedContacts.size;
    if (!confirm(`Are you sure you want to delete ${count} contact${count > 1 ? 's' : ''}?`)) return;

    setBulkLoading(true);
    try {
      const result = await contactsService.bulkDelete(Array.from(selectedContacts));
      setContacts(prev => prev.filter(c => !selectedContacts.has(c.Id)));
      setSelectedContacts(new Set());
      toast.success(`${result.successCount} contact${result.successCount > 1 ? 's' : ''} deleted successfully`);
      if (result.errors.length > 0) {
        toast.error(`Failed to delete ${result.errors.length} contact${result.errors.length > 1 ? 's' : ''}`);
      }
    } catch (err) {
      toast.error("Failed to delete contacts");
      console.error("Error deleting contacts:", err);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkUpdate = async (updateData) => {
    const count = selectedContacts.size;
    setBulkLoading(true);
    try {
      const result = await contactsService.bulkUpdate(Array.from(selectedContacts), updateData);
      setContacts(prev => prev.map(contact => {
        const updatedContact = result.updated.find(u => u.Id === contact.Id);
        return updatedContact || contact;
      }));
      setSelectedContacts(new Set());
      toast.success(`${result.successCount} contact${result.successCount > 1 ? 's' : ''} updated successfully`);
      if (result.errors.length > 0) {
        toast.error(`Failed to update ${result.errors.length} contact${result.errors.length > 1 ? 's' : ''}`);
      }
    } catch (err) {
      toast.error("Failed to update contacts");
      console.error("Error updating contacts:", err);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkExport = async () => {
    setBulkLoading(true);
    try {
      const selectedContactsData = contacts.filter(c => selectedContacts.has(c.Id));
      await contactsService.bulkExport(selectedContactsData);
      toast.success(`${selectedContacts.size} contact${selectedContacts.size > 1 ? 's' : ''} exported successfully`);
    } catch (err) {
      toast.error("Failed to export contacts");
      console.error("Error exporting contacts:", err);
    } finally {
      setBulkLoading(false);
    }
  };

const handleContactSaved = (savedContact) => {
    if (selectedContact) {
      // Update existing contact
      setContacts(contacts.map(c => 
        c.Id === savedContact.Id ? savedContact : c
      ));
      toast.success("Contact updated successfully");
    } else {
      // Add new contact
      setContacts([savedContact, ...contacts]);
      toast.success("Contact created successfully");
    }
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.name : "Unknown Company";
  };

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Contacts</h2>
          <p className="text-slate-600 mt-1">
            Manage your customer relationships and contact information
          </p>
        </div>
        <Button onClick={handleAddContact} className="btn-gradient">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search and Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <SearchBar
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        {filteredContacts.length > 0 && (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-primary-600 focus:border-primary-500 focus:ring-primary-500"
                checked={selectedContacts.size === filteredContacts.length && filteredContacts.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              Select All ({filteredContacts.length})
            </label>
            {selectedContacts.size > 0 && (
              <span className="text-sm text-primary-600 font-medium">
                {selectedContacts.size} selected
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedContacts.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-50 border border-primary-200 rounded-lg p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="CheckCircle2" className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-primary-800">
                {selectedContacts.size} contact{selectedContacts.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => handleBulkUpdate({ status: 'Active' })}
                  disabled={bulkLoading}
                  className="text-xs px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                >
                  <ApperIcon name="CheckCircle" className="h-3 w-3 mr-1" />
                  Mark Active
                </Button>
                <Button
                  onClick={() => handleBulkUpdate({ status: 'Inactive' })}
                  disabled={bulkLoading}
                  className="text-xs px-3 py-1.5 bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200"
                >
                  <ApperIcon name="XCircle" className="h-3 w-3 mr-1" />
                  Mark Inactive
                </Button>
                <Button
                  onClick={() => handleBulkUpdate({ tags: ['VIP'] })}
                  disabled={bulkLoading}
                  className="text-xs px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200"
                >
                  <ApperIcon name="Tag" className="h-3 w-3 mr-1" />
                  Add VIP Tag
                </Button>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <Button
                onClick={handleBulkExport}
                disabled={bulkLoading}
                className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
              >
                <ApperIcon name="Download" className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button
                onClick={handleBulkDelete}
                disabled={bulkLoading}
                className="text-xs px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
              >
                <ApperIcon name="Trash2" className="h-3 w-3 mr-1" />
                Delete
              </Button>
              <Button
                onClick={() => setSelectedContacts(new Set())}
                disabled={bulkLoading}
                className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Contact List */}
      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts found"
          description={searchTerm ? 
            "No contacts match your search criteria. Try adjusting your search." :
            "Get started by adding your first contact to begin managing relationships."
          }
          icon="Users"
          actionLabel="Add First Contact"
          onAction={searchTerm ? undefined : handleAddContact}
          showAction={!searchTerm}
        />
) : (
        <div className="grid gap-4">
          {filteredContacts.map((contact, index) => {
            const isSelected = selectedContacts.has(contact.Id);
            return (
              <motion.div
                key={contact.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`card-hover transition-all ${isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-primary-600 focus:border-primary-500 focus:ring-primary-500"
                          checked={isSelected}
                          onChange={(e) => handleSelectContact(contact.Id, e.target.checked)}
                        />
                      </div>
                      <div className="flex items-start justify-between flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                            {contact.firstName?.[0]}{contact.lastName?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {contact.firstName} {contact.lastName}
                            </h3>
                            <p className="text-sm font-medium text-primary-600 mb-1">
                              {contact.title}
                            </p>
                            <p className="text-sm text-slate-600 mb-1">
                              {getCompanyName(contact.companyId)}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <div className="flex items-center">
                                <ApperIcon name="Mail" className="h-4 w-4 mr-1" />
                                {contact.email}
                              </div>
                              <div className="flex items-center">
                                <ApperIcon name="Phone" className="h-4 w-4 mr-1" />
                                {contact.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditContact(contact)}
                          >
                            <ApperIcon name="Edit" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContact(contact.Id)}
                            className="text-error-600 hover:text-error-700"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {contact.notes && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600">{contact.notes}</p>
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>Created: {format(new Date(contact.createdAt), "MMM d, yyyy")}</span>
                      <span>Updated: {format(new Date(contact.updatedAt), "MMM d, yyyy")}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        companies={companies}
        onContactSaved={handleContactSaved}
      />
    </div>
  );
};

export default ContactList;