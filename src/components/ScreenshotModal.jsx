'use client';

import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

export default function ScreenshotModal({ open, onClose, screenshot, title }) {
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
          {title || 'Screenshot'}
        </h2>

        {/* Screenshot Image */}
        <div className="flex justify-center items-center bg-gray-800 rounded-lg p-4">
          {screenshot ? (
            <img
              src={`data:image/png;base64,${screenshot}`}
              alt="Screenshot"
              className="max-w-full max-h-[600px] object-contain rounded"
            />
          ) : (
            <div className="text-gray-400 py-20">No screenshot available</div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-white text-gray-800 py-2 px-6 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
