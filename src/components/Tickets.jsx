"use client";

import { useState, useEffect } from "react";
import TicketDetailsModal from "./TicketDetailsModal";
import UpdateStatusModal from "./UpdateStatusModal";
import Header from "./Header";
import apiClient from "../services/api";
import * as XLSX from "xlsx";

export default function Tickets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTicketForDetails, setSelectedTicketForDetails] =
    useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await apiClient.get("/report-tickets");
        if (response.data.isRequestSuccessful) {
          setTickets(response.data.successResponse);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleViewDetails = (ticket) => {
    setSelectedTicketForDetails(ticket);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTicketForDetails(null);
  };

  const handleUpdateStatus = (ticket) => {
    setSelectedTicket(ticket);
    setShowStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setSelectedTicket(null);
  };

  const handleStatusUpdated = (ticketId, newStatus) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket,
      ),
    );
  };

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.user?.userDetails?.userName &&
        ticket.user.userDetails.userName.toLowerCase().includes(
          searchTerm.toLowerCase(),
        )) ||
      (ticket.user?.Email &&
        ticket.user.Email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue, bValue;

    // Handle nested user object for name and email
    if (sortConfig.key === "userName") {
      aValue = a.user?.userDetails?.userName || "";
      bValue = b.user?.userDetails?.userName || "";
    } else if (sortConfig.key === "userEmail") {
      aValue = a.user?.Email || "";
      bValue = b.user?.Email || "";
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Export to Excel function
  const handleExportToExcel = () => {
    setIsExporting(true);

    try {
      const dataToExport = sortedTickets.map((ticket) => ({
        "User Name": ticket.user?.userDetails?.userName || "N/A",
        "User Email": ticket.user?.Email || "N/A",
        Type: ticket.type,
        Status: ticket.status,
        Title: ticket.title,
        Description: ticket.description,
        "Created At": formatDate(ticket.createdAt),
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

      const fileName = `tickets_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } finally {
      setIsExporting(false);
    }
  };

  // Get type badge color
  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "bug report":
      case "bug":
        return "bg-red-500";
      case "feature request":
        return "bg-blue-500";
      case "feedback":
        return "bg-green-500";
      case "issue":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "resolved":
      case "completed":
        return "bg-green-500";
      case "in progress":
        return "bg-blue-500";
      case "rejected":
        return "bg-red-500";
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
          <span>Tickets</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-semibold text-white mb-8">Tickets</h1>

        {/* Tickets Table Container */}
        <div className="bg-[#1E2532] rounded-lg p-6">
          {/* Search Bar and Export Button */}
          <div className="mb-6 flex items-center justify-between">
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

            <button
              onClick={handleExportToExcel}
              disabled={sortedTickets.length === 0 || isExporting}
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
          <div className="h-96 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#1E2532] z-10">
                <tr className="border-b border-gray-700">
                  <th
                    className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                    onClick={() => handleSort("userName")}
                  >
                    <div className="flex items-center gap-2">
                      User Name
                      <SortIcon columnKey="userName" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                    onClick={() => handleSort("userEmail")}
                  >
                    <div className="flex items-center gap-2">
                      User Email
                      <SortIcon columnKey="userEmail" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      <SortIcon columnKey="type" />
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
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-2">
                      Title
                      <SortIcon columnKey="title" />
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
                  <th className="text-left py-3 px-4 text-gray-300 text-sm font-medium whitespace-nowrap">
                    Details
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 text-sm font-medium whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center">
                      <div className="text-gray-400">Loading tickets...</div>
                    </td>
                  </tr>
                ) : sortedTickets.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center">
                      <div className="text-gray-400">No tickets found</div>
                    </td>
                  </tr>
                ) : (
                  sortedTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-gray-700 hover:bg-[#2A3441] transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-200 text-sm">
                        {ticket.user?.userDetails?.userName || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-gray-200 text-sm">
                        {ticket.user?.Email || "N/A"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`${getTypeColor(
                            ticket.type,
                          )} text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap`}
                        >
                          {ticket.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`${getStatusColor(
                            ticket.status,
                          )} text-white px-3 py-1 rounded-full text-sm font-medium`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-200 text-sm">
                        {ticket.title}
                      </td>
                      <td className="py-4 px-4 text-gray-200 text-sm">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewDetails(ticket)}
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
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleUpdateStatus(ticket)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors cursor-pointer"
                        >
                          Update Status
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

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        open={showDetailsModal}
        onClose={handleCloseDetailsModal}
        ticket={selectedTicketForDetails}
      />

      {/* Update Status Modal */}
      <UpdateStatusModal
        open={showStatusModal}
        onClose={handleCloseStatusModal}
        ticket={selectedTicket}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
}
