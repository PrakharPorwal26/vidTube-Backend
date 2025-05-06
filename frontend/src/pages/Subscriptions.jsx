import React, { useEffect, useState } from "react";
import api from "../utils/axios";

export default function Subscriptions() {
  const [channels, setChannels] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const uRes = await api.get("/users/current-user");
        const userId = uRes.data.data._id;

        const cRes = await api.get(`/subscriptions/u/${userId}`);
        const myChannels = cRes.data.data.map((s) => s.channel || {});

        const sRes = await api.get(`/subscriptions/c/${userId}`);
        const mySubscribers = sRes.data.data.map((s) => s.subscriber || {});

        if (!mounted) return;
        setChannels(myChannels);
        setSubscribers(mySubscribers);
      } catch (e) {
        console.error("Failed to load subscriptions:", e);
        if (mounted) setError(e.response?.data?.message || e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center text-white">
        <div className="spinner-border text-light" role="status" />
        <span className="visually-hidden">Loading…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page py-5">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page py-5">
      <div className="container">
        <h2 className="mb-4">Subscribed Channels</h2>
        {channels.length === 0 ? (
          <p className="text-muted">You haven’t subscribed to any channels yet.</p>
        ) : (
          <ul className="list-group list-group-flush mb-5">
            {channels.map((ch) => (
              <li
                key={ch._id}
                className="list-group-item bg-dark text-white border-secondary rounded mb-2"
              >
                <strong>@{ch.username}</strong>{" "}
                <span className="text-light opacity-75">({ch.email})</span>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mb-4">Your Subscribers</h2>
        {subscribers.length === 0 ? (
          <p className="text-muted">No one has subscribed to your channel yet.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {subscribers.map((sub) => (
              <li
                key={sub._id}
                className="list-group-item bg-dark text-white border-secondary rounded mb-2"
              >
                <strong>@{sub.username}</strong>{" "}
                <span className="text-light opacity-75">({sub.email})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
