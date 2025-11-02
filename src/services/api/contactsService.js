import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactsService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const newContact = {
      ...contactData,
      Id: Math.max(...contacts.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, contactData) {
    await delay(350);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    contacts[index] = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...contacts[index] };
  },

  async delete(id) {
    await delay(300);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    contacts.splice(index, 1);
    return true;
  },

  async searchContacts(query) {
    await delay(250);
    if (!query) return [...contacts];
    
    const searchTerm = query.toLowerCase();
    return contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(searchTerm) ||
      contact.lastName.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.title.toLowerCase().includes(searchTerm)
    );
  },

  async bulkUpdate(contactIds, updateData) {
    await delay(500);
    const updated = [];
    const errors = [];

    for (const id of contactIds) {
      try {
        const index = contacts.findIndex(c => c.Id === parseInt(id));
        if (index === -1) {
          errors.push({ id, error: "Contact not found" });
          continue;
        }

        contacts[index] = {
          ...contacts[index],
          ...updateData,
          Id: parseInt(id),
          updatedAt: new Date().toISOString()
        };
        updated.push({ ...contacts[index] });
      } catch (err) {
        errors.push({ id, error: err.message });
      }
    }

    return {
      updated,
      errors,
      successCount: updated.length,
      errorCount: errors.length
    };
  },

  async bulkDelete(contactIds) {
    await delay(600);
    const deleted = [];
    const errors = [];

    // Sort IDs in descending order to avoid index shifting issues
    const sortedIds = contactIds.sort((a, b) => b - a);

    for (const id of sortedIds) {
      try {
        const index = contacts.findIndex(c => c.Id === parseInt(id));
        if (index === -1) {
          errors.push({ id, error: "Contact not found" });
          continue;
        }

        const deletedContact = contacts.splice(index, 1)[0];
        deleted.push(deletedContact);
      } catch (err) {
        errors.push({ id, error: err.message });
      }
    }

    return {
      deleted,
      errors,
      successCount: deleted.length,
      errorCount: errors.length
    };
  },

  async bulkExport(contactsData) {
    await delay(400);
    
    // Create CSV content
    const headers = [
      'ID', 'First Name', 'Last Name', 'Email', 'Phone', 
      'Title', 'Company', 'Status', 'Created At', 'Updated At'
    ];
    
    const csvRows = [
      headers.join(','),
      ...contactsData.map(contact => [
        contact.Id,
        `"${contact.firstName}"`,
        `"${contact.lastName}"`,
        `"${contact.email}"`,
        `"${contact.phone || ''}"`,
        `"${contact.title || ''}"`,
        `"${contact.companyName || ''}"`,
        `"${contact.status || 'Active'}"`,
        `"${contact.createdAt || ''}"`,
        `"${contact.updatedAt || ''}"`
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      filename: `contacts_export_${new Date().toISOString().split('T')[0]}.csv`,
      count: contactsData.length
    };
  }
};