import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

function DealCard({
  deal,
  onClick,
  onEdit,
  onDelete,
  onToggleFavorite,
  isSelected
}) {
  const tags = deal.Tags ? deal.Tags.split(',').filter(Boolean) : [];
  const isFavorite = tags.includes('Favorite');
  
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
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
    <div
      onClick={onClick}
      className={`
        relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
        bg-gradient-to-br from-white to-slate-50
        hover:shadow-lg hover:border-primary-300
        ${isSelected ? 'border-primary-500 shadow-lg' : 'border-slate-200'}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 truncate mb-1">
            {deal.deal_name_c || deal.Name || 'Untitled Deal'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(deal.amount_c)}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ApperIcon
            name="Star"
            className={`w-5 h-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`}
          />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <ApperIcon name="Calendar" className="w-4 h-4" />
          <span>Close: {formatDate(deal.close_date_c)}</span>
        </div>
        <div>
          <Badge className={getStageColor(deal.stage_c)}>
            {deal.stage_c || 'Unknown'}
          </Badge>
        </div>
      </div>

      {tags.filter(t => t !== 'Favorite').length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.filter(t => t !== 'Favorite').map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-slate-200">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex-1"
        >
          <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex-1 text-red-600 hover:bg-red-50"
        >
          <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}

export default DealCard;