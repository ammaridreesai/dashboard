'use client';

import { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import apiClient from '../services/api';

export default function UpdateStatusModal({ open, onClose, ticket, onStatusUpdated }) {
  const [selectedStatus, setSelectedStatus] = useState(ticket?.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const handleUpdateStatus = async () => {
    if (!ticket) return;

    setIsUpdating(true);
    try {
      const response = await apiClient.patch('/report-tickets/status', {
        ticketId: ticket.id,
        userId: ticket.userId.toString(),
        status: selectedStatus,
      });

      if (response.data.isRequestSuccessful) {
        onStatusUpdated(ticket.id, selectedStatus);
        onClose();
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      alert('Failed to update ticket status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const closeIcon = (
    <svg
      className="w-6 h-6 text-white"
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
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      closeIcon={closeIcon}
      classNames={{
        overlay: 'customOverlay',
        modal: 'customModal',
      }}
      styles={{
        overlay: {
          background: 'rgba(0, 0, 0, 0.7)',
        },
        modal: {
          background: '#1E2A3A',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
        },
        closeButton: {
          background: 'transparent',
        },
      }}
    >
      <div>
        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-white mb-6">Update Ticket Status</h2>

        {/* Ticket Info */}
        {ticket && (
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Ticket ID: {ticket.id}</div>
            <div className="text-sm text-white mb-4">{ticket.title}</div>
          </div>
        )}

        {/* Status Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateStatus}
            disabled={isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
