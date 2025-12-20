"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import apiClient from "../services/api";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [statsCards, setStatsCards] = useState([
    { title: "Total Users", value: "0", bgColor: "bg-[#1E2532]" },
    { title: "Active Users", value: "0", bgColor: "bg-[#1E2532]" },
    { title: "Premium Accounts", value: "0", bgColor: "bg-[#1E2532]" },
    { title: "Free Accounts", value: "0", bgColor: "bg-[#1E2532]" },
  ]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const getColorByLabel = (label) => {
    const colorMap = {
      "Monthly Subscriptions": "bg-emerald-500",
      "Yearly Subscriptions": "bg-yellow-500",
      "Without Subscription": "bg-red-500",
      "Free Trials": "bg-gray-300",
    };
    return colorMap[label] || "bg-gray-400";
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user stats
        const userStatsResponse = await apiClient.get(
          "/users/dashboard/user-stats"
        );
        if (userStatsResponse.data.isRequestSuccessful) {
          const statsData = userStatsResponse.data.successResponse.map(
            (stat) => ({
              title: stat.title,
              value: stat.value,
              bgColor: "bg-[#1E2532]",
            })
          );
          setStatsCards(statsData);
        }
        setIsLoadingStats(false);

        // Fetch subscription stats
        const subscriptionStatsResponse = await apiClient.get(
          "/users/dashboard/subscription-stats"
        );
        if (subscriptionStatsResponse.data.isRequestSuccessful) {
          const subscriptionStatsData =
            subscriptionStatsResponse.data.successResponse.map((stat) => ({
              label: stat.label,
              percentage: stat.percentage,
              color: getColorByLabel(stat.label),
            }));
          setSubscriptionData(subscriptionStatsData);
        }
        setIsLoadingSubscriptions(false);

        // Fetch all users
        const allUsersResponse = await apiClient.get("/users/dashboard/all-users");
        if (allUsersResponse.data.isRequestSuccessful) {
          setUsersData(allUsersResponse.data.successResponse);
        }
        setIsLoadingUsers(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoadingStats(false);
        setIsLoadingSubscriptions(false);
        setIsLoadingUsers(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter and sort users
  const filteredAndSortedUsers = usersData
    .filter((user) => {
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

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="ml-48 min-h-screen bg-[#2C3947]">
      <Header />

      {/* Main Content */}
      <main className="p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoadingStats
            ? // Loading skeleton
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-[#1E2532] rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-700 rounded w-16"></div>
                  </div>
                ))
            : statsCards.map((card, index) => (
                <div key={index} className={`${card.bgColor} rounded-xl p-6`}>
                  <h3 className="text-gray-400 text-sm mb-2">{card.title}</h3>
                  <p className="text-white text-2xl font-bold">{card.value}</p>
                </div>
              ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* App Downloads Overview */}
          <div className="bg-[#1E2532] rounded-xl p-6 relative">
            <div className="blur-sm pointer-events-none">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-semibold">
                  App Downloads Overview
                </h2>
                <select
                  className="px-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Nov-2026</option>
                  <option>Oct-2026</option>
                  <option>Sep-2026</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute left-0 top-0 flex flex-col justify-between h-48 text-gray-400 text-xs pr-2">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                <div className="ml-8 relative h-48">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 600 200"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="600"
                      y2="0"
                      stroke="#374151"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="50"
                      x2="600"
                      y2="50"
                      stroke="#374151"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="100"
                      x2="600"
                      y2="100"
                      stroke="#374151"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="150"
                      x2="600"
                      y2="150"
                      stroke="#374151"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="200"
                      x2="600"
                      y2="200"
                      stroke="#374151"
                      strokeWidth="1"
                    />

                    <defs>
                      <linearGradient
                        id="lineGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <polygon
                      fill="url(#lineGradient)"
                      points="0,150 100,120 200,130 300,110 400,80 500,60 600,70 600,200 0,200"
                    />

                    <polyline
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="0,150 100,120 200,130 300,110 400,80 500,60 600,70"
                    />

                    <circle cx="0" cy="150" r="4" fill="#22c55e" />
                    <circle cx="100" cy="120" r="4" fill="#22c55e" />
                    <circle cx="200" cy="130" r="4" fill="#22c55e" />
                    <circle cx="300" cy="110" r="4" fill="#22c55e" />
                    <circle cx="400" cy="80" r="4" fill="#22c55e" />
                    <circle cx="500" cy="60" r="4" fill="#22c55e" />
                    <circle cx="600" cy="70" r="4" fill="#22c55e" />
                  </svg>
                </div>

                <div className="ml-8 flex justify-between text-gray-400 text-xs mt-2">
                  <span>1st week</span>
                  <span>2nd week</span>
                  <span>3rd week</span>
                  <span>4th week</span>
                </div>
              </div>
            </div>

            {/* Under Development Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#1E2532]/50 rounded-xl">
              <div className="text-center">
                <div className="text-yellow-500 text-lg font-semibold mb-2">
                  Under Development
                </div>
                <div className="text-gray-400 text-sm">
                  This feature is coming soon
                </div>
              </div>
            </div>
          </div>

          {/* Subscriptions Overview */}
          <div className="bg-[#1E2532] rounded-xl p-6">
            <h2 className="text-white text-2xl font-semibold mb-6">
              Subscriptions Overview
            </h2>

            {isLoadingSubscriptions ? (
              <div className="flex items-center justify-between animate-pulse">
                {/* Skeleton for Legend */}
                <div className="space-y-4 flex-1 mr-8">
                  {Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                        <div className="h-4 bg-gray-700 rounded w-40"></div>
                      </div>
                    ))}
                </div>

                {/* Skeleton for Donut Chart */}
                <div className="w-48 h-48 rounded-full bg-gray-700"></div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                {/* Legend */}
                <div className="space-y-4">
                  {subscriptionData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${item.color}`}
                      ></div>
                      <span className="text-gray-300 text-sm">
                        {item.label} ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>

                {/* Donut Chart */}
                <div className="relative w-48 h-48">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#1E2532"
                      strokeWidth="15"
                    />

                    {/* Dynamic segments based on API data */}
                    {(() => {
                      let cumulativeOffset = 0;
                      const circumference = 2 * Math.PI * 40;

                      const colorTailwindToHex = {
                        "bg-emerald-500": "#22c55e",
                        "bg-yellow-500": "#eab308",
                        "bg-red-500": "#ef4444",
                        "bg-gray-300": "#d1d5db",
                        "bg-gray-400": "#9ca3af",
                      };

                      return subscriptionData.map((item, index) => {
                        const strokeLength =
                          (item.percentage / 100) * circumference;
                        const offset = -cumulativeOffset;
                        cumulativeOffset += strokeLength;

                        return (
                          <circle
                            key={index}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={colorTailwindToHex[item.color] || "#9ca3af"}
                            strokeWidth="15"
                            strokeDasharray={`${strokeLength} ${circumference}`}
                            strokeDashoffset={offset}
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>
              </div>
            )}
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

          <div className="h-96 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#1E2532] z-10">
                <tr className="border-b border-gray-700">
                  <th
                    className="text-left py-3 px-4 text-white text-sm font-medium cursor-pointer hover:text-gray-300 whitespace-nowrap"
                    onClick={() => handleSort("name")}
                  >
                    Name{" "}
                    {sortField === "name" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white text-sm font-medium cursor-pointer hover:text-gray-300 whitespace-nowrap"
                    onClick={() => handleSort("email")}
                  >
                    Email{" "}
                    {sortField === "email" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white text-sm font-medium cursor-pointer hover:text-gray-300 whitespace-nowrap"
                    onClick={() => handleSort("role")}
                  >
                    Role{" "}
                    {sortField === "role" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white text-sm font-medium cursor-pointer hover:text-gray-300 whitespace-nowrap"
                    onClick={() => handleSort("signupMethod")}
                  >
                    Signup Method{" "}
                    {sortField === "signupMethod" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white text-sm font-medium cursor-pointer hover:text-gray-300 whitespace-nowrap"
                    onClick={() => handleSort("createdAt")}
                  >
                    Created At{" "}
                    {sortField === "createdAt" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white text-sm font-medium cursor-pointer hover:text-gray-300 whitespace-nowrap"
                    onClick={() => handleSort("status")}
                  >
                    Status{" "}
                    {sortField === "status" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-white text-sm font-medium cursor-pointer hover:text-gray-300 whitespace-nowrap"
                    onClick={() => handleSort("plan")}
                  >
                    Plan{" "}
                    {sortField === "plan" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center">
                      <div className="text-gray-400">Loading users...</div>
                    </td>
                  </tr>
                ) : filteredAndSortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center">
                      <div className="text-gray-400">No users found</div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedUsers.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-[#2A3441]"
                    >
                      <td className="py-3 px-4 text-white text-sm">{user.name}</td>
                      <td className="py-3 px-4 text-gray-300 text-sm">{user.email}</td>
                      <td className="py-3 px-4 text-gray-300 text-sm">{user.role}</td>
                      <td className="py-3 px-4 text-gray-300 text-sm">
                        {user.signupMethod}
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">
                        {user.createdAt}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                            user.status === "Active"
                              ? "bg-emerald-500"
                              : user.status === "Banned"
                              ? "bg-red-500"
                              : "bg-orange-500"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">{user.plan}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
