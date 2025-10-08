import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { dealsService } from '@/services/api/dealsService';
import { AuthContext } from '@/App';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import DeleteDealModal from '@/components/organisms/DeleteDealModal';
import DealsList from '@/components/organisms/DealsList';
import DealDetail from '@/components/organisms/DealDetail';
import DealModal from '@/components/organisms/DealModal';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';

function DealsPage() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  useEffect(() => {
    loadDeals();
  }, [stageFilter, searchQuery]);

  async function loadDeals() {
    setLoading(true);
    try {
      const filters = {};
      if (stageFilter !== 'all') filters.stage = stageFilter;
      if (searchQuery) filters.search = searchQuery;
      
      const data = await dealsService.getAll(filters);
      setDeals(data);
    } catch (error) {
      console.error('Error loading deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  }

  function handleSelectDeal(deal) {
    setSelectedDeal(deal);
    setShowMobileDetail(true);
  }

  function handleEditDeal(deal) {
    setEditingDeal(deal);
    setIsModalOpen(true);
  }

  function handleDeleteDeal(deal) {
    setDealToDelete(deal);
    setIsDeleteModalOpen(true);
  }

  async function handleSaveDeal(dealData) {
    try {
      if (editingDeal) {
        const updated = await dealsService.update(editingDeal.Id, dealData);
        if (updated) {
          await loadDeals();
          if (selectedDeal?.Id === editingDeal.Id) {
            setSelectedDeal(updated);
          }
        }
      } else {
        const created = await dealsService.create(dealData);
        if (created) {
          await loadDeals();
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving deal:', error);
    }
  }

  async function handleToggleFavorite(deal) {
    try {
      const currentTags = deal.Tags ? deal.Tags.split(',') : [];
      const isFavorite = currentTags.includes('Favorite');
      
      const updatedTags = isFavorite
        ? currentTags.filter(tag => tag !== 'Favorite')
        : [...currentTags, 'Favorite'];

      await dealsService.update(deal.Id, {
        ...deal,
        Tags: updatedTags.join(',')
      });

      await loadDeals();
      
      if (selectedDeal?.Id === deal.Id) {
        const updated = await dealsService.getById(deal.Id);
        setSelectedDeal(updated);
      }

      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite status');
    }
  }

  function handleDealDeleted(deletedDeal) {
    setDeals(prev => prev.filter(d => d.Id !== deletedDeal.Id));
    if (selectedDeal?.Id === deletedDeal.Id) {
      setSelectedDeal(null);
    }
    setIsDeleteModalOpen(false);
    setDealToDelete(null);
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingDeal(null);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
    setDealToDelete(null);
  }

  function handleCloseMobileDetail() {
    setShowMobileDetail(false);
  }

  const stageOptions = [
    { value: 'all', label: 'All Stages' },
    { value: 'Prospecting', label: 'Prospecting' },
    { value: 'Qualification', label: 'Qualification' },
    { value: 'Needs Analysis', label: 'Needs Analysis' },
    { value: 'Value Proposition', label: 'Value Proposition' },
    { value: 'Decision Making', label: 'Decision Making' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Closed Won', label: 'Closed Won' },
    { value: 'Closed Lost', label: 'Closed Lost' }
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden md:flex md:flex-col w-64 bg-white border-r border-slate-200"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              D
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">DealHub</h1>
              <p className="text-xs text-slate-500">Manage your deals</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="space-y-1">
<button 
              onClick={() => navigate('/contacts')}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="Users" className="w-4 h-4" />
              Contacts
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm">
              <ApperIcon name="DollarSign" className="w-4 h-4" />
              All Deals
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-green-50 rounded-lg transition-colors duration-200">
              <ApperIcon name="Star" className="w-4 h-4" />
              Favorites
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={user?.firstName || 'User'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.emailAddress}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-center"
          >
            <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Deals</h2>
              <p className="text-sm text-slate-500 mt-1">
                {deals.length} {deals.length === 1 ? 'deal' : 'deals'} found
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              New Deal
            </Button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search deals..."
              />
            </div>
            <FilterDropdown
              value={stageFilter}
              onChange={setStageFilter}
              options={stageOptions}
              label="Stage"
            />
          </div>
        </header>

        {/* Deals List and Detail */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto">
            <DealsList
              deals={deals}
              loading={loading}
              onSelectDeal={handleSelectDeal}
              onEditDeal={handleEditDeal}
              onDeleteDeal={handleDeleteDeal}
              onToggleFavorite={handleToggleFavorite}
              selectedDealId={selectedDeal?.Id}
            />
          </div>

          {selectedDeal && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="hidden lg:block w-96 border-l border-slate-200 bg-white overflow-auto"
            >
              <DealDetail
                deal={selectedDeal}
                onEdit={handleEditDeal}
                onDelete={handleDeleteDeal}
                onClose={() => setSelectedDeal(null)}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Detail Drawer */}
      {showMobileDetail && selectedDeal && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="fixed inset-0 z-50 lg:hidden bg-white"
        >
          <DealDetail
            deal={selectedDeal}
            onEdit={handleEditDeal}
            onDelete={handleDeleteDeal}
            onClose={handleCloseMobileDetail}
          />
        </motion.div>
      )}

      {/* Deal Modal */}
      {isModalOpen && (
        <DealModal
          deal={editingDeal}
          onClose={handleCloseModal}
          onSave={handleSaveDeal}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && dealToDelete && (
        <DeleteDealModal
          deal={dealToDelete}
          onClose={handleCloseDeleteModal}
          onDelete={handleDealDeleted}
        />
      )}
    </div>
  );
}

export default DealsPage;