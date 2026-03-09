'use client';

import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import apiClient from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Notifications({ onNavigate }) {
  // ── Tab ───────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('general');

  // ── Shared user filter state (used by both tabs) ───────────────────────────
  const [userFilter, setUserFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // ── General fields ─────────────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // ── Promotional fields ─────────────────────────────────────────────────────
  const [promoTitle, setPromoTitle] = useState('');
  const [promoBody, setPromoBody] = useState('');
  const [promoLink, setPromoLink] = useState('');
  const [promoImageFile, setPromoImageFile] = useState(null);
  const [promoImagePreview, setPromoImagePreview] = useState('');
  const [promoSendStatus, setPromoSendStatus] = useState(''); // '' | 'uploading' | 'sending'
  const promoFileInputRef = useRef(null);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToastMsg = (type, msg) => {
    setToastType(type);
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ── Fetch users when "Select Users" is chosen ──────────────────────────────
  useEffect(() => {
    if (userFilter === 'select' && users.length === 0) {
      setIsLoadingUsers(true);
      apiClient
        .get('/users/dashboard/all-users')
        .then((response) => {
          if (response.data.isRequestSuccessful) {
            setUsers(response.data.successResponse);
          }
        })
        .catch((error) => console.error('Error fetching users:', error))
        .finally(() => setIsLoadingUsers(false));
    }
  }, [userFilter, users.length]);

  // ── Filtering / sorting ────────────────────────────────────────────────────
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (startDate || endDate) {
      if (!user.createdAt) {
        matchesDate = false;
      } else {
        const d = new Date(user.createdAt);
        if (startDate && startDate > d) matchesDate = false;
        if (endDate) {
          const e = new Date(endDate);
          e.setHours(23, 59, 59, 999);
          if (e < d) matchesDate = false;
        }
      }
    }
    return matchesSearch && matchesDate;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) =>
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });

  const getUserId = (user) => user.id || user.userId;

  const handleUserToggle = (user) => {
    const userId = getUserId(user);
    setSelectedUsers((prev) =>
      prev.find((u) => getUserId(u) === userId)
        ? prev.filter((u) => getUserId(u) !== userId)
        : [...prev, user]
    );
  };

  const removeSelectedUser = (userId) =>
    setSelectedUsers((prev) => prev.filter((u) => getUserId(u) !== userId));

  // ── Build userIds from current filter (shared by both send handlers) ───────
  const buildUserIds = async () => {
    const fetchAll = async () => {
      if (users.length > 0) return users;
      const r = await apiClient.get('/users/dashboard/all-users');
      return r.data.isRequestSuccessful ? r.data.successResponse : [];
    };

    if (userFilter === 'all') {
      return (await fetchAll()).map((u) => getUserId(u));
    } else if (userFilter === 'paid') {
      return (await fetchAll())
        .filter((u) => u.plan && u.plan.toLowerCase() !== 'free' && u.plan.toLowerCase() !== 'none')
        .map((u) => getUserId(u));
    } else if (userFilter === 'unpaid') {
      return (await fetchAll())
        .filter((u) => !u.plan || u.plan.toLowerCase() === 'free' || u.plan.toLowerCase() === 'none')
        .map((u) => getUserId(u));
    } else if (userFilter === 'select') {
      return selectedUsers.map((u) => getUserId(u));
    }
    return [];
  };

  // ── Send General ──────────────────────────────────────────────────────────
  const handleSendNotification = async () => {
    try {
      setIsSending(true);
      const userIds = await buildUserIds();

      if (userIds.length === 0) {
        showToastMsg('error', 'No users selected to send notification');
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

  // ── Image helpers ─────────────────────────────────────────────────────────
  const handlePromoImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToastMsg('error', 'Image size must not exceed 5MB');
        if (promoFileInputRef.current) promoFileInputRef.current.value = '';
        return;
      }
      setPromoImageFile(file);
      setPromoImagePreview(URL.createObjectURL(file));
    }
  };

  const removePromoImage = (e) => {
    e.stopPropagation();
    setPromoImageFile(null);
    setPromoImagePreview('');
    if (promoFileInputRef.current) promoFileInputRef.current.value = '';
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await apiClient.post('/upload/image', formData, {
        headers: { 'Content-Type': undefined },
      });
      if (response.data.isRequestSuccessful && response.data.successResponse?.url) {
        return response.data.successResponse.url;
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
    return null;
  };

  // ── Send Promotional ──────────────────────────────────────────────────────
  const handleSendPromotional = async () => {
    if (!promoLink.trim()) {
      showToastMsg('error', 'Promotional URL is required');
      return;
    }
    try {
      let imageUrl = '';
      if (promoImageFile) {
        setPromoSendStatus('uploading');
        const uploaded = await uploadImage(promoImageFile);
        if (uploaded) imageUrl = uploaded;
      }

      setPromoSendStatus('sending');
      const userIds = await buildUserIds();

      if (userIds.length === 0) {
        showToastMsg('error', 'No users selected to send notification');
        setPromoSendStatus('');
        return;
      }

      let response;
      if (userIds.length === 1) {
        response = await apiClient.post('/notifications/send-promotional', {
          userId: userIds[0],
          title: promoTitle,
          body: promoBody,
          imageUrl,
          link: promoLink,
        });
      } else {
        response = await apiClient.post('/notifications/send-bulk-promotional', {
          userIds,
          title: promoTitle,
          body: promoBody,
          imageUrl,
          link: promoLink,
        });
      }

      if (response.data.isRequestSuccessful) {
        showToastMsg('success', response.data.errorDetail?.message || 'Promotional notification sent!');
        setPromoTitle('');
        setPromoBody('');
        setPromoLink('');
        setPromoImageFile(null);
        setPromoImagePreview('');
        setSelectedUsers([]);
        if (promoFileInputRef.current) promoFileInputRef.current.value = '';
      } else {
        showToastMsg('error', response.data.errorDetail?.message || 'Failed to send promotional notification');
      }
    } catch (error) {
      console.error('Error sending promotional notification:', error);
      showToastMsg('error', 'An error occurred while sending promotional notification');
    } finally {
      setPromoSendStatus('');
    }
  };

  // ── Misc ──────────────────────────────────────────────────────────────────
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  const tableColumns = [
    ['name', 'Name'],
    ['email', 'Email'],
    ['role', 'Role'],
    ['signupMethod', 'Signup Method'],
    ['createdAt', 'Created At'],
    ['status', 'Status'],
    ['plan', 'Plan'],
    ['isProfileCompleted', 'Profile Completed'],
  ];

  // ── Shared UI pieces ──────────────────────────────────────────────────────
  const UserFilterRadios = () => (
    <div className="flex items-center gap-6 mb-6">
      {[
        ['all', 'All Users'],
        ['paid', 'Paid Users'],
        ['unpaid', 'Unpaid Users'],
        ['select', 'Select Users'],
      ].map(([val, label]) => (
        <label key={val} className="flex items-center gap-2 text-white cursor-pointer">
          <input
            type="radio"
            name="userFilter"
            value={val}
            checked={userFilter === val}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-4 h-4 accent-blue-500"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );

  const SelectedChips = () =>
    userFilter === 'select' && selectedUsers.length > 0 ? (
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedUsers.map((user, index) => (
          <div
            key={user.id || user.userId || `sel-${index}`}
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
    ) : null;

  const UserTable = () =>
    userFilter === 'select' ? (
      <>
        <div className="flex items-end gap-6 mb-6">
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
        </div>

        <div className="h-96 overflow-auto mb-6">
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
      </>
    ) : null;

  // ── JSX ───────────────────────────────────────────────────────────────────
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

          {/* ── GENERAL TAB ──────────────────────────────────────────────── */}
          {activeTab === 'general' && (
            <>
              <UserFilterRadios />
              <SelectedChips />

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
                  className={`bg-white text-gray-800 py-2 px-6 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isSending ? '' : 'hover:bg-gray-100'}`}
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

          {/* ── PROMOTIONAL TAB ──────────────────────────────────────────── */}
          {activeTab === 'promotional' && (
            <>
              <UserFilterRadios />
              <SelectedChips />

              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Notification Title</label>
                <input
                  type="text"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full px-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Notification Message</label>
                <textarea
                  value={promoBody}
                  onChange={(e) => setPromoBody(e.target.value)}
                  placeholder="write here"
                  className="w-full px-4 py-3 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
                <div className="text-gray-400 text-sm mt-1">{promoBody.length}/1000 characters</div>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">Promotional Image (optional)</label>
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => promoFileInputRef.current?.click()}
                >
                  {promoImagePreview ? (
                    <div className="flex items-center gap-4">
                      <img src={promoImagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
                      <div>
                        <p className="text-white text-sm">{promoImageFile?.name}</p>
                        <button onClick={removePromoImage} className="text-red-400 hover:text-red-300 text-xs mt-1">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400 text-sm">Click to upload image</p>
                      <p className="text-gray-500 text-xs mt-1">PNG, JPG, JPEG · Max 5MB</p>
                    </div>
                  )}
                  <input
                    ref={promoFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePromoImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Promotional Link */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm mb-2">Promotional Link <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={promoLink}
                  onChange={(e) => setPromoLink(e.target.value)}
                  placeholder="https://example.com/offer"
                  className="w-full px-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <UserTable />

              <div className="flex justify-end">
                <button
                  onClick={handleSendPromotional}
                  disabled={!promoTitle || !promoBody || !promoLink || !!promoSendStatus}
                  className={`bg-white text-gray-800 py-2 px-6 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${promoSendStatus ? '' : 'hover:bg-gray-100'}`}
                >
                  {promoSendStatus === 'uploading' ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                      <span>Uploading image...</span>
                    </div>
                  ) : promoSendStatus === 'sending' ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Promotional'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          className={`fixed bottom-8 right-8 ${
            toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up`}
        >
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
