import { useRef } from "react";
import axios from "axios";

export default function Upload({ setData, setLoading, loading }) {
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await axios.post("http://localhost:8000/analyze", form, { timeout: 180000 });
      setData(res.data);
    } catch (e) {
      alert("Something went wrong. Make sure your backend is running.");
      console.error(e);
    }
    setLoading(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100vw",
      display: "flex", background: "#faf8f3", overflow: "hidden"
    }}>
      {/* Left green panel */}
      <div style={{
        width: "45%",
        background: "linear-gradient(160deg, #2d6a4f 0%, #1b4332 60%, #081c15 100%)",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "3rem", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)", top: -80, right: -80
        }} />
        <div style={{
          position: "absolute", width: 200, height: 200, borderRadius: "50%",
          background: "rgba(255,255,255,0.03)", bottom: 100, left: -60
        }} />

        <div>
          {/* logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
            }}>✦</div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: 0.5 }}>Docademia</span>
          </div>

          <h1 style={{
            color: "#fff",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 700, lineHeight: 1.2, marginBottom: 20
          }}>
            Illuminate<br />what you read.
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 16, lineHeight: 1.8, maxWidth: 320
          }}>
            Upload any book, paper, or document. Docademia extracts the essence — concepts, memory aids, and deep character insight.
          </p>
        </div>

        {/* features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { icon: "🗺", label: "Concept Mapping", desc: "Key ideas, visually connected" },
            { icon: "🃏", label: "Memory Flashcards", desc: "Retain what you read" },
            { icon: "🔬", label: "People Analysis", desc: "Psychology of every character" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0
              }}>{f.icon}</div>
              <div>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0 }}>{f.label}</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          Works on novels, research papers, textbooks, and more.
        </p>
      </div>

      {/* Right cream panel */}
      <div style={{
        width: "55%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "3rem", background: "#faf8f3"
      }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1b4332", marginBottom: 8 }}>
            Upload your document
          </h2>
          <p style={{ color: "#6b7c6e", fontSize: 15, marginBottom: 36, lineHeight: 1.6 }}>
            PDF files only. Books, papers, reports — anything text-based works.
          </p>

          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !loading && inputRef.current.click()}
            style={{
              border: "2px dashed #a8c5b5", borderRadius: 20,
              padding: "3rem 2rem", textAlign: "center",
              cursor: loading ? "default" : "pointer",
              background: loading ? "#f0f7f4" : "#fff",
              transition: "all 0.2s", marginBottom: 24
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.borderColor = "#2d6a4f";
                e.currentTarget.style.background = "#f0f7f4";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "#a8c5b5";
              e.currentTarget.style.background = loading ? "#f0f7f4" : "#fff";
            }}
          >
            {loading ? (
              <>
                <div style={{ marginBottom: 16 }}><Spinner /></div>
                <p style={{ fontSize: 17, fontWeight: 600, color: "#1b4332", marginBottom: 8 }}>
                  Analysing your document...
                </p>
                <p style={{ color: "#6b7c6e", fontSize: 13 }}>
                  Extracting concepts, flashcards and profiles — about 30 seconds
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
                  {["Reading text", "Mapping ideas", "Building flashcards"].map((s, i) => (
                    <span key={i} style={{
                      background: "#e8f5ee", border: "1px solid #a8c5b5",
                      borderRadius: 20, padding: "4px 12px",
                      fontSize: 11, color: "#2d6a4f"
                    }}>{s}</span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 44, marginBottom: 14 }}>📄</div>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#2c2c2c", marginBottom: 6 }}>
                  Drop your PDF here
                </p>
                <p style={{ color: "#9aab9e", fontSize: 13, marginBottom: 24 }}>or click to browse</p>
                <div style={{
                  display: "inline-block", background: "#2d6a4f",
                  borderRadius: 10, padding: "11px 28px",
                  fontSize: 14, fontWeight: 600, color: "#fff",
                  boxShadow: "0 4px 20px rgba(45,106,79,0.3)"
                }}>
                  Choose a file
                </div>
              </>
            )}
            <input
              ref={inputRef} type="file" accept=".pdf"
              style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0])}
            />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["📚 Novels", "📝 Research Papers", "📖 Textbooks", "📋 Reports"].map((t, i) => (
              <span key={i} style={{
                background: "#fff", border: "1px solid #dde8e3",
                borderRadius: 20, padding: "6px 14px",
                fontSize: 12, color: "#6b7c6e"
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 44, height: 44, margin: "0 auto",
      border: "3px solid #e8f5ee",
      borderTop: "3px solid #2d6a4f",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}