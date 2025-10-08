import React from 'react';
import { motion } from 'framer-motion';
import DealForm from '@/components/organisms/DealForm';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function DealModal({ deal, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {deal ? 'Edit Deal' : 'New Deal'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <DealForm deal={deal} onSave={onSave} onCancel={onClose} />
        </div>
      </motion.div>
    </div>
  );
}

export default DealModal;