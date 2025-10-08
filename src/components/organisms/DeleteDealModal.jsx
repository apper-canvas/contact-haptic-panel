import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dealsService } from '@/services/api/dealsService';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function DeleteDealModal({ deal, onClose, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const success = await dealsService.delete(deal.Id);
      if (success) {
        onDelete(deal);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Delete Deal
            </h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete "{deal.deal_name_c || deal.Name}"? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default DeleteDealModal;