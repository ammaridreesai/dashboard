"use client";

import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

export default function VideoDetailModal({ open, onClose, video }) {
  const [copied, setCopied] = useState(false);

  if (!video) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(video.CloudFront_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatVideoTime = (seconds) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
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
        overlay: "customOverlay",
        modal: "customModal",
      }}
      styles={{
        overlay: {
          background: "rgba(0, 0, 0, 0.4)",
        },
        modal: {
          background: "#364A5E",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "450px",
          width: "100%",
        },
        closeButton: {
          background: "transparent",
        },
      }}
    >
      <div>
        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-white mb-6">Video Details</h2>

        {/* Video Info */}
        <div className="bg-[#1E2532] rounded-lg px-4 py-4 space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Title</span>
            <span className="text-white">{video.Title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Description</span>
            <span className="text-white text-right max-w-[60%]">{video.Description || "N/A"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Practice Type</span>
            <span className="text-white">{video.PracticeType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Level</span>
            <span className="text-white">{video.Level}</span>
          </div>
          {video.PracticeType === "Essential" && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Essential Category</span>
                <span className="text-white">{video.EssentialCategory}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Essential Subcategory</span>
                <span className="text-white">{video.EssentialSubcategory}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tags</span>
            <span className="text-white">{video.Tags}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Duration</span>
            <span className="text-white">{formatVideoTime(video.VideoTime)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">XP (Complete)</span>
            <span className="text-white">{video.XpToBeGained}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">XP (Watch)</span>
            <span className="text-white">{video.XpToBeGainedOnWatch}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Uploaded At</span>
            <span className="text-white">{formatDate(video.UploadedAt)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">CloudFront URL</span>
            <div className="flex items-center gap-2 max-w-[65%]">
              <span
                className="text-blue-400 truncate cursor-default"
                title={video.CloudFront_URL}
              >
                {video.CloudFront_URL}
              </span>
              <button
                onClick={handleCopyUrl}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                title="Copy URL"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
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
