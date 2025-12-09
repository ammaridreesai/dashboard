'use client';

import { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

export default function AssignPromoModal({ open, onClose, user, promoCodes }) {
  const [selectedPromoType, setSelectedPromoType] = useState('monthly');
  const [selectedPromoCode, setSelectedPromoCode] = useState('');

  if (!user) return null;

  // Filter promo codes by type
  const filteredPromoCodes = promoCodes.filter(
    (promo) => promo.promoType === selectedPromoType && !promo.isUsed
  );

  const handleAssign = () => {
    if (!selectedPromoCode) {
      alert('Please select a promo code');
      return;
    }

    console.log('Assigning promo:', {
      userId: user.id,
      promoCode: selectedPromoCode,
    });

    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = 'Promo assigned successfully!';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);

    onClose();
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
        <h2 className="text-xl font-semibold text-white mb-6">Assign Promo Code</h2>

        {/* User Info */}
        <div className="mb-6">
          <div className="bg-[#1E2532] rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">User</p>
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Promo Type Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">
            Promo Type
          </label>
          <select
            value={selectedPromoType}
            onChange={(e) => {
              setSelectedPromoType(e.target.value);
              setSelectedPromoCode('');
            }}
            className="w-full px-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Promo Code Dropdown */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-2">
            Promo Code
          </label>
          <select
            value={selectedPromoCode}
            onChange={(e) => setSelectedPromoCode(e.target.value)}
            className="w-full px-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a promo code</option>
            {filteredPromoCodes.map((promo) => (
              <option key={promo.id} value={promo.promoCode}>
                {promo.promoCode}
              </option>
            ))}
          </select>
          {filteredPromoCodes.length === 0 && (
            <p className="text-gray-400 text-sm mt-2">
              No available {selectedPromoType} promo codes
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="bg-white text-gray-800 py-2 px-6 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Assign
          </button>
        </div>
      </div>
    </Modal>
  );
}
