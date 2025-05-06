import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function CreateTweet() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }
    try {
      await api.post("/tweets", { content: content.trim() });
      navigate("/tweets");
    } catch (e) {
      console.error(e);
      setError("Failed to post tweet");
    }
  };

  return (
    <div className="dashboard-page py-5">
      <div className="container">
        <h1 className="text-light mb-4">New Tweet</h1>
        <form onSubmit={onSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <textarea
              className="form-control"
              rows={4}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                backgroundColor: "#2a2a2a",
                color: "#fff",
                border: "1px solid #444",
                caretColor: "#fff",
              }}
            />
            <style>
              {`
                textarea::placeholder {
                  color: #aaa !important;
                  opacity: 1;
                }
              `}
            </style>
          </div>
          <button className="btn btn-primary" type="submit">
            Tweet
          </button>
        </form>
      </div>
    </div>
  );
}
