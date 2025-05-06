// src/pages/EditVideo.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function EditVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "" });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/videos/${videoId}`)
      .then((res) => {
        setForm({
          title: res.data.data.title,
          description: res.data.data.description,
        });
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (thumbnailFile) fd.append("thumbnail", thumbnailFile);

    try {
      await api.patch(`/videos/${videoId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/videos/${videoId}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading)
    return <p className="text-center mt-5 text-light">Loading…</p>;

  return (
    <div className="dashboard-page py-5">
      <div className="container">
        <h1 className="mb-4">Edit Video</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="p-4 rounded shadow"
          style={{ backgroundColor: "#2a2a2a", border: "1px solid #444" }}
        >
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control bg-dark text-light border-0"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control bg-dark text-light border-0"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Thumbnail (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control bg-dark text-light border-0"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
            />
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
