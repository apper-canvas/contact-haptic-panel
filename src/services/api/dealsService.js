import { toast } from 'react-toastify';

const TABLE_NAME = 'deals_c';

let apperClient = null;

const initializeApperClient = () => {
  if (!apperClient) {
    const { ApperClient } = window.ApperSDK;
    apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
  return apperClient;
};

export const dealsService = {
  async getAll(filters = {}) {
    try {
      const client = initializeApperClient();
      
      const params = {
        fields: [
{ field: { Name: 'Name' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'deal_name_c' } },
          { field: { Name: 'amount_c' } },
          { field: { Name: 'close_date_c' } },
          { field: { Name: 'stage_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'ModifiedOn' } }
        ],
        where: [],
        orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      if (filters.stage) {
        params.where.push({
          FieldName: 'stage_c',
          Operator: 'EqualTo',
          Values: [filters.stage]
        });
      }

      if (filters.search) {
        params.whereGroups = [{
          operator: 'OR',
          subGroups: [
            {
              conditions: [
                { fieldName: 'Name', operator: 'Contains', values: [filters.search] },
                { fieldName: 'deal_name_c', operator: 'Contains', values: [filters.search] }
              ],
              operator: 'OR'
            }
          ]
        }];
      }

      const response = await client.fetchRecords(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching deals:', error?.response?.data?.message || error);
      toast.error('Failed to fetch deals');
      return [];
    }
  },

  async getById(id) {
    try {
      const client = initializeApperClient();
      
      const params = {
        fields: [
{ field: { Name: 'Name' } },
          { field: { Name: 'Tags' } },
          { field: { Name: 'deal_name_c' } },
          { field: { Name: 'amount_c' } },
          { field: { Name: 'close_date_c' } },
          { field: { Name: 'stage_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'ModifiedOn' } }
        ]
      };

      const response = await client.getRecordById(TABLE_NAME, id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to fetch deal details');
      return null;
    }
  },

async create(dealData) {
    try {
      const client = initializeApperClient();
      
      const record = {
        Name: dealData.Name || '',
        Tags: dealData.Tags || '',
        deal_name_c: dealData.deal_name_c || '',
        amount_c: dealData.amount_c ? parseInt(dealData.amount_c) : undefined,
        close_date_c: dealData.close_date_c || '',
        stage_c: dealData.stage_c || 'Prospecting'
      };

      const filteredRecord = {};
      Object.keys(record).forEach(key => {
        if (record[key] !== '' && record[key] !== null && record[key] !== undefined) {
          filteredRecord[key] = record[key];
        }
      });

      const params = {
        records: [filteredRecord]
      };

      const response = await client.createRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success('Deal created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating deal:', error?.response?.data?.message || error);
      toast.error('Failed to create deal');
      return null;
    }
  },

  async update(id, dealData) {
    try {
      const client = initializeApperClient();
      
      const record = {
        Id: parseInt(id),
        Name: dealData.Name,
        Tags: dealData.Tags,
        deal_name_c: dealData.deal_name_c,
        amount_c: dealData.amount_c ? parseInt(dealData.amount_c) : undefined,
        close_date_c: dealData.close_date_c,
        stage_c: dealData.stage_c
      };

      const filteredRecord = { Id: record.Id };
      Object.keys(record).forEach(key => {
        if (key !== 'Id' && record[key] !== '' && record[key] !== null && record[key] !== undefined) {
          filteredRecord[key] = record[key];
        }
      });

      const params = {
        records: [filteredRecord]
      };

      const response = await client.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          toast.success('Deal updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating deal:', error?.response?.data?.message || error);
      toast.error('Failed to update deal');
      return null;
    }
  },

  async delete(id) {
    try {
      const client = initializeApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await client.deleteRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        if (successful.length > 0) {
          toast.success('Deal deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting deal:', error?.response?.data?.message || error);
      toast.error('Failed to delete deal');
      return false;
    }
  }
};