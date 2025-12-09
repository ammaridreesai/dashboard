'use client';

import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

export default function UserDetailModal({ open, onClose, user }) {
  if (!user) return null;

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
          background: 'rgba(0, 0, 0, 0.4)',
        },
        modal: {
          background: '#1E2A3A',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
        },
        closeButton: {
          background: 'transparent',
        },
      }}
    >
      <div>
        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-white mb-6">User Detail</h2>

        {/* User Info */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
            <img
              src="/assets/avatar.svg"
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-1">
              {user.name}
            </h3>
            <p className="text-sm text-gray-400 mb-3">{user.email}</p>

            {/* Gender and Location */}
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{user.gender}</span>
              </div>
              <div className="flex items-center gap-1">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{user.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-white text-gray-800 py-2 px-6 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>
    </Modal>
  );
}
