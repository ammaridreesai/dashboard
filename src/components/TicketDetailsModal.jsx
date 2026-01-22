'use client';

import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

export default function TicketDetailsModal({ open, onClose, ticket }) {
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
          maxWidth: '800px',
          width: '90%',
        },
        closeButton: {
          background: 'transparent',
        },
      }}
    >
      <div>
        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-white mb-6">
          {ticket?.title || 'Ticket Details'}
        </h2>

        {/* Description Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-300 mb-3">Description</h3>
          <div className="bg-[#2C3947] rounded-lg p-4 text-white whitespace-pre-wrap break-words min-h-[80px]">
            {ticket?.description ? ticket.description : (
              <span className="text-gray-400">No description available</span>
            )}
          </div>
        </div>

        {/* Screenshot Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-300 mb-3">Screenshot</h3>
          <div className="flex justify-center items-center bg-[#2C3947] rounded-lg p-4">
            {ticket?.screenshotUrl ? (
              <img
                src={`data:image/png;base64,${ticket.screenshotUrl}`}
                alt="Screenshot"
                className="max-w-full max-h-[400px] object-contain rounded"
              />
            ) : (
              <div className="text-gray-400 py-10">No screenshot available</div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
