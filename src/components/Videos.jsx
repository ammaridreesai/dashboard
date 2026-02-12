"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import VideoDetailModal from "./VideoDetailModal";
import AddVideoModal from "./AddVideoModal";
import apiClient from "../services/api";

export default function Videos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingVideo, setDeletingVideo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/videos/all");

        if (response.data.isRequestSuccessful) {
          const data = response.data.successResponse?.videos || response.data.successResponse;
          setVideos(Array.isArray(data) ? data : []);
        } else {
          setError("Failed to load videos");
        }
      } catch (err) {
        setError("Error fetching videos: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filter videos based on search term
  const filteredVideos = videos.filter(
    (video) =>
      video.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.PracticeType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.EssentialCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.Tags?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort videos
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle column sorting
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format video time
  const formatVideoTime = (seconds) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const showToastMessage = (message, type = "success") => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle add video
  const handleAddVideo = async (formData) => {
    try {
      const response = await apiClient.post("/videos/upload", formData);
      if (response.data.isRequestSuccessful) {
        const refreshResponse = await apiClient.get("/videos/all");
        if (refreshResponse.data.isRequestSuccessful) {
          const data = refreshResponse.data.successResponse?.videos || refreshResponse.data.successResponse;
          setVideos(Array.isArray(data) ? data : []);
        }
        showToastMessage("Video added successfully");
      } else {
        throw new Error(response.data.errorDetail?.message || response.data.errors?.[0] || "Failed to add video");
      }
    } catch (err) {
      const apiError = err.response?.data;
      const message = apiError?.errorDetail?.message || apiError?.errors?.[0] || err.message || "Failed to add video";
      throw new Error(message);
    }
  };

  // Handle edit video
  const handleEditVideo = async (formData) => {
    try {
      const response = await apiClient.post("/videos/update-video", formData);
      if (response.data.isRequestSuccessful) {
        const refreshResponse = await apiClient.get("/videos/all");
        if (refreshResponse.data.isRequestSuccessful) {
          const data = refreshResponse.data.successResponse?.videos || refreshResponse.data.successResponse;
          setVideos(Array.isArray(data) ? data : []);
        }
        showToastMessage("Video updated successfully");
      } else {
        throw new Error(response.data.errorDetail?.message || response.data.errors?.[0] || "Failed to update video");
      }
    } catch (err) {
      const apiError = err.response?.data;
      const message = apiError?.errorDetail?.message || apiError?.errors?.[0] || err.message || "Failed to update video";
      throw new Error(message);
    }
  };

  // Handle delete video
  const handleDeleteVideo = async () => {
    if (!deletingVideo) return;
    setIsDeleting(true);
    try {
      const response = await apiClient.delete(`/videos/delete/${deletingVideo.id}`);
      if (response.data.isRequestSuccessful) {
        setVideos((prev) => prev.filter((v) => v.id !== deletingVideo.id));
        showToastMessage(response.data.successResponse?.message || "Video deleted successfully");
      } else {
        const message = response.data.errorDetail?.message || response.data.errors?.[0] || "Failed to delete video";
        showToastMessage(message, "error");
      }
    } catch (err) {
      const apiError = err.response?.data;
      const message = apiError?.errorDetail?.message || apiError?.errors?.[0] || err.message || "Failed to delete video";
      showToastMessage(message, "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletingVideo(null);
    }
  };

  // Sort icon component
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortConfig.direction === "asc" ? (
      <svg
        className="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-white"
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
    );
  };

  return (
    <div className="flex-1 ml-48 bg-[#2C3947] min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-400 mb-6">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>&gt;</span>
          <span>Videos</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-semibold text-white mb-8">Videos</h1>

        {/* Videos Table Container */}
        <div className="bg-[#1E2532] rounded-lg p-6">
          {/* Search Bar & Add Button */}
          <div className="mb-6 flex items-center justify-between">
            <div className="relative w-64">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#2C3947] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <button
              onClick={() => {
                setEditingVideo(null);
                setShowAddModal(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Video
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
              {error}
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="h-96 overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#1E2532] z-10">
                  <tr className="border-b border-gray-700">
                    <th
                      className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                      onClick={() => handleSort("Title")}
                    >
                      <div className="flex items-center gap-2">
                        Title
                        <SortIcon columnKey="Title" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                      onClick={() => handleSort("Description")}
                    >
                      <div className="flex items-center gap-2">
                        Description
                        <SortIcon columnKey="Description" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                      onClick={() => handleSort("PracticeType")}
                    >
                      <div className="flex items-center gap-2">
                        Practice Type
                        <SortIcon columnKey="PracticeType" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                      onClick={() => handleSort("Level")}
                    >
                      <div className="flex items-center gap-2">
                        Level
                        <SortIcon columnKey="Level" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                      onClick={() => handleSort("EssentialCategory")}
                    >
                      <div className="flex items-center gap-2">
                        Category
                        <SortIcon columnKey="EssentialCategory" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                      onClick={() => handleSort("EssentialSubcategory")}
                    >
                      <div className="flex items-center gap-2">
                        Subcategory
                        <SortIcon columnKey="EssentialSubcategory" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                      onClick={() => handleSort("Tags")}
                    >
                      <div className="flex items-center gap-2">
                        Tags
                        <SortIcon columnKey="Tags" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                      onClick={() => handleSort("VideoTime")}
                    >
                      <div className="flex items-center gap-2">
                        Duration
                        <SortIcon columnKey="VideoTime" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                      onClick={() => handleSort("XpToBeGained")}
                    >
                      <div className="flex items-center gap-2">
                        XP
                        <SortIcon columnKey="XpToBeGained" />
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 text-sm font-medium cursor-pointer hover:text-white whitespace-nowrap"
                      onClick={() => handleSort("UploadedAt")}
                    >
                      <div className="flex items-center gap-2">
                        Uploaded At
                        <SortIcon columnKey="UploadedAt" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 text-sm font-medium whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVideos.length > 0 ? (
                    sortedVideos.map((video) => (
                      <tr
                        key={video.id}
                        className="border-b border-gray-700 hover:bg-[#2A3441] transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-200 text-sm">{video.Title}</td>
                        <td className="py-4 px-4 text-gray-200 text-sm max-w-xs truncate">{video.Description}</td>
                        <td className="py-4 px-4">
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {video.PracticeType}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-200 text-sm">{video.Level}</td>
                        <td className="py-4 px-4 text-gray-200 text-sm">{video.EssentialCategory}</td>
                        <td className="py-4 px-4 text-gray-200 text-sm">{video.EssentialSubcategory}</td>
                        <td className="py-4 px-4 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {video.Tags?.split(",").map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-600 text-gray-200 px-2 py-0.5 rounded text-xs"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-200 text-sm">{formatVideoTime(video.VideoTime)}</td>
                        <td className="py-4 px-4 text-gray-200 text-sm">{video.XpToBeGained}</td>
                        <td className="py-4 px-4 text-gray-200 text-sm">{formatDate(video.UploadedAt)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setEditingVideo(video);
                                setShowAddModal(true);
                              }}
                              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVideo(video);
                                setShowModal(true);
                              }}
                              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setDeletingVideo(video);
                                setShowDeleteModal(true);
                              }}
                              className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="py-8 text-center text-gray-400">
                        No videos found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Video Modal */}
      <AddVideoModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingVideo(null);
        }}
        onSubmit={editingVideo ? handleEditVideo : handleAddVideo}
        video={editingVideo}
      />

      {/* Video Detail Modal */}
      <VideoDetailModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedVideo(null);
        }}
        video={selectedVideo}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#364A5E] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Video</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">"{deletingVideo?.Title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingVideo(null);
                }}
                disabled={isDeleting}
                className="bg-gray-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-gray-500 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVideo}
                disabled={isDeleting}
                className="bg-red-500 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed bottom-8 right-8 ${
            toastType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50`}
        >
          {toastType === "success" ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium">{toastMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            className="ml-4 text-white hover:text-gray-200 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
