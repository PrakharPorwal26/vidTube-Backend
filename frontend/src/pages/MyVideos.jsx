import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { Link } from "react-router-dom";

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

  if (loading) return <p className="text-center mt-5">Loading your videos…</p>;
  if (error)
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div className="container py-5">
      <h1 className="mb-4">My Videos</h1>
      <div className="row g-4">
        {videos.map(v => (
          <div key={v._id} className="col-sm-6 col-lg-4">
            <Link to={`/videos/${v._id}`} className="text-decoration-none">
              <div className="card h-100">
                <img
                  src={v.thumbnail}
                  className="card-img-top"
                  alt={v.title}
                  style={{ objectFit: "cover", height: "180px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{v.title}</h5>
                  <p className="card-text text-muted">
                    {v.views} views •{" "}
                    {new Date(v.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
