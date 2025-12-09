'use client';

import { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

export default function SubscriptionDetailModal({ open, onClose, subscription }) {
  if (!subscription) return null;

  const [expandedSections, setExpandedSections] = useState([0]); // First section expanded by default

  const toggleSection = (index) => {
    setExpandedSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Mock subscription details - you can replace with real data
  const subscriptionDetails = [
    {
      type: 'Monthly Subscription',
      amount: '£4.99',
      startDate: '30 July 2025',
      endDate: '30 Aug 2025',
      cardEnding: '1349'
    },
    {
      type: 'Monthly Subscription',
      amount: '£4.99',
      startDate: '30 July 2025',
      endDate: '30 Aug 2025',
      cardEnding: '1349'
    },
    {
      type: 'Monthly Subscription',
      amount: '£4.99',
      startDate: '30 July 2025',
      endDate: '30 Aug 2025',
      cardEnding: '1349'
    }
  ];

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
          background: '#364A5E',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '450px',
          width: '100%',
        },
        closeButton: {
          background: 'transparent',
        },
      }}
    >
      <div>
        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-white mb-6">Billing Details</h2>

        {/* User Info */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
            <img
              src="/assets/avatar.svg"
              alt={subscription.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-1">
              {subscription.name}
            </h3>
            <p className="text-sm text-gray-400">{subscription.email}</p>
          </div>
        </div>

        {/* Subscription Sections */}
        <div className="space-y-3 mb-6">
          {subscriptionDetails.map((detail, index) => (
            <div key={index} className="bg-[#1E2532] rounded-lg overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-[#2A3441] transition-colors cursor-pointer"
              >
                <span className="font-medium">{detail.type}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    expandedSections.includes(index) ? 'rotate-180' : ''
                  }`}
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
              </button>

              {/* Section Content */}
              {expandedSections.includes(index) && (
                <div className="px-4 pb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-white">{detail.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Start Date</span>
                    <span className="text-white">{detail.startDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">End Date</span>
                    <span className="text-white">{detail.endDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Card Ending</span>
                    <span className="text-white">{detail.cardEnding}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
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
