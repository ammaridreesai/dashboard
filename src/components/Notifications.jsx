'use client';

import { useState } from 'react';
import Header from './Header';

export default function Notifications() {
  const [userFilter, setUserFilter] = useState('all'); // 'all', 'paid', 'unpaid', 'select'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Sample user data
  const [users] = useState([
    {
      id: 1,
      name: 'Ali Farhan',
      email: 'ali@gmail.com',
      role: 'Ali Farhan',
      signupMethod: 'Google',
      createdAt: 'Jan-20-2025',
      status: 'Active',
      plan: 'Free',
    },
    {
      id: 2,
      name: 'Sara Khan',
      email: 'sara.n@gmail.com',
      role: 'Sara Khan',
      signupMethod: 'Apple',
      createdAt: 'Feb-15-2024',
      status: 'Active',
      plan: 'Paid',
    },
    {
      id: 3,
      name: 'John Doe',
      email: 'john.d@gmail.com',
      role: 'John Doe',
      signupMethod: 'Email',
      createdAt: 'Mar-10-2023',
      status: 'Banned',
      plan: 'Free',
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily@gmail.com',
      role: 'Emily Chen',
      signupMethod: 'Guest',
      createdAt: 'Apr-05-2026',
      status: 'Active',
      plan: 'Paid',
    },
    {
      id: 5,
      name: 'Michael Smith',
      email: 'michael@gmail.com',
      role: 'Michael Smith',
      signupMethod: 'Apple',
      createdAt: 'May-12-2023',
      status: 'Pending',
      plan: 'Free',
    },
  ]);

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

  // Handle user selection
  const handleUserToggle = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      if (exists) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  // Remove selected user chip
  const removeSelectedUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // Handle send notification
  const handleSendNotification = () => {
    let payload = {
      title,
      message,
      ids: [],
    };

    if (userFilter === 'all') {
      payload.ids = users.map((u) => u.id);
    } else if (userFilter === 'paid') {
      payload.ids = users.filter((u) => u.plan === 'Paid').map((u) => u.id);
    } else if (userFilter === 'unpaid') {
      payload.ids = users.filter((u) => u.plan === 'Free').map((u) => u.id);
    } else if (userFilter === 'select') {
      payload.ids = selectedUsers.map((u) => u.id);
    }

    console.log('Notification Payload:', payload);
    // Here you would send the payload to your API
    alert('Notification sent! Check console for payload.');
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
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 bg-[#2C3947] text-white px-3 py-1 rounded-full text-sm"
                >
                  <span>{user.name}</span>
                  <button
                    onClick={() => removeSelectedUser(user.id)}
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
                    {sortedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-700 hover:bg-[#2A3441] transition-colors"
                      >
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-blue-500"
                            checked={selectedUsers.some((u) => u.id === user.id)}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Send Notification Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSendNotification}
              disabled={!title || !message}
              className="bg-white text-gray-800 py-2 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
