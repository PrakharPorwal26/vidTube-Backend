// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

export default function Dashboard() {
  const [user, setUser]       = useState(null);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = await api.get("/users/current-user");
        setUser(u.data.data);
        const s = await api.get("/dashboard/stats");
        setStats(s.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const AVATAR = 120, BANNER = 200;

  if (loading)
    return <div className="d-flex vh-100 justify-content-center align-items-center"><div className="spinner-border text-primary" role="status"/><span className="visually-hidden">Loading…</span></div>;

  if (error)
    return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container py-5">
      <div style={{ position: "relative", marginBottom: AVATAR/2 }}>
        {user.coverImage && (
          <img
            src={user.coverImage}
            alt="Cover"
            className="img-fluid rounded-top"
            style={{ width: "100%", height: BANNER, objectFit: "cover" }}
          />
        )}
        {user.avatar && (
          <img
            src={user.avatar}
            alt="Avatar"
            className="rounded-circle border border-white"
            style={{
              width: AVATAR,
              height: AVATAR,
              objectFit: "cover",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: -(AVATAR/2),
              background: "white",
            }}
          />
        )}
      </div>

      <div className="text-center mb-5">
        <h2>{user.fullname}</h2>
      </div>

      <h1 className="mb-4">Channel Dashboard</h1>
      <div className="row g-4 mb-5">
        {[
          { label: "Total Videos",   value: stats.totalVideos,      color: "primary" },
          { label: "Total Views",    value: stats.totalViews,       color: "success" },
          { label: "Subscribers",    value: stats.totalSubscribers, color: "warning" },
          { label: "Total Likes",    value: stats.totalLikes,       color: "danger" },
        ].map(({label,value,color}) => (
          <div key={label} className="col-sm-6 col-lg-3">
            <div className={`card text-white bg-${color} h-100`}>
              <div className="card-body text-center">
                <h5 className="card-title">{label}</h5>
                <p className="display-6">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* <p className="text-muted">More features coming soon…</p> */}
    </div>
  );
}
