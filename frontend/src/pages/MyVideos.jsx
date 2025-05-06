// src/pages/MyVideos.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

export default function MyVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/videos")
      .then(res => setVideos(res.data.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const togglePublish = async (vid) => {
    try {
      const res = await api.patch(`/videos/toggle/publish/${vid._id}`);
      setVideos(videos.map(v =>
        v._id === vid._id ? { ...v, isPublished: res.data.data.isPublished } : v
      ));
    } catch (e) {
      console.error("Failed to toggle publish status:", e);
      alert("Could not change publish status.");
    }
  };

  if (loading) return <p className="text-center text-light mt-5">Loading your videos…</p>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!videos.length) return <p className="text-center text-light mt-5">You have no videos yet.</p>;

  return (
    <div className="dashboard-page py-5">
      <div className="container">
        <h1 className="mb-4 text-light">My Videos</h1>
        <div className="row g-4">
          {videos.map((v) => (
            <div key={v._id} className="col-sm-6 col-lg-4">
              <div className="card bg-dash h-100 p-2">
                <Link to={`/videos/${v._id}`} className="text-decoration-none text-light">
                  <img
                    src={v.thumbnail}
                    className="card-img-top rounded"
                    alt={v.title}
                    style={{ objectFit: "cover", height: "180px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{v.title}</h5>
                    <p className="text-muted small">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                <div className="card-footer bg-transparent d-flex justify-content-between align-items-center border-0 pt-0">
                  <button
                    className={`btn btn-sm ${
                      v.isPublished ? "btn-outline-secondary" : "btn-outline-success"
                    }`}
                    onClick={() => togglePublish(v)}
                  >
                    {v.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    to={`/videos/${v._id}/edit`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
