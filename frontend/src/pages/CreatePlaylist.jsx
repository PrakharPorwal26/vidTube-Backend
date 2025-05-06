import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function CreatePlaylist() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/playlists", { name, description });
      navigate(`/playlists/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: "#1e1e1e", minHeight: "100vh", color: "#f1f1f1" }}>
      <div className="container">
        <h1 className="mb-4">New Playlist</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control bg-dark text-light border-secondary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control bg-dark text-light border-secondary"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-success">Create</button>
        </form>
      </div>
    </div>
  );
}
