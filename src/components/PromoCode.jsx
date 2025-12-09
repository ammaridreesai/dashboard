'use client';

import { useState } from 'react';
import Header from './Header';
import AssignPromoModal from './AssignPromoModal';

export default function PromoCode() {
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' or 'assign'
  const [promoType, setPromoType] = useState('monthly');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Dummy users data
  const [users] = useState([
    {
      id: 1,
      name: 'Ali Farhan',
      email: 'ali@gmail.com',
      plan: 'Free',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sara Khan',
      email: 'sara.n@gmail.com',
      plan: 'Paid',
      status: 'Active',
    },
    {
      id: 3,
      name: 'John Doe',
      email: 'john.d@gmail.com',
      plan: 'Free',
      status: 'Banned',
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily@gmail.com',
      plan: 'Paid',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Michael Smith',
      email: 'michael@gmail.com',
      plan: 'Free',
      status: 'Pending',
    },
  ]);

  // Dummy promo codes data
  const [promoCodes] = useState([
    {
      id: 103,
      promoCode: 'PROMOLRAKNRXQTM',
      promoType: 'monthly',
      creationDate: '2025-11-18T19:30:17.885Z',
      isUsed: true,
    },
    {
      id: 104,
      promoCode: 'PROMOCYZMNABXPL',
      promoType: 'yearly',
      creationDate: '2025-10-15T14:22:10.123Z',
      isUsed: false,
    },
    {
      id: 105,
      promoCode: 'PROMOKJHGFDSAWQ',
      promoType: 'monthly',
      creationDate: '2025-09-05T08:15:30.456Z',
      isUsed: true,
    },
    {
      id: 106,
      promoCode: 'PROMOXYZABCDEFG',
      promoType: 'yearly',
      creationDate: '2025-08-22T16:45:22.789Z',
      isUsed: false,
    },
    {
      id: 107,
      promoCode: 'PROMOWERTYLMNOP',
      promoType: 'monthly',
      creationDate: '2025-07-10T10:30:45.321Z',
      isUsed: true,
    },
  ]);

  // Filter promo codes based on search term
  const filteredPromoCodes = promoCodes.filter(
    (promo) =>
      promo.promoCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.promoType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort promo codes
  const sortedPromoCodes = [...filteredPromoCodes].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle column sorting
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  // Handle generate promo code
  const handleGeneratePromoCode = () => {
    console.log('Generating promo code for:', promoType);
    // Here you would call your API to generate a promo code
    alert(`Generating ${promoType} promo code!`);
  };

  // Get status badge color
  const getStatusColor = (isUsed) => {
    return isUsed ? 'bg-red-500' : 'bg-green-500';
  };

  // Get user status badge color
  const getUserStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'banned':
        return 'bg-red-500';
      case 'pending':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Handle assign promo
  const handleAssignPromo = (user) => {
    setSelectedUser(user);
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedUser(null);
  };

  // Sort icon component
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <svg
        className="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  return (
    <div className="flex-1 ml-64 bg-[#2C3947] min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-400 mb-6">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>&gt;</span>
          <span>Promo Code</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-semibold text-white mb-8">Promo Code</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'generate'
                ? 'bg-white text-gray-800'
                : 'bg-[#1E2532] text-gray-400 hover:text-white'
            }`}
          >
            Generate Promo Code
          </button>
          <button
            onClick={() => setActiveTab('assign')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'assign'
                ? 'bg-white text-gray-800'
                : 'bg-[#1E2532] text-gray-400 hover:text-white'
            }`}
          >
            Assign Promo Code
          </button>
        </div>

        {/* Generate Promo Code Section */}
        {activeTab === 'generate' && (
          <>
            {/* Generate Promo Code Form */}
        <div className="bg-[#1E2532] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Generate Promo Code
          </h2>

          <div className="flex items-end gap-4">
            {/* Promo Type Dropdown */}
            <div className="flex-1 max-w-xs">
              <label className="block text-gray-300 text-sm mb-2">
                Promo Type
              </label>
              <select
                value={promoType}
                onChange={(e) => setPromoType(e.target.value)}
                className="w-full px-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGeneratePromoCode}
              className="bg-white text-gray-800 py-2 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Promo Codes Table Container */}
        <div className="bg-[#1E2532] rounded-lg p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-64">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th
                    className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort('promoCode')}
                  >
                    <div className="flex items-center gap-2">
                      Promo Code
                      <SortIcon columnKey="promoCode" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort('promoType')}
                  >
                    <div className="flex items-center gap-2">
                      Promo Type
                      <SortIcon columnKey="promoType" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort('creationDate')}
                  >
                    <div className="flex items-center gap-2">
                      Creation Date
                      <SortIcon columnKey="creationDate" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort('isUsed')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon columnKey="isUsed" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPromoCodes.map((promo) => (
                  <tr
                    key={promo.id}
                    className="border-b border-gray-700 hover:bg-[#2A3441] transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-200">
                      {promo.promoCode}
                    </td>
                    <td className="py-4 px-4 text-gray-200">
                      <span className="capitalize">{promo.promoType}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-200">
                      {formatDate(promo.creationDate)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`${getStatusColor(
                          promo.isUsed
                        )} text-white px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {promo.isUsed ? 'Used' : 'Available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}

        {/* Assign Promo Code Section */}
        {activeTab === 'assign' && (
          <div className="bg-[#1E2532] rounded-lg p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative w-64">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search users"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th
                      className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        <SortIcon columnKey="name" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center gap-2">
                        Email
                        <SortIcon columnKey="email" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                      onClick={() => handleSort('plan')}
                    >
                      <div className="flex items-center gap-2">
                        Plan
                        <SortIcon columnKey="plan" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        <SortIcon columnKey="status" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-700 hover:bg-[#2A3441] transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-200">{user.name}</td>
                      <td className="py-4 px-4 text-gray-200">{user.email}</td>
                      <td className="py-4 px-4 text-gray-200">{user.plan}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`${getUserStatusColor(
                            user.status
                          )} text-white px-3 py-1 rounded-full text-sm font-medium`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleAssignPromo(user)}
                          className="bg-white text-gray-800 py-1 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Assign Promo Modal */}
      <AssignPromoModal
        open={showAssignModal}
        onClose={handleCloseAssignModal}
        user={selectedUser}
        promoCodes={promoCodes}
      />
    </div>
  );
}
