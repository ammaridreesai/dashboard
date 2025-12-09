'use client';

import { useState } from 'react';
import Header from './Header';

// Dummy data
const statsCards = [
  { title: 'Total Users', value: '100k', bgColor: 'bg-[#1E2532]' },
  { title: 'Active Users', value: '60k', bgColor: 'bg-[#1E2532]' },
  { title: 'Premium Accounts', value: '40k', bgColor: 'bg-[#1E2532]' },
  { title: 'Free Accounts', value: '20k', bgColor: 'bg-[#1E2532]' },
];

const subscriptionData = [
  { label: 'Monthly Subscriptions', color: 'bg-emerald-500', percentage: 35 },
  { label: 'Yearly Subscriptions', color: 'bg-yellow-500', percentage: 25 },
  { label: 'Without Subscription', color: 'bg-red-500', percentage: 25 },
  { label: 'Free Trials', color: 'bg-gray-300', percentage: 15 },
];

const usersData = [
  {
    name: 'Ali Farhan',
    email: 'ali@gmail.com',
    role: 'Ali Farhan',
    signupMethod: 'Google',
    createdAt: 'Jan-20-2025',
    status: 'Active',
    plan: 'Free',
  },
  {
    name: 'John Doe',
    email: 'john.d@gmail.com',
    role: 'John Doe',
    signupMethod: 'Email',
    createdAt: 'Mar-10-2023',
    status: 'Banned',
    plan: 'Free',
  },
  {
    name: 'sara.n@gmail.com',
    email: 'sara.n@gmail.com',
    role: 'Emily Chen',
    signupMethod: 'Guest',
    createdAt: 'Apr-05-2026',
    status: 'Active',
    plan: 'Paid',
  },
  {
    name: 'Sara Khan',
    email: 'sara.n@gmail.com',
    role: 'David Lee',
    signupMethod: 'Apple',
    createdAt: 'Jul-20-2024',
    status: 'Pending',
    plan: 'Paid',
  },
  {
    name: 'Michael Smith',
    email: 'michael@gmail.com',
    role: 'Olivia Brown',
    signupMethod: 'Google',
    createdAt: 'Aug-30-2023',
    status: 'Active',
    plan: 'Free',
  },
];

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState('Nov-2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filter and sort users
  const filteredAndSortedUsers = usersData
    .filter(user => {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.signupMethod.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query) ||
        user.plan.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a[sortField].toString().toLowerCase();
      const bValue = b[sortField].toString().toLowerCase();

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="ml-64 min-h-screen bg-[#2C3947]">
      <Header />

      {/* Main Content */}
      <main className="p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className={`${card.bgColor} rounded-xl p-6`}>
              <h3 className="text-gray-400 text-sm mb-2">{card.title}</h3>
              <p className="text-white text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* App Downloads Overview */}
          <div className="bg-[#1E2532] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">App Downloads Overview</h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Nov-2026</option>
                <option>Oct-2026</option>
                <option>Sep-2026</option>
              </select>
            </div>

            {/* Chart Container */}
            <div className="relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 flex flex-col justify-between h-48 text-gray-400 text-xs pr-2">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              {/* Chart */}
              <div className="ml-8 relative h-48">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="0" x2="600" y2="0" stroke="#374151" strokeWidth="1" />
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#374151" strokeWidth="1" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#374151" strokeWidth="1" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#374151" strokeWidth="1" />
                  <line x1="0" y1="200" x2="600" y2="200" stroke="#374151" strokeWidth="1" />

                  {/* Line chart with gradient */}
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Area under the line */}
                  <polygon
                    fill="url(#lineGradient)"
                    points="0,150 100,120 200,130 300,110 400,80 500,60 600,70 600,200 0,200"
                  />

                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="0,150 100,120 200,130 300,110 400,80 500,60 600,70"
                  />

                  {/* Data points */}
                  <circle cx="0" cy="150" r="4" fill="#22c55e" />
                  <circle cx="100" cy="120" r="4" fill="#22c55e" />
                  <circle cx="200" cy="130" r="4" fill="#22c55e" />
                  <circle cx="300" cy="110" r="4" fill="#22c55e" />
                  <circle cx="400" cy="80" r="4" fill="#22c55e" />
                  <circle cx="500" cy="60" r="4" fill="#22c55e" />
                  <circle cx="600" cy="70" r="4" fill="#22c55e" />
                </svg>
              </div>

              {/* X-axis labels */}
              <div className="ml-8 flex justify-between text-gray-400 text-xs mt-2">
                <span>1st week</span>
                <span>2nd week</span>
                <span>3rd week</span>
                <span>4th week</span>
              </div>
            </div>
          </div>

          {/* Subscriptions Overview */}
          <div className="bg-[#1E2532] rounded-xl p-6">
            <h2 className="text-white text-xl font-semibold mb-6">Subscriptions Overview</h2>

            <div className="flex items-center justify-between">
              {/* Donut Chart */}
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#1E2532"
                    strokeWidth="15"
                  />

                  {/* Green segment (Monthly) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="15"
                    strokeDasharray="87.5 250"
                    strokeDashoffset="0"
                  />

                  {/* Yellow segment (Yearly) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="15"
                    strokeDasharray="62.5 250"
                    strokeDashoffset="-87.5"
                  />

                  {/* Red segment (Without) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="15"
                    strokeDasharray="62.5 250"
                    strokeDashoffset="-150"
                  />

                  {/* Gray segment (Free Trials) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="15"
                    strokeDasharray="37.5 250"
                    strokeDashoffset="-212.5"
                  />
                </svg>
              </div>

              {/* Legend */}
              <div className="space-y-4">
                {subscriptionData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-gray-300 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#1E2532] rounded-xl p-6">
          <div className="mb-4">
            <div className="relative max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th
                    className="text-left py-3 px-4 text-white font-medium cursor-pointer hover:text-gray-300"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white font-medium cursor-pointer hover:text-gray-300"
                    onClick={() => handleSort('email')}
                  >
                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white font-medium cursor-pointer hover:text-gray-300"
                    onClick={() => handleSort('role')}
                  >
                    Role {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white font-medium cursor-pointer hover:text-gray-300"
                    onClick={() => handleSort('signupMethod')}
                  >
                    Signup Method {sortField === 'signupMethod' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white font-medium cursor-pointer hover:text-gray-300"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created At {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white font-medium cursor-pointer hover:text-gray-300"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white font-medium cursor-pointer hover:text-gray-300"
                    onClick={() => handleSort('plan')}
                  >
                    Plan {sortField === 'plan' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.map((user, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-[#2A3441]">
                    <td className="py-3 px-4 text-white">{user.name}</td>
                    <td className="py-3 px-4 text-gray-300">{user.email}</td>
                    <td className="py-3 px-4 text-gray-300">{user.role}</td>
                    <td className="py-3 px-4 text-gray-300">{user.signupMethod}</td>
                    <td className="py-3 px-4 text-gray-300">{user.createdAt}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                          user.status === 'Active'
                            ? 'bg-emerald-500'
                            : user.status === 'Banned'
                            ? 'bg-red-500'
                            : 'bg-orange-500'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{user.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
