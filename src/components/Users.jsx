"use client";

import { useState, useEffect } from "react";
import UserDetailModal from "./UserDetailModal";
import Header from "./Header";
import apiClient from "../services/api";
import * as XLSX from "xlsx";

const LIMIT = 50;

export default function Users({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ page: currentPage, limit: LIMIT });
        if (appliedSearch.trim()) params.append("search", appliedSearch.trim());
        const response = await apiClient.get(
          `/users/dashboard/all-users?${params.toString()}`
        );
        if (response.data.isRequestSuccessful) {
          const res = response.data.successResponse;
          // Handle paginated response shape: { users, totalUsers, totalPages }
          if (res && typeof res === "object" && !Array.isArray(res)) {
            const total = res.total ?? res.totalUsers ?? 0;
            setUsers(res.data ?? res.users ?? []);
            setTotalUsers(total);
            setTotalPages(Math.ceil(total / LIMIT) || 1);
          } else {
            // Fallback if server returns plain array
            setUsers(Array.isArray(res) ? res : []);
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, appliedSearch]);

  // Reset to page 1 when applied search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedSearch]);

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Sort users (filtering is server-side)
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Sort date columns chronologically
    if (sortConfig.key === "createdAt") {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    }

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

  // Export to Excel function
  const handleExportToExcel = () => {
    setIsExporting(true);

    try {
      const dataToExport = sortedUsers.map((user) => ({
        Name: user.name,
        Email: user.email,
        Role: user.role,
        Gender: user.gender || "Not provided",
        Location: user.country || user.location || "Not provided",
        "Signup Method": user.signupMethod,
        "Created At": user.createdAt,
        Status: user.status,
        Plan: user.plan,
        "Profile Completed": user.isProfileCompleted ? "Yes" : "No",
        Snapchat: user.snapchat || "Not provided",
        TikTok: user.tiktok || "Not provided",
        Instagram: user.instagram || "Not provided",
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      const fileName = `users_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } finally {
      setIsExporting(false);
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
          <button onClick={() => onNavigate('dashboard')} className="hover:text-white cursor-pointer">
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
          </button>
          <span>&gt;</span>
          <span>Users</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-semibold text-white mb-8">Users</h1>

        {/* Users Table Container */}
        <div className="bg-[#1E2532] rounded-lg p-6">
          {/* Search Bar and Export Button */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
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
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 pr-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>

            <button
              onClick={handleExportToExcel}
              disabled={sortedUsers.length === 0 || isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium cursor-pointer"
            >
              {isExporting ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export to Excel
                </>
              )}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#1E2532] z-10">
                <tr className="border-b border-gray-700">
                  <th
                    className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <SortIcon columnKey="name" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      <SortIcon columnKey="email" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center gap-2">
                      Role
                      <SortIcon columnKey="role" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                    onClick={() => handleSort("signupMethod")}
                  >
                    <div className="flex items-center gap-2">
                      Signup Method
                      <SortIcon columnKey="signupMethod" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Created At
                      <SortIcon columnKey="createdAt" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon columnKey="status" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                    onClick={() => handleSort("plan")}
                  >
                    <div className="flex items-center gap-2">
                      Plan
                      <SortIcon columnKey="plan" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                    onClick={() => handleSort("isProfileCompleted")}
                  >
                    <div className="flex items-center gap-2">
                      Profile Completed
                      <SortIcon columnKey="isProfileCompleted" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 text-sm font-medium whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center">
                      <div className="text-gray-400">Loading users...</div>
                    </td>
                  </tr>
                ) : sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center">
                      <div className="text-gray-400">No users found</div>
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((user) => (
                    <tr
                      key={user.userId || user.id}
                      className="border-b border-gray-700 hover:bg-[#2A3441] transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-200 text-sm">{user.name}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{user.email}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">{user.role}</td>
                      <td className="py-4 px-4 text-gray-200 text-sm">
                        {user.signupMethod}
                      </td>
                      <td className="py-4 px-4 text-gray-200 text-sm">
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
                      <td className="py-4 px-4 text-gray-200 text-sm">{user.plan}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`${user.isProfileCompleted ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded-full text-sm font-medium`}
                        >
                          {user.isProfileCompleted ? 'Yes' : 'No'}
                        </span>
                      </td>
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

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Showing{" "}
                <span className="text-white font-medium">
                  {(currentPage - 1) * LIMIT + 1}–
                  {Math.min(currentPage * LIMIT, totalUsers)}
                </span>{" "}
                of <span className="text-white font-medium">{totalUsers}</span> users
              </p>

              <div className="flex items-center gap-1">
                {/* Previous */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded text-sm text-gray-300 hover:bg-[#2C3947] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ‹ Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      (p >= currentPage - 2 && p <= currentPage + 2)
                  )
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) {
                      acc.push("...");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${
                          currentPage === item
                            ? "bg-blue-600 text-white font-medium"
                            : "text-gray-300 hover:bg-[#2C3947]"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                {/* Next */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded text-sm text-gray-300 hover:bg-[#2C3947] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
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
