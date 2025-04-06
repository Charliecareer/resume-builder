"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText: resume, jobDescription: job }),
    });
    const data = await res.json();
    setResult(data.choices?.[0]?.message?.content || "無法取得回覆");
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        AI 履歷優化工具
      </h1>
      <textarea
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        placeholder="貼上你的履歷內容..."
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        rows={6}
      />
      <textarea
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        placeholder="貼上職缺描述..."
        value={job}
        onChange={(e) => setJob(e.target.value)}
        rows={4}
      />
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#2563EB",
          color: "#fff",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "none",
        }}
      >
        開始分析
      </button>
      {result && (
        <div
          style={{
            marginTop: "1rem",
            backgroundColor: "#f1f5f9",
            padding: "1rem",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
            border: "1px solid #ddd",
          }}
        >
          {result}
        </div>
      )}
    </main>
  );
}

