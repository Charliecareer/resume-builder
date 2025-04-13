"use client";

export default function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        履歷大師
      </h1>
      <p style={{ marginBottom: "1.5rem" }}>
        一步步打造完美中英文履歷，提升求職競爭力
      </p>
      <ol style={{ lineHeight: "2" }}>
        <li>1. 選擇目標產業及職位，獲取相關職缺推薦</li>
        <li>2. 分析職位描述，了解關鍵技能和特質要求</li>
        <li>3. 上傳現有履歷，獲取匹配度分析</li>
        <li>4. 根據AI建議，優化履歷內容和呈現方式</li>
        <li>5. 生成專業中英文履歷，立即可用於求職</li>
      </ol>
      <button style={{ marginTop: "2rem", padding: "1rem 2rem", background: "#2563EB", color: "#fff", borderRadius: "6px" }}>
        開始製作履歷
      </button>
    </main>
  );
}

