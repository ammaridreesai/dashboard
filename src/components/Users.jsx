"use client";

import { useState, useEffect } from "react";
import UserDetailModal from "./UserDetailModal";
import Header from "./Header";
import apiClient from "../services/api";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/users/dashboard/all-users");
        if (response.data.isRequestSuccessful) {
          setUsers(response.data.successResponse);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

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
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle column sorting
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "banned":
        return "bg-red-500";
      case "pending":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
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
    return sortConfig.direction === "asc" ? (
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
    <div className="flex-1 ml-48 bg-[#2C3947] min-h-screen">
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
          <span>Users</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-semibold text-white mb-8">Users</h1>

        {/* Users Table Container */}
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
          <div className="h-96 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#1E2532] z-10">
                <tr className="border-b border-gray-700">
                  <th
                    className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <SortIcon columnKey="name" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      <SortIcon columnKey="email" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center gap-2">
                      Role
                      <SortIcon columnKey="role" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort("signupMethod")}
                  >
                    <div className="flex items-center gap-2">
                      Signup Method
                      <SortIcon columnKey="signupMethod" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Created At
                      <SortIcon columnKey="createdAt" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon columnKey="status" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer hover:text-white"
                    onClick={() => handleSort("plan")}
                  >
                    <div className="flex items-center gap-2">
                      Plan
                      <SortIcon columnKey="plan" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center">
                      <div className="text-gray-400">Loading users...</div>
                    </td>
                  </tr>
                ) : sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center">
                      <div className="text-gray-400">No users found</div>
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user) => (
                    <tr
                      key={user.userId || user.id}
                      className="border-b border-gray-700 hover:bg-[#2A3441] transition-colors"
                    >
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
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        open={showModal}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
}
