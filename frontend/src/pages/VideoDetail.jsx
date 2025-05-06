import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function VideoDetail() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentLiked, setCommentLiked] = useState({});
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, cRes, uRes, likedRes] = await Promise.all([
          api.get(`/videos/${videoId}`),
          api.get(`/comments/${videoId}`),
          api.get("/users/current-user"),
          api.get("/likes/videos"),
        ]);

        const videoData = vRes.data.data;
        const userData = uRes.data.data;
        const likedList = likedRes.data.data || [];

        setVideo(videoData);
        setUser(userData);
        setComments(cRes.data.data.docs || []);
        setIsLiked(
          videoData && userData ? likedList.some(v => v && v._id === videoData._id) : false
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load video or comments.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [videoId]);

  if (loading) return <p className="text-center text-white mt-5">Loading…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!video) return <p className="text-center mt-5">Video not found.</p>;

  const isVideoOwner = user?._id === video.owner._id.toString();

  const toggleVideoLike = async () => {
    try {
      await api.post(`/likes/toggle/v/${videoId}`);
      setIsLiked(prev => !prev);
    } catch (e) {
      console.error("Failed to toggle video like:", e);
    }
  };

  const toggleCommentLike = async (commentId) => {
    try {
      await api.post(`/likes/toggle/c/${commentId}`);
      setCommentLiked(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    } catch (e) {
      console.error("Failed to toggle comment like:", e);
    }
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/comments/${videoId}`, {
        content: newComment.trim(),
      });
      setComments([{ ...res.data.data, owner: user }, ...comments]);
      setNewComment("");
    } catch {
      setError("Failed to add comment.");
    }
  };

  const saveEdit = async () => {
    if (!editingContent.trim()) return;
    try {
      const res = await api.patch(`/comments/c/${editingId}`, {
        content: editingContent.trim(),
      });
      const updated = res.data.data;
      setComments(comments.map(c =>
        c._id === editingId ? { ...updated, owner: c.owner } : c
      ));
      setEditingId(null);
      setEditingContent("");
    } catch {
      setError("Failed to update comment.");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/c/${id}`);
      setComments(comments.filter(c => c._id !== id));
    } catch {
      setError("Failed to delete comment.");
    }
  };

  return (
    <div className="dashboard-page py-5">
      <div className="container text-white">
        <h1 className="mb-4">{video.title}</h1>
        <video
          src={video.videoFile}
          controls
          autoPlay
          className="w-100 mb-4 rounded"
          style={{ maxHeight: "480px", backgroundColor: "#000" }}
        />

        {/* Metadata */}
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
            <Link to={`/channel/${video.owner.username}`} className="fw-bold text-danger">
              {video.owner.username}
            </Link>
          </div>

          <div>
            <button
              className="btn btn-outline-danger me-2"
              onClick={toggleVideoLike}
              title={isLiked ? "Unlike" : "Like"}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
            </button>

            {isVideoOwner && (
              <>
                <button
                  className="btn btn-outline-light me-2"
                  onClick={() => navigate(`/videos/${videoId}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={async () => {
                    if (!window.confirm("Delete this video?")) return;
                    await api.delete(`/videos/${videoId}`);
                    navigate("/my-videos");
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-5">
          <h4 className="mb-3">Comments</h4>

          {/* New comment */}
          <div className="mb-3">
          <textarea
  className="form-control bg-dash text-white border border-secondary rounded"
  style={{ resize: "none" }}

              rows={2}
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button className="btn btn-danger mt-2" onClick={postComment}>
              Post Comment
            </button>
          </div>

          {/* Comments List */}
          {comments.map(c => {
            const isOwner = user._id === c.owner._id.toString();
            const liked = !!commentLiked[c._id];

            return (
              <div key={c._id} className="mb-3 p-3 rounded bg-dash">
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
                    <strong className="text-white">{c.owner.username}</strong>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => toggleCommentLike(c._id)}
                      title={liked ? "Unlike" : "Like"}
                    >
                      {liked ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    {isOwner && editingId !== c._id && (
                      <button
                        className="btn btn-sm btn-outline-light me-2"
                        onClick={() => {
                          setEditingId(c._id);
                          setEditingContent(c.content);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {isOwner && (
                      <button
                        className="btn btn-sm btn-outline-danger"
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
                      className="form-control mt-2"
                      rows={2}
                      value={editingContent}
                      onChange={e => setEditingContent(e.target.value)}
                    />
                    <button className="btn btn-sm btn-success mt-2 me-2" onClick={saveEdit}>
                      Save
                    </button>
                    <button
                      className="btn btn-sm btn-secondary mt-2"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <p className="mb-0 mt-2 text-light">{c.content}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
