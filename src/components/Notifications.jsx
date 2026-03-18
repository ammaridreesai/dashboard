'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import apiClient from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const tableColumns = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['role', 'Role'],
  ['signupMethod', 'Signup Method'],
  ['createdAt', 'Joining Date'],
  ['status', 'Status'],
  ['plan', 'Plan'],
  ['isProfileCompleted', 'Profile Completed'],
];

export default function Notifications({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('general');
  const [userFilter, setUserFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersTotalCount, setUsersTotalCount] = useState(0);
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedDateRange, setAppliedDateRange] = useState([null, null]);
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToastMsg = (type, msg) => {
    setToastType(type);
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch users when "Select Users" is chosen (server-side filtering)
  useEffect(() => {
    if (userFilter !== 'select') return;
    const [appliedStart, appliedEnd] = appliedDateRange;
    const formatDate = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const params = new URLSearchParams({ page: usersPage, limit: 50 });
    if (appliedSearch.trim()) params.append('search', appliedSearch.trim());
    if (appliedStart) params.append('dateFrom', formatDate(appliedStart));
    if (appliedStart) params.append('dateTo', formatDate(appliedEnd ?? appliedStart));

    setIsLoadingUsers(true);
    apiClient
      .get(`/users/dashboard/all-users?${params.toString()}`)
      .then((response) => {
        if (response.data.isRequestSuccessful) {
          const res = response.data.successResponse;
          setUsers(res.data ?? []);
          const total = res.total ?? 0;
          setUsersTotalCount(total);
          setUsersTotalPages(Math.ceil(total / 50) || 1);
        }
      })
      .catch((error) => console.error('Error fetching users:', error))
      .finally(() => setIsLoadingUsers(false));
  }, [userFilter, usersPage, appliedSearch, appliedDateRange]);

  // Reset to page 1 when applied filters change
  useEffect(() => {
    setUsersPage(1);
  }, [userFilter, appliedSearch, appliedDateRange]);

  const handleApplyFilters = () => {
    setAppliedSearch(searchTerm);
    setAppliedDateRange(dateRange);
  };

  // Sort only (filtering is server-side)
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const getUserId = (user) => user.id || user.userId;

  const handleUserToggle = (user) => {
    setSelectedUsers((prev) => {
      const userId = getUserId(user);
      const exists = prev.find((u) => getUserId(u) === userId);
      if (exists) return prev.filter((u) => getUserId(u) !== userId);
      return [...prev, user];
    });
  };

  const removeSelectedUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => getUserId(u) !== userId));
  };

  const handleSendNotification = async () => {
    try {
      setIsSending(true);
      let userIds = [];

      if (userFilter === 'all') {
        if (users.length === 0) {
          const response = await apiClient.get('/users/dashboard/all-users');
          if (response.data.isRequestSuccessful) {
            userIds = response.data.successResponse.map((u) => getUserId(u));
          }
        } else {
          userIds = users.map((u) => getUserId(u));
        }
      } else if (userFilter === 'paid') {
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
        showToastMsg('error', 'No users selected to send notification');
        setIsSending(false);
        return;
      }

      let response;
      if (userIds.length === 1) {
        response = await apiClient.post('/notifications/send-notification', {
          Id: userIds[0],
          title,
          body: message,
        });
      } else {
        response = await apiClient.post('/notifications/send-bulk', {
          userIds,
          title,
          body: message,
        });
      }

      if (response.data.isRequestSuccessful) {
        showToastMsg('success', response.data.errorDetail?.message || 'Notifications sent successfully!');
        setTitle('');
        setMessage('');
        setSelectedUsers([]);
      } else {
        showToastMsg('error', response.data.errorDetail?.message || 'Failed to send notifications');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      showToastMsg('error', 'An error occurred while sending notifications');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'banned': return 'bg-red-500';
      case 'pending': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const UserTable = () =>
    userFilter === 'select' ? (
      <>
        <div className="flex items-end gap-3 mb-6">
          <div className="relative w-64">
            <label className="block text-gray-300 text-sm mb-1">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="pl-10 pr-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Joining Date</label>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable
              placeholderText="Select date range"
              dateFormat="MMM dd, yyyy"
              className="px-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>

        <div className="overflow-auto mb-4">
          {isLoadingUsers ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-[#1E2532] z-10">
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 text-sm font-medium whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-500"
                      onChange={(e) =>
                        e.target.checked ? setSelectedUsers(sortedUsers) : setSelectedUsers([])
                      }
                      checked={selectedUsers.length === sortedUsers.length && sortedUsers.length > 0}
                    />
                  </th>
                  {tableColumns.map(([key, label]) => (
                    <th
                      key={key}
                      className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center gap-2">
                        {label}
                        <SortIcon columnKey={key} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-gray-400">No users found</td>
                  </tr>
                ) : (
                  sortedUsers.map((user, index) => (
                    <tr
                      key={user.id || user.userId || `u-${index}`}
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
                      <td className="py-4 px-4 text-gray-200 text-sm">{user.name}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{user.email}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{user.role}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{user.signupMethod}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{user.createdAt}</td>
                      <td className="py-4 px-4">
                        <span className={`${getStatusColor(user.status)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{user.plan}</td>
                      <td className="py-4 px-4">
                        <span className={`${user.isProfileCompleted ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                          {user.isProfileCompleted ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoadingUsers && usersTotalPages > 1 && (
          <div className="mt-2 mb-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing{' '}
              <span className="text-white font-medium">
                {(usersPage - 1) * 50 + 1}–{Math.min(usersPage * 50, usersTotalCount)}
              </span>{' '}
              of <span className="text-white font-medium">{usersTotalCount}</span> users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                disabled={usersPage === 1}
                className="px-3 py-1.5 rounded text-sm text-gray-300 hover:bg-[#2C3947] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ‹ Prev
              </button>
              {Array.from({ length: usersTotalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === usersTotalPages || (p >= usersPage - 2 && p <= usersPage + 2))
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`e-${idx}`} className="px-2 text-gray-500">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setUsersPage(item)}
                      className={`px-3 py-1.5 rounded text-sm transition-colors ${
                        usersPage === item ? 'bg-blue-600 text-white font-medium' : 'text-gray-300 hover:bg-[#2C3947]'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              <button
                onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                disabled={usersPage === usersTotalPages}
                className="px-3 py-1.5 rounded text-sm text-gray-300 hover:bg-[#2C3947] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </>
    ) : null;

  return (
    <div className="flex-1 ml-48 bg-[#2C3947] min-h-screen">
      <Header />

      <div className="p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-400 mb-6">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-white cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <span>&gt;</span>
          <span>Notifications</span>
        </div>

        <h1 className="text-3xl font-semibold text-white mb-8">Notifications</h1>

        <div className="bg-[#1E2532] rounded-lg p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'general' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('promotional')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'promotional' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              Promotional
            </button>
          </div>

          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              {/* User Filter Radio Buttons */}
              <div className="flex items-center gap-6 mb-6">
                {[
                  { value: 'all', label: 'All Users' },
                  { value: 'paid', label: 'Paid Users' },
                  { value: 'unpaid', label: 'Unpaid Users' },
                  { value: 'select', label: 'Select Users' },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="radio"
                      name="userFilter"
                      value={value}
                      checked={userFilter === value}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span>{label}</span>
                  </label>
                ))}
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
                      <button onClick={() => removeSelectedUser(getUserId(user))} className="hover:text-red-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Notification Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full px-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 text-sm mb-2">Notification Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="write here"
                  className="w-full px-4 py-3 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
                <div className="text-gray-400 text-sm mt-1">{message.length}/1000 characters</div>
              </div>

              <UserTable />

              <div className="flex justify-end">
                <button
                  onClick={handleSendNotification}
                  disabled={!title || !message || isSending}
                  className={`bg-white text-gray-800 py-2 px-6 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
            </>
          )}

          {/* Promotional Tab */}
          {activeTab === 'promotional' && (
            <div className="text-gray-400 py-8 text-center">
              Promotional notifications coming soon.
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-8 right-8 ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up`}>
          {toastType === 'success' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium">{toastMessage}</span>
          <button onClick={() => setShowToast(false)} className="ml-4 text-white hover:text-gray-200 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
