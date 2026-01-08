'use client';

import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

export default function AssignedPromoDetailModal({ open, onClose, assignedPromo }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          maxWidth: '800px',
          width: '90%',
        },
        closeButton: {
          background: 'transparent',
        },
      }}
    >
      <div>
        {/* Header */}
        <h2 className="text-2xl font-semibold text-white mb-6">
          Assigned Promo Details
        </h2>

        {/* Content */}
        {assignedPromo && (
          <div className="space-y-4">
            {/* User Information */}
            <div className="bg-[#2C3947] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                User Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Name</label>
                  <p className="text-white mt-1">
                    {assignedPromo.user?.userDetails?.userName || assignedPromo.user?.FullName || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <p className="text-white mt-1">{assignedPromo.user?.Email}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Signup Provider</label>
                  <p className="text-white mt-1 capitalize">
                    {assignedPromo.user?.signupProvider || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Email Verified</label>
                  <p className="text-white mt-1">
                    {assignedPromo.user?.isEmailVerified ? (
                      <span className="text-green-500">✓ Verified</span>
                    ) : (
                      <span className="text-red-500">✗ Not Verified</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Referral Code</label>
                  <p className="text-white mt-1">
                    {assignedPromo.user?.referralCode || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">User Created At</label>
                  <p className="text-white mt-1">
                    {formatDate(assignedPromo.user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Promo Code Information */}
            <div className="bg-[#2C3947] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Promo Code Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Promo Code</label>
                  <p className="text-white mt-1 font-mono">
                    {assignedPromo.promoCode?.promoCode}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Promo Type</label>
                  <p className="text-white mt-1 capitalize">
                    {assignedPromo.promoCode?.promoType}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Promo Created</label>
                  <p className="text-white mt-1">
                    {formatDate(assignedPromo.promoCode?.creationDate)}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Promo Status</label>
                  <p className="text-white mt-1">
                    {assignedPromo.promoCode?.isUsed ? (
                      <span className="text-red-500">Used</span>
                    ) : (
                      <span className="text-green-500">Available</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div className="bg-[#2C3947] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                Subscription Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Start Date</label>
                  <p className="text-white mt-1">
                    {formatDate(assignedPromo.subscriptionStartDate)}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">End Date</label>
                  <p className="text-white mt-1">
                    {formatDate(assignedPromo.subscriptionEndDate)}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Active Status</label>
                  <p className="text-white mt-1">
                    {assignedPromo.isActive ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Inactive
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Cancelled</label>
                  <p className="text-white mt-1">
                    {assignedPromo.isCancelled ? (
                      <>
                        <span className="text-red-500">Yes</span>
                        {assignedPromo.cancelledDate && (
                          <span className="text-gray-400 text-xs block mt-1">
                            {formatDate(assignedPromo.cancelledDate)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-green-500">No</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Deleted</label>
                  <p className="text-white mt-1">
                    {assignedPromo.isDeleted ? (
                      <>
                        <span className="text-red-500">Yes</span>
                        {assignedPromo.deletedDate && (
                          <span className="text-gray-400 text-xs block mt-1">
                            {formatDate(assignedPromo.deletedDate)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-green-500">No</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
