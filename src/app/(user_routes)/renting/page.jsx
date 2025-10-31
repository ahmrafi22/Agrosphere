'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaBox, FaFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EquipmentCard from './components/EquipmentCard';
import MyEquipmentCard from './components/MyEquipmentCard';
import AddEquipmentForm from './components/AddEquipmentForm';
import RentRequestForm from './components/RentRequestForm';
import CentralizedSkeleton from './components/CentralizedSkeleton';

export default function RentingPage() {
  const [equipment, setEquipment] = useState([]);
  const [myEquipment, setMyEquipment] = useState([]);
  const [user, setUser] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRentDialogOpen, setIsRentDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [rentRequests, setRentRequests] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [acceptingRequest, setAcceptingRequest] = useState(null);
  
  // Form states
  const [equipmentForm, setEquipmentForm] = useState({
    equipment_name: '',
    description: '',
    price_per_day: '',
    max_duration_days: '',
  });
  
  const [rentRequestForm, setRentRequestForm] = useState({
    price_per_day_requested: '',
    requested_duration_days: '',
  });

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const initializeData = async () => {
      setInitialLoading(true);
      await Promise.all([fetchAllEquipment(), fetchMyEquipment(), fetchUserRequests()]);
      setInitialLoading(false);
    };
    
    initializeData();
  }, []);

  const fetchAllEquipment = async () => {
    try {
      const response = await fetch('/api/equipment');
      const data = await response.json();
      if (data.success) {
        setEquipment(data.equipment);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      alert('Failed to load equipment. Please try again.');
    }
  };

  const fetchUserRequests = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      
      const user = JSON.parse(userData);
      const response = await fetch(`/api/rental-requests/user/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setUserRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching user requests:', error);
    }
  };

  const fetchMyEquipment = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      
      const user = JSON.parse(userData);
      const response = await fetch(`/api/equipment/my/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setMyEquipment(data.equipment);
        
        // Fetch requests for each equipment
        const allRequests = [];
        for (const eq of data.equipment) {
          const reqResponse = await fetch(`/api/rental-requests/equipment/${eq.id}`);
          const reqData = await reqResponse.json();
          if (reqData.success) {
            allRequests.push(...reqData.requests.map(req => ({ ...req, equipment_name: eq.equipment_name })));
          }
        }
        setRentRequests(allRequests);
      }
    } catch (error) {
      console.error('Error fetching my equipment:', error);
      alert('Failed to load your equipment. Please try again.');
    }
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...equipmentForm,
          owner_id: user.id,
          owner_phone: user.phone,
          owner_email: user.email,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setIsAddDialogOpen(false);
        setEquipmentForm({
          equipment_name: '',
          description: '',
          price_per_day: '',
          max_duration_days: '',
        });
        fetchAllEquipment();
        fetchMyEquipment();
      } else {
        alert('Failed to add equipment: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding equipment:', error);
      alert('Failed to add equipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRentRequest = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch('/api/rental-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipment_id: selectedEquipment.id,
          requester_id: user.id,
          requester_phone: user.phone,
          requester_email: user.email,
          price_per_day_requested: rentRequestForm.price_per_day_requested,
          requested_duration_days: rentRequestForm.requested_duration_days,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setIsRentDialogOpen(false);
        setRentRequestForm({
          price_per_day_requested: '',
          requested_duration_days: '',
        });
        setSelectedEquipment(null);

        fetchUserRequests();
      } else {
        alert('Failed to submit request: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating rent request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId, equipmentId) => {
    try {
      setAcceptingRequest(requestId);
      const response = await fetch(`/api/rental-requests/${requestId}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipment_id: equipmentId }),
      });
      
      const data = await response.json();
      if (data.success) {
        fetchMyEquipment();
        fetchAllEquipment();
        fetchUserRequests();
      } else {
        alert('Failed to accept request: ' + data.message);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request. Please try again.');
    } finally {
      setAcceptingRequest(null);
    }
  };

  const openRentDialog = (equipment) => {
    setSelectedEquipment(equipment);
    setRentRequestForm({
      price_per_day_requested: equipment.price_per_day,
      requested_duration_days: '1',
    });
    setIsRentDialogOpen(true);
  };

  const availableEquipment = equipment.filter(eq => eq.owner_id !== user?.id && eq.status === 'available');

  const tabs = [
    { id: 'browse', label: 'Browse Equipment', icon: FaSearch },
    { id: 'my-rentals', label: 'My Equipment', icon: FaBox },
    { id: 'my-requests', label: 'My Requests', icon: FaFileAlt },
  ];

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rent an equipment </h1>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
                <FaPlus className="w-4 h-4" />
                Add Equipment for Rent
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Equipment for Rent</DialogTitle>
              </DialogHeader>
              <AddEquipmentForm
                equipmentForm={equipmentForm}
                setEquipmentForm={setEquipmentForm}
                onSubmit={handleAddEquipment}
                user={user}
                loading={loading}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full w-[60vw]">
            <div className="relative flex">
              <motion.div
                className="absolute top-1 bottom-1 bg-white dark:bg-gray-700 rounded-full shadow-sm"
                initial={false}
                animate={{
                  x: `${tabs.findIndex((tab) => tab.id === activeTab) * 100}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                style={{ width: `calc(100% / ${tabs.length})` }}
              />
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative z-10 flex-1 px-4 py-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                      activeTab === tab.id
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Centralized Loading skeleton */}
        {initialLoading && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {activeTab === 'browse' && 'Browse Available Equipment'}
              {activeTab === 'my-rentals' && 'My Equipment'}
              {activeTab === 'my-requests' && 'My Rental Requests'}
            </h2>
            <CentralizedSkeleton 
              type={activeTab === 'my-requests' ? 'list' : 'cards'} 
              count={activeTab === 'my-requests' ? 4 : 6} 
            />
          </div>
        )}

        {/* Tab Content */}
        {!initialLoading && activeTab === 'browse' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Browse Available Equipment</h2>
            {availableEquipment.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableEquipment.map((item) => (
                  <EquipmentCard 
                    key={item.id}
                    equipment={item}
                    user={user}
                    userRequests={userRequests}
                    onRequestRent={openRentDialog}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No equipment available for rent at the moment.</p>
              </div>
            )}
          </div>
        )}
        
        {!initialLoading && activeTab === 'my-rentals' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Equipment</h2>
            {myEquipment.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myEquipment.map((item) => (
                  <MyEquipmentCard
                    key={item.id}
                    equipment={item}
                    requests={rentRequests}
                    onAcceptRequest={handleAcceptRequest}
                    acceptingRequest={acceptingRequest}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't posted any equipment for rent yet.</p>
                <button 
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Add Your First Equipment
                </button>
              </div>
            )}
          </div>
        )}

        {!initialLoading && activeTab === 'my-requests' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Rental Requests</h2>
            {userRequests.length > 0 ? (
              <div className="space-y-4">
                {userRequests.map((request) => (
                  <div key={request.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {request.equipment_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Requested: ${request.price_per_day_requested}/day for {request.requested_duration_days} days
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Owner: {request.owner_phone} | {request.owner_email}
                        </p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        request.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                          : request.status === 'accepted'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Submitted: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't made any rental requests yet.</p>
                <button 
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  onClick={() => setActiveTab('browse')}
                >
                  Browse Equipment
                </button>
              </div>
            )}
          </div>
        )}

        {/* Rent Request Dialog */}
        <Dialog open={isRentDialogOpen} onOpenChange={setIsRentDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Rent Equipment</DialogTitle>
            </DialogHeader>
            <RentRequestForm
              rentRequestForm={rentRequestForm}
              setRentRequestForm={setRentRequestForm}
              onSubmit={handleRentRequest}
              selectedEquipment={selectedEquipment}
              user={user}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
