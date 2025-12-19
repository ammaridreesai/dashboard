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
                <span>{user.country || user.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Accounts */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Social Media Accounts
          </h3>
          <div className="space-y-3">
            {/* Snapchat */}
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.206 2.024c-1.177 0-2.273.22-3.238.653a7.717 7.717 0 0 0-2.471 1.823a8.024 8.024 0 0 0-1.595 2.53c-.376.953-.569 1.937-.569 2.913 0 1.084.199 2.097.592 3.006.394.91.949 1.683 1.648 2.298.132.116.198.231.198.347 0 .099-.033.215-.099.347a21.45 21.45 0 0 1-.692 1.043c-.281.397-.579.777-.892 1.14l-.528.595c-.165.181-.314.363-.446.545a3.104 3.104 0 0 0-.314.595c-.082.198-.124.413-.124.644 0 .314.083.595.248.843.165.248.38.446.644.595.264.149.562.248.892.297.331.05.661.074.992.074h.099c.331 0 .645-.016.942-.05.297-.033.578-.082.843-.149a7.52 7.52 0 0 0 .794-.247c.264-.099.512-.207.744-.322.231-.116.446-.231.644-.347.198-.116.38-.215.545-.297a2.52 2.52 0 0 1 .446-.149.992.992 0 0 1 .347-.05c.132 0 .264.017.396.05.132.033.264.082.396.149.132.066.264.149.396.247.132.099.281.207.446.322.165.116.347.231.545.347s.413.231.644.347c.231.116.479.215.744.297.264.082.529.149.793.198.264.05.529.074.793.074h.099c.331 0 .661-.025.992-.074.331-.05.628-.149.892-.297.264-.149.479-.347.644-.595.165-.248.248-.529.248-.843 0-.231-.042-.446-.124-.644a3.104 3.104 0 0 0-.314-.595c-.132-.182-.281-.364-.446-.545l-.528-.595c-.314-.363-.612-.743-.893-1.14a21.45 21.45 0 0 1-.693-1.043c-.066-.132-.099-.248-.099-.347 0-.116.066-.231.198-.347.7-.615 1.254-1.388 1.648-2.298.394-.91.592-1.922.592-3.006 0-.976-.193-1.96-.569-2.913a8.024 8.024 0 0 0-1.595-2.53 7.717 7.717 0 0 0-2.471-1.823c-.965-.433-2.061-.653-3.238-.653z"/>
              </svg>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Snapchat</p>
                <p className="text-sm text-white">
                  {user.snapchat || 'Not provided'}
                </p>
              </div>
            </div>

            {/* TikTok */}
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-pink-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <div className="flex-1">
                <p className="text-xs text-gray-400">TikTok</p>
                <p className="text-sm text-white">
                  {user.tiktok || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-pink-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Instagram</p>
                <p className="text-sm text-white">
                  {user.instagram || 'Not provided'}
                </p>
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
