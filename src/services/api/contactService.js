const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
});

const TABLE_NAME = "contact_c";

export const contactService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "photo_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "is_favorite_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }],
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name_c" } },
          { field: { Name: "last_name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "photo_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "is_favorite_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
        ],
      };

      const response = await apperClient.getRecordById(TABLE_NAME, id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(contactData) {
    try {
      const params = {
        records: [
          {
            first_name_c: contactData.first_name_c || "",
            last_name_c: contactData.last_name_c || "",
            email_c: contactData.email_c || "",
            phone_c: contactData.phone_c || "",
            company_c: contactData.company_c || "",
            position_c: contactData.position_c || "",
            photo_c: contactData.photo_c || "",
            tags_c: Array.isArray(contactData.tags_c) ? contactData.tags_c.join(",") : "",
            notes_c: contactData.notes_c || "",
            is_favorite_c: contactData.is_favorite_c || false,
          },
        ],
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create contact:`, failed);
          throw new Error(failed[0].message || "Failed to create contact");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            first_name_c: contactData.first_name_c,
            last_name_c: contactData.last_name_c,
            email_c: contactData.email_c,
            phone_c: contactData.phone_c,
            company_c: contactData.company_c,
            position_c: contactData.position_c,
            photo_c: contactData.photo_c,
            tags_c: Array.isArray(contactData.tags_c) ? contactData.tags_c.join(",") : contactData.tags_c || "",
            notes_c: contactData.notes_c,
          },
        ],
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update contact:`, failed);
          throw new Error(failed[0].message || "Failed to update contact");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async toggleFavorite(id) {
    try {
      const contact = await this.getById(id);
      if (!contact) {
        throw new Error("Contact not found");
      }

      const params = {
        records: [
          {
            Id: id,
            is_favorite_c: !contact.is_favorite_c,
          },
        ],
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to toggle favorite:`, failed);
          throw new Error(failed[0].message || "Failed to toggle favorite");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error toggling favorite:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id],
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter((r) => r.success);
        const failed = response.results.filter((r) => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete contact:`, failed);
          throw new Error(failed[0].message || "Failed to delete contact");
        }

        return true;
      }
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      throw error;
    }
  },
};