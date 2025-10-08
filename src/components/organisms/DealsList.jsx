import React from 'react';
import { motion } from 'framer-motion';
import DealCard from '@/components/molecules/DealCard';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';

function DealsList({
  deals,
  loading,
  onSelectDeal,
  onEditDeal,
  onDeleteDeal,
  onToggleFavorite,
  selectedDealId
}) {
  if (loading) {
    return <Loading />;
  }

  if (!deals || deals.length === 0) {
    return <Empty message="No deals found" />;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map((deal, index) => (
          <motion.div
            key={deal.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <DealCard
              deal={deal}
              onClick={() => onSelectDeal(deal)}
              onEdit={() => onEditDeal(deal)}
              onDelete={() => onDeleteDeal(deal)}
              onToggleFavorite={() => onToggleFavorite(deal)}
              isSelected={selectedDealId === deal.Id}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default DealsList;