"use client";

import { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const defaultFormData = {
  title: "",
  description: "",
  url: "",
  practiceType: "Drill",
  level: 1,
  essentialCategory: "",
  essentialSubCategory: "",
  tags: "",
  videoTime: 0,
  xpToBeGained: 0,
  xpToBeGainedOnWatch: 0,
};

export default function AddVideoModal({ open, onClose, onSubmit, video }) {
  const isEditMode = !!video;

  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (video) {
      setFormData({
        id: video.id,
        title: video.Title || "",
        description: video.Description || "",
        url: video.CloudFront_URL || "",
        practiceType: video.PracticeType || "Drill",
        level: video.Level || 1,
        essentialCategory: video.EssentialCategory || "",
        essentialSubCategory: video.EssentialSubcategory || "",
        tags: video.Tags || "",
        videoTime: video.VideoTime || 0,
        xpToBeGained: video.XpToBeGained || 0,
        xpToBeGainedOnWatch: video.XpToBeGainedOnWatch || 0,
      });
    } else {
      setFormData(defaultFormData);
    }
    setError(null);
  }, [video, open]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = { ...formData };
      if (submitData.practiceType !== "Essential") {
        submitData.essentialCategory = null;
        submitData.essentialSubCategory = null;
      }
      await onSubmit(submitData);
      if (!isEditMode) setFormData(defaultFormData);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save video");
    } finally {
      setIsSubmitting(false);
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

  const inputClass =
    "w-full px-3 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const labelClass = "block text-gray-400 text-sm mb-1";

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
          maxWidth: "700px",
          width: "100%",
        },
        closeButton: {
          background: "transparent",
        },
      }}
    >
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">
          {isEditMode ? "Edit Video" : "Add Video"}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter video title"
                required
              />
            </div>
            <div>
              <label className={labelClass}>CloudFront URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://example.cloudfront.net/videos/1.mp4"
                required
              />
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                placeholder="Enter video description"
                rows={2}
              />
            </div>

            <div>
              <label className={labelClass}>Practice Type</label>
              <select
                name="practiceType"
                value={formData.practiceType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Drill">Drill</option>
                <option value="Essential">Essential</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Level</label>
              <input
                type="number"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={inputClass}
                min={1}
                required
              />
            </div>

            {formData.practiceType === "Essential" && (
              <>
                <div>
                  <label className={labelClass}>Essential Category</label>
                  <input
                    type="text"
                    name="essentialCategory"
                    value={formData.essentialCategory}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Flicks"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Essential Subcategory</label>
                  <input
                    type="text"
                    name="essentialSubCategory"
                    value={formData.essentialSubCategory}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Novice"
                    required
                  />
                </div>
              </>
            )}

            <div className="col-span-2">
              <label className={labelClass}>
                Tags{" "}
                <span className="text-gray-500">
                  (for multiple add comma separated)
                </span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Sole, Inside"
                required
              />
            </div>

            <div>
              <label className={labelClass}>Duration (s)</label>
              <input
                type="number"
                name="videoTime"
                value={formData.videoTime}
                onChange={handleChange}
                className={inputClass}
                min={1}
                required
              />
            </div>
            <div>
              <label className={labelClass}>XP (Complete)</label>
              <input
                type="number"
                name="xpToBeGained"
                value={formData.xpToBeGained}
                onChange={handleChange}
                className={inputClass}
                min={0}
                required
              />
            </div>

            <div>
              <label className={labelClass}>XP (Watch)</label>
              <input
                type="number"
                name="xpToBeGainedOnWatch"
                value={formData.xpToBeGainedOnWatch}
                onChange={handleChange}
                className={inputClass}
                min={0}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-gray-500 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                  ? "Update Video"
                  : "Add Video"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
