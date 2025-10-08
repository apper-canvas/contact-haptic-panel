import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

function DealDetail({ deal, onEdit, onDelete, onClose }) {
  if (!deal) return null;

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const tags = deal.Tags ? deal.Tags.split(',').filter(Boolean) : [];

  const getStageColor = (stage) => {
    const colors = {
      'Prospecting': 'bg-blue-100 text-blue-700',
      'Qualification': 'bg-purple-100 text-purple-700',
      'Needs Analysis': 'bg-yellow-100 text-yellow-700',
      'Value Proposition': 'bg-orange-100 text-orange-700',
      'Decision Making': 'bg-pink-100 text-pink-700',
      'Negotiation': 'bg-indigo-100 text-indigo-700',
      'Closed Won': 'bg-green-100 text-green-700',
      'Closed Lost': 'bg-red-100 text-red-700'
    };
    return colors[stage] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-primary-50 to-white">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {deal.deal_name_c || deal.Name || 'Untitled Deal'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(deal)}
            className="flex-1"
          >
            <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(deal)}
            className="flex-1 text-red-600 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Deal Value</div>
          <div className="text-3xl font-bold">{formatCurrency(deal.amount_c)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-slate-500 uppercase tracking-wide">Stage</div>
            <Badge className={getStageColor(deal.stage_c)}>
              {deal.stage_c || 'Unknown'}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-500 uppercase tracking-wide">Close Date</div>
            <div className="text-sm font-medium text-slate-700">{formatDate(deal.close_date_c)}</div>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-slate-500 uppercase tracking-wide">Tags</div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            System Information
          </h3>
          
          {deal.Owner && (
            <div className="space-y-1">
              <div className="text-xs text-slate-500">Owner</div>
              <div className="text-sm text-slate-700">{deal.Owner.Name || 'Unknown'}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-500">Created</div>
              <div className="text-sm text-slate-700">{formatDateTime(deal.CreatedOn)}</div>
              {deal.CreatedBy && (
                <div className="text-xs text-slate-500">by {deal.CreatedBy.Name}</div>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-500">Modified</div>
              <div className="text-sm text-slate-700">{formatDateTime(deal.ModifiedOn)}</div>
              {deal.ModifiedBy && (
                <div className="text-xs text-slate-500">by {deal.ModifiedBy.Name}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealDetail;