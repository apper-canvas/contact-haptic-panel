import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function DealForm({ deal, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    Name: deal?.Name || '',
    deal_name_c: deal?.deal_name_c || '',
    amount_c: deal?.amount_c || '',
    close_date_c: deal?.close_date_c || '',
    stage_c: deal?.stage_c || 'Prospecting',
    Tags: deal?.Tags || ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const stageOptions = [
    'Prospecting',
    'Qualification',
    'Needs Analysis',
    'Value Proposition',
    'Decision Making',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Name"
        value={formData.Name}
        onChange={(value) => handleChange('Name', value)}
        placeholder="Enter deal name"
        required
      />

      <FormField
        label="Deal Name"
        value={formData.deal_name_c}
        onChange={(value) => handleChange('deal_name_c', value)}
        placeholder="Enter detailed deal name"
      />

      <FormField
        label="Amount"
        type="number"
        value={formData.amount_c}
        onChange={(value) => handleChange('amount_c', value)}
        placeholder="Enter deal amount"
      />

      <FormField
        label="Close Date"
        type="date"
        value={formData.close_date_c}
        onChange={(value) => handleChange('close_date_c', value)}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Stage
        </label>
        <select
          value={formData.stage_c}
          onChange={(e) => handleChange('stage_c', e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          {stageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <FormField
        label="Tags"
        value={formData.Tags}
        onChange={(value) => handleChange('Tags', value)}
        placeholder="Enter tags (comma-separated)"
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              {deal ? 'Update Deal' : 'Create Deal'}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default DealForm;