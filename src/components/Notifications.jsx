'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import apiClient from '../services/api';

export default function Notifications() {
  const [userFilter, setUserFilter] = useState('all'); // 'all', 'paid', 'unpaid', 'select'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'

  // Fetch users from API when "Select Users" is selected
  useEffect(() => {
    const fetchUsers = async () => {
      if (userFilter === 'select' && users.length === 0) {
        setIsLoadingUsers(true);
        try {
          const response = await apiClient.get('/users/dashboard/all-users');
          if (response.data.isRequestSuccessful) {
            setUsers(response.data.successResponse);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setIsLoadingUsers(false);
        }
      }
    };

    fetchUsers();
  }, [userFilter, users.length]);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Get user identifier (handle both id and userId)
  const getUserId = (user) => user.id || user.userId;

  // Handle user selection
  const handleUserToggle = (user) => {
    setSelectedUsers((prev) => {
      const userId = getUserId(user);
      const exists = prev.find((u) => getUserId(u) === userId);
      if (exists) {
        return prev.filter((u) => getUserId(u) !== userId);
      } else {
        return [...prev, user];
      }
    });
  };

  // Remove selected user chip
  const removeSelectedUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => getUserId(u) !== userId));
  };

  // Handle send notification
  const handleSendNotification = async () => {
    try {
      setIsSending(true);
      let userIds = [];

      if (userFilter === 'all') {
        // Fetch all users if not already loaded
        if (users.length === 0) {
          const response = await apiClient.get('/users/dashboard/all-users');
          if (response.data.isRequestSuccessful) {
            userIds = response.data.successResponse.map((u) => getUserId(u));
          }
        } else {
          userIds = users.map((u) => getUserId(u));
        }
      } else if (userFilter === 'paid') {
        // Fetch all users and filter paid (non-free) users
        if (users.length === 0) {
          const response = await apiClient.get('/users/dashboard/all-users');
          if (response.data.isRequestSuccessful) {
            userIds = response.data.successResponse
              .filter((u) => u.plan && u.plan.toLowerCase() !== 'free' && u.plan.toLowerCase() !== 'none')
              .map((u) => getUserId(u));
          }
        } else {
          userIds = users
            .filter((u) => u.plan && u.plan.toLowerCase() !== 'free' && u.plan.toLowerCase() !== 'none')
            .map((u) => getUserId(u));
        }
      } else if (userFilter === 'unpaid') {
        // Fetch all users and filter unpaid (free) users
        if (users.length === 0) {
          const response = await apiClient.get('/users/dashboard/all-users');
          if (response.data.isRequestSuccessful) {
            userIds = response.data.successResponse
              .filter((u) => !u.plan || u.plan.toLowerCase() === 'free' || u.plan.toLowerCase() === 'none')
              .map((u) => getUserId(u));
          }
        } else {
          userIds = users
            .filter((u) => !u.plan || u.plan.toLowerCase() === 'free' || u.plan.toLowerCase() === 'none')
            .map((u) => getUserId(u));
        }
      } else if (userFilter === 'select') {
        userIds = selectedUsers.map((u) => getUserId(u));
      }

      if (userIds.length === 0) {
        setToastType('error');
        setToastMessage('No users selected to send notification');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setIsSending(false);
        return;
      }

      const payload = {
        userIds: userIds,
        title: title,
        body: message,
      };

      const response = await apiClient.post('/notifications/send-bulk', payload);

      if (response.data.isRequestSuccessful) {
        setToastType('success');
        setToastMessage(response.data.errorDetail?.message || 'Notifications sent successfully!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Reset form
        setTitle('');
        setMessage('');
        setSelectedUsers([]);
      } else {
        setToastType('error');
        setToastMessage(response.data.errorDetail?.message || 'Failed to send notifications');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setToastType('error');
      setToastMessage('An error occurred while sending notifications');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSending(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
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
          <span>Notifications</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-semibold text-white mb-8">Notifications</h1>

        {/* Notification Form Container */}
        <div className="bg-[#1E2532] rounded-lg p-6">
          {/* User Filter Radio Buttons */}
          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="radio"
                name="userFilter"
                value="all"
                checked={userFilter === 'all'}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-4 h-4 accent-blue-500"
              />
              <span>All Users</span>
            </label>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="radio"
                name="userFilter"
                value="paid"
                checked={userFilter === 'paid'}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-4 h-4 accent-blue-500"
              />
              <span>Paid Users</span>
            </label>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="radio"
                name="userFilter"
                value="unpaid"
                checked={userFilter === 'unpaid'}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-4 h-4 accent-blue-500"
              />
              <span>Unpaid Users</span>
            </label>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="radio"
                name="userFilter"
                value="select"
                checked={userFilter === 'select'}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-4 h-4 accent-blue-500"
              />
              <span>Select Users</span>
            </label>
          </div>

          {/* Selected Users Chips */}
          {userFilter === 'select' && selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedUsers.map((user, index) => (
                <div
                  key={user.id || user.userId || `selected-${index}`}
                  className="flex items-center gap-2 bg-[#2C3947] text-white px-3 py-1 rounded-full text-sm"
                >
                  <span>{user.name}</span>
                  <button
                    onClick={() => removeSelectedUser(getUserId(user))}
                    className="hover:text-red-400"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Title Field */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full px-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notification Message */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">
              Notification Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="write here"
              className="w-full px-4 py-3 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            <div className="text-gray-400 text-sm mt-1">
              {message.length}/1000 characters
            </div>
          </div>

          {/* Users Grid - Only show when "Select Users" is selected */}
          {userFilter === 'select' && (
            <>
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

              {/* Users Table */}
              <div className="overflow-x-auto mb-6">
                {isLoadingUsers ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-blue-500"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(sortedUsers);
                              } else {
                                setSelectedUsers([]);
                              }
                            }}
                            checked={
                              selectedUsers.length === sortedUsers.length &&
                              sortedUsers.length > 0
                            }
                          />
                        </th>
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
                          onClick={() => handleSort('role')}
                        >
                          <div className="flex items-center gap-2">
                            Role
                            <SortIcon columnKey="role" />
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                          onClick={() => handleSort('signupMethod')}
                        >
                          <div className="flex items-center gap-2">
                            Signup Method
                            <SortIcon columnKey="signupMethod" />
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                          onClick={() => handleSort('createdAt')}
                        >
                          <div className="flex items-center gap-2">
                            Created At
                            <SortIcon columnKey="createdAt" />
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
                        <th
                          className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                          onClick={() => handleSort('plan')}
                        >
                          <div className="flex items-center gap-2">
                            Plan
                            <SortIcon columnKey="plan" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedUsers.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="py-8 text-center text-gray-400">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        sortedUsers.map((user, index) => (
                          <tr
                            key={user.id || user.userId || `user-${index}`}
                            className="border-b border-gray-700 hover:bg-[#2A3441] transition-colors"
                          >
                            <td className="py-4 px-4">
                              <input
                                type="checkbox"
                                className="w-4 h-4 accent-blue-500"
                                checked={selectedUsers.some((u) => getUserId(u) === getUserId(user))}
                                onChange={() => handleUserToggle(user)}
                              />
                            </td>
                            <td className="py-4 px-4 text-gray-200">{user.name}</td>
                            <td className="py-4 px-4 text-gray-200">{user.email}</td>
                            <td className="py-4 px-4 text-gray-200">{user.role}</td>
                            <td className="py-4 px-4 text-gray-200">
                              {user.signupMethod}
                            </td>
                            <td className="py-4 px-4 text-gray-200">
                              {user.createdAt}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`${getStatusColor(
                                  user.status
                                )} text-white px-3 py-1 rounded-full text-sm font-medium`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-200">{user.plan}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* Send Notification Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSendNotification}
              disabled={!title || !message || isSending}
              className={`bg-white text-gray-800 py-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isSending ? '' : 'hover:bg-gray-100'
              }`}
            >
              {isSending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Notification'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-8 right-8 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up`}>
          {toastType === 'success' ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          <span className="font-medium">{toastMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            className="ml-4 text-white hover:text-gray-200 cursor-pointer"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
