import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { FaVideo, FaUsers, FaHeart, FaUserPlus } from "react-icons/fa";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = await api.get("/users/current-user");
        setUser(u.data.data);

        const s = await api.get("/dashboard/stats");
        setStats(s.data.data);

        const sub = await api.get(`/subscriptions/u/${u.data.data._id}`);
        setSubscriptions(sub.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center text-white">
        Loading…
      </div>
    );

  if (error)
    return <div className="container text-danger py-5">{error}</div>;

  const metrics = [
    {
      label: "Total Videos",
      value: stats.totalVideos,
      icon: <FaVideo size={28} />,
    },
    {
      label: "Subscribers",
      value: stats.totalSubscribers,
      icon: <FaUsers size={28} />,
    },
    {
      label: "Total Likes",
      value: stats.totalLikes,
      icon: <FaHeart size={28} />,
    },
    {
      label: "Subscribed Channels",
      value: subscriptions.length,
      icon: <FaUserPlus size={28} />,
    },
  ];

  return (
    <div className="dashboard-page pb-5">
      {/* Cover */}
      <div style={{ height: 200, position: "relative" }}>
        <div
          className="dashboard-cover w-100"
          style={{
            height: "100%",
            backgroundImage: user.coverImage ? `url(${user.coverImage})` : undefined,
          }}
        />
        <img src={user.avatar} alt="avatar" className="dashboard-avatar" />
      </div>

      {/* Name */}
      <div className="text-center pt-5 mt-3">
        <h2 className="fw-bold text-white">{user.fullname}</h2>
        <p style={{ color: "#CCCCCC" }}>@{user.username}</p>
      </div>

      {/* Stats */}
      <div className="container mt-5">
        <h3 className="mb-4 text-white">Your Channel Overview</h3>
        <div className="row g-4">
          {metrics.map(({ label, value, icon }) => (
            <div key={label} className="col-sm-6 col-lg-3">
            <div className="card bg-dash p-4 text-center text-white">
              <div className="card-icon mb-2">{icon}</div>
              <div style={{ color: "#CCCCCC", fontSize: "0.9rem", fontWeight: 500 }}>
                {label}
              </div>
              <h2 className="fw-bold mt-1">{value}</h2>
            </div>
          </div>          
          ))}
        </div>
      </div>
    </div>
  );
}
