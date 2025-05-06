import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function Tweets() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const u = await api.get("/users/current-user");
        const userId = u.data.data._id;
        const res = await api.get(`/tweets/user/${userId}`);
        if (!mounted) return;
        setTweets(res.data.data);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load tweets.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const deleteTweet = async (id) => {
    if (!window.confirm("Delete this tweet?")) return;
    try {
      await api.delete(`/tweets/${id}`);
      setTweets(tweets.filter((t) => t._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const saveEdit = async () => {
    if (!editingContent.trim()) return;
    try {
      const res = await api.patch(`/tweets/${editingId}`, {
        content: editingContent.trim(),
      });
      setTweets(
        tweets.map((t) => (t._id === editingId ? res.data.data : t))
      );
      setEditingId(null);
      setEditingContent("");
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <p className="text-center text-light mt-5">Loading tweets…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="dashboard-page py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-light">My Tweets</h1>
          <button className="btn btn-primary" onClick={() => navigate("/tweets/new")}>
            New Tweet
          </button>
        </div>

        {tweets.length === 0 && (
          <p className="text-center text-light">You haven’t tweeted yet.</p>
        )}

        {tweets.map((t) => (
          <div key={t._id} className="mb-4 p-4 bg-dash rounded shadow-sm">
            {editingId === t._id ? (
              <>
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button className="btn btn-sm btn-success me-2" onClick={saveEdit}>
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
              <>
                <p className="text-light mb-1">{t.content}</p>
                <small className="text-muted">
                  {new Date(t.createdAt).toLocaleString()}
                </small>
                <div className="mt-2">
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => {
                      setEditingId(t._id);
                      setEditingContent(t.content);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteTweet(t._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
