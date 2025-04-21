// src/pages/VideoDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";

export default function VideoDetail() {
  const { videoId } = useParams();
  const navigate    = useNavigate();

  const [video, setVideo]       = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // comment state
  const [newComment, setNewComment]         = useState("");
  const [editingId, setEditingId]           = useState(null);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, cRes, uRes] = await Promise.all([
          api.get(`/videos/${videoId}`),
          api.get(`/comments/${videoId}`),
          api.get("/users/current-user"),
        ]);
        setVideo(vRes.data.data);
        setComments(cRes.data.data.docs || []);
        setUser(uRes.data.data);
      } catch {
        setError("Failed to load video or comments.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [videoId]);

  const isVideoOwner = user?._id === video?.owner._id.toString();

  // Post new comment
  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/comments/${videoId}`, { content: newComment.trim() });
      setComments([{ ...res.data.data, owner: user }, ...comments]);
      setNewComment("");
    } catch {
      setError("Failed to add comment.");
    }
  };

  // Save edited comment
  const saveEdit = async () => {
    if (!editingContent.trim()) return;
    try {
      const res = await api.patch(`/comments/c/${editingId}`, { content: editingContent.trim() });
      setComments(comments.map(c => c._id === editingId ? res.data.data : c));
      setEditingId(null);
      setEditingContent("");
    } catch {
      setError("Failed to update comment.");
    }
  };

  // Delete comment (only by comment owner)
  const onDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/c/${id}`);
      setComments(comments.filter(c => c._id !== id));
    } catch {
      setError("Failed to delete comment.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading…</p>;
  if (error)   return <div className="alert alert-danger">{error}</div>;
  if (!video)  return <p className="text-center mt-5">Video not found.</p>;

  return (
    <div className="container py-5">
      {/* Video Player */}
      <h1 className="mb-4">{video.title}</h1>
      <video
        src={video.videoFile}
        controls
        className="w-100 mb-4"
        style={{ maxHeight: "480px" }}
      />

      {/* Metadata & Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          {video.owner.avatar && (
            <img
              src={video.owner.avatar}
              alt={video.owner.username}
              className="rounded-circle me-2"
              width={40}
              height={40}
              style={{ objectFit: "cover" }}
            />
          )}
          <Link to={`/channel/${video.owner.username}`} className="fw-bold">
            {video.owner.username}
          </Link>
        </div>
        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => api.post(`/likes/toggle/v/${videoId}`)}
          >
            Like
          </button>
          {isVideoOwner && (
            <>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => navigate(`/videos/${videoId}/edit`)}
              >
                Edit Video
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={async () => {
                  if (!window.confirm("Delete this video?")) return;
                  await api.delete(`/videos/${videoId}`);
                  navigate("/my-videos");
                }}
              >
                Delete Video
              </button>
            </>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mb-5">
        <h4>Comments</h4>

        {/* New comment */}
        <div className="mb-3">
          <textarea
            className="form-control"
            rows={2}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button className="btn btn-primary mt-2" onClick={postComment}>
            Post Comment
          </button>
        </div>

        {/* List of comments */}
        {comments.map(c => {
          const isOwner = user._id === c.owner._id.toString();

          return (
            <div key={c._id} className="mb-3 p-3 border rounded">
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  {c.owner.avatar && (
                    <img
                      src={c.owner.avatar}
                      alt={c.owner.username}
                      className="rounded-circle me-2"
                      width={30}
                      height={30}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <strong>{c.owner.username}</strong>
                </div>
                <div>
                  {/* Edit only for comment owner */}
                  {isOwner && editingId !== c._id && (
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => {
                        setEditingId(c._id);
                        setEditingContent(c.content);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {/* Delete only for comment owner */}
                  {isOwner && (
                    <button
                      className="btn btn-sm btn-link text-danger"
                      onClick={() => onDelete(c._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {editingId === c._id ? (
                <>
                  <textarea
                    className="form-control mb-2"
                    rows={2}
                    value={editingContent}
                    onChange={e => setEditingContent(e.target.value)}
                  />
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={saveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <p className="mb-0 mt-2">{c.content}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
