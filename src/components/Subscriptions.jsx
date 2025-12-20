"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import SubscriptionDetailModal from "./SubscriptionDetailModal";
import apiClient from "../services/api";

export default function Subscriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/users/dashboard/subscription-status");

        if (response.data.isRequestSuccessful && response.data.successResponse) {
          const formattedData = response.data.successResponse.map((sub, index) => ({
            id: index + 1,
            name: sub.name,
            email: sub.email,
            subscriptionType: sub.subscriptionType,
            status: sub.status,
            paymentMethod: sub.paymentMethod,
            amount: sub.amount,
            currency: sub.currency,
            cardLast4Digits: sub.cardLast4Digits,
            isActive: sub.isActive,
            subscriptionStartDate: sub.subscriptionStartDate,
            subscriptionEndDate: sub.subscriptionEndDate,
          }));
          setSubscriptions(formattedData);
        } else {
          setError("Failed to load subscriptions");
        }
      } catch (err) {
        setError("Error fetching subscriptions: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Filter subscriptions based on search term
  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.subscriptionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort subscriptions
  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
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

  const handleViewSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubscription(null);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
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
          <span>Subscriptions</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-semibold text-white mb-8">Subscriptions</h1>

        {/* Subscriptions Table Container */}
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

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
              {error}
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="h-96 overflow-auto">
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
                      onClick={() => handleSort("subscriptionType")}
                    >
                      <div className="flex items-center gap-2">
                        Subscription Type
                        <SortIcon columnKey="subscriptionType" />
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
                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-medium whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSubscriptions.length > 0 ? (
                    sortedSubscriptions.map((subscription) => (
                      <tr
                        key={subscription.id}
                        className="border-b border-gray-700 hover:bg-[#2A3441] transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-200 text-sm">{subscription.name}</td>
                        <td className="py-4 px-4 text-gray-200 text-sm">{subscription.email}</td>
                        <td className="py-4 px-4 text-gray-200 text-sm">
                          {subscription.subscriptionType}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`${getStatusColor(
                              subscription.status
                            )} text-white px-3 py-1 rounded-full text-sm font-medium`}
                          >
                            {subscription.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleViewSubscription(subscription)}
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
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-400">
                        No subscriptions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Detail Modal */}
      <SubscriptionDetailModal
        open={showModal}
        onClose={handleCloseModal}
        subscription={selectedSubscription}
      />
    </div>
  );
}
