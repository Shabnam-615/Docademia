import { useState, useEffect, useRef, useCallback } from "react";

const COLORS = {
  bg: "#faf8f3",
  green: "#2d6a4f",
  greenLight: "#e8f5ee",
  greenMid: "#a8c5b5",
  gold: "#c9a84c",
  goldLight: "#fdf6e3",
  coral: "#e07a5f",
  coralLight: "#fdf0ec",
  rose: "#b5838d",
  roseLight: "#f9f0f2",
  teal: "#457b9d",
  tealLight: "#eaf4fb",
  lavender: "#7c6fcd",
  lavenderLight: "#f0eeff",
  text: "#1a1a1a",
  muted: "#6b7c6e",
};

const FLIP_COLORS = [
  { bg: COLORS.goldLight, border: "#e8d5a3", text: "#7a5c1e" },
  { bg: COLORS.coralLight, border: "#f0b8a8", text: "#8b3a24" },
  { bg: COLORS.tealLight, border: "#a8c8e0", text: "#2a5070" },
  { bg: COLORS.roseLight, border: "#d4a8b0", text: "#6b3a42" },
  { bg: COLORS.lavenderLight, border: "#c4bef0", text: "#3d3570" },
  { bg: COLORS.greenLight, border: COLORS.greenMid, text: COLORS.green },
];

const PALETTES = [
  { bg: COLORS.greenLight, border: COLORS.greenMid, text: COLORS.green },
  { bg: COLORS.goldLight, border: "#e8d5a3", text: "#7a5c1e" },
  { bg: COLORS.coralLight, border: "#f0b8a8", text: "#8b3a24" },
  { bg: COLORS.roseLight, border: "#d4a8b0", text: "#6b3a42" },
  { bg: COLORS.tealLight, border: "#a8c8e0", text: "#2a5070" },
  { bg: COLORS.lavenderLight, border: "#c4bef0", text: "#3d3570" },
];

function ConceptMap({ nodes }) {
  if (!nodes || !Array.isArray(nodes)) return (
    <p style={{ color: COLORS.muted, fontSize: 14 }}>No concept map available.</p>
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
      {nodes.map(node => (
        <div key={node.id} style={{
          background: COLORS.greenLight,
          border: `1px solid ${COLORS.greenMid}`,
          borderRadius: 20, padding: "8px 18px",
          fontSize: 14, color: COLORS.green, fontWeight: 500
        }}>
          {node.label}
          {node.connections && node.connections.length > 0 && (
            <span style={{ color: COLORS.greenMid, fontSize: 12, marginLeft: 8 }}>
              → {node.connections.join(", ")}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function Flashcards({ cards, onReload }) {
  const [flipped, setFlipped] = useState({});
  const toggle = (i) => setFlipped(f => ({ ...f, [i]: !f[i] }));

  if (!cards || !Array.isArray(cards)) return (
    <p style={{ color: COLORS.muted, fontSize: 14 }}>No flashcards available.</p>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <button
          onClick={() => { setFlipped({}); onReload(); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            border: `1px solid ${COLORS.greenMid}`,
            background: COLORS.greenLight,
            borderRadius: 20, padding: "7px 18px",
            cursor: "pointer", fontSize: 12,
            color: COLORS.green, fontWeight: 600,
            fontFamily: "inherit"
          }}
        >↻ Shuffle new questions</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {cards.map((card, i) => {
          const fc = FLIP_COLORS[i % FLIP_COLORS.length];
          return (
            <div
              key={`${card.question}-${i}`}
              onClick={() => toggle(i)}
              style={{
                border: `1px solid ${flipped[i] ? fc.border : "#e8e4da"}`,
                borderRadius: 14, padding: "1.4rem",
                cursor: "pointer", minHeight: 110,
                background: flipped[i] ? fc.bg : "#fff",
                transition: "all 0.25s",
                display: "flex", alignItems: "center",
                justifyContent: "center", textAlign: "center",
                fontSize: 13, lineHeight: 1.6,
                color: flipped[i] ? fc.text : COLORS.text,
                boxShadow: flipped[i]
                  ? `0 4px 16px ${fc.border}88`
                  : "0 2px 8px rgba(0,0,0,0.04)"
              }}
            >
              <div>
                {!flipped[i] && (
                  <p style={{ fontSize: 10, color: COLORS.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                    tap to reveal
                  </p>
                )}
                {flipped[i] ? card.answer : card.question}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreBar({ label, score, color, lightColor }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: COLORS.muted }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}%</span>
      </div>
      <div style={{ background: lightColor, borderRadius: 20, height: 8, overflow: "hidden" }}>
        <div style={{
          width: `${score}%`, background: color,
          height: "100%", borderRadius: 20,
          transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)"
        }} />
      </div>
    </div>
  );
}

function CharacterModal({ char, onClose }) {
  const seed = char.name.length * 7;
  const s = (base, range) => Math.abs((seed * base) % range) + (100 - range);
  const scores = {
    openness: s(17, 50),
    conscientiousness: s(23, 50),
    extraversion: s(11, 60),
    agreeableness: s(19, 55),
    neuroticism: s(13, 60),
    manipulation: s(29, 70),
    leadership: s(7, 55),
    emotionalIntelligence: s(31, 50),
  };
  const archetype =
    scores.manipulation > 65 ? "🎭 The Manipulator" :
    scores.leadership > 68 ? "👑 The Leader" :
    scores.agreeableness > 70 ? "🛡 The Loyalist" :
    scores.neuroticism > 65 ? "🌊 The Suffering Soul" :
    scores.openness > 70 ? "🔭 The Visionary" :
    "⚖️ The Complex Figure";

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "1rem"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", border: "1px solid #e8e4da",
        borderRadius: 24, padding: "2rem",
        maxWidth: 480, width: "100%",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        fontFamily: "inherit"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: COLORS.text }}>{char.name}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {char.traits.map((t, i) => (
                <span key={i} style={{
                  background: COLORS.greenLight, border: `1px solid ${COLORS.greenMid}`,
                  borderRadius: 20, padding: "3px 12px", fontSize: 12, color: COLORS.green
                }}>{t}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose} style={{
            border: "1px solid #e8e4da", background: "#faf8f3",
            borderRadius: "50%", width: 32, height: 32,
            cursor: "pointer", fontSize: 14, color: COLORS.muted,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit"
          }}>✕</button>
        </div>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.8, marginBottom: "1.5rem" }}>{char.psychology}</p>
        <div style={{
          background: COLORS.greenLight, border: `1px solid ${COLORS.greenMid}`,
          borderRadius: 12, padding: "12px 16px", marginBottom: "1.5rem", textAlign: "center"
        }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COLORS.green }}>{archetype}</p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: COLORS.muted }}>Character Archetype</p>
        </div>
        <p style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Big Five Personality</p>
        <ScoreBar label="Openness" score={scores.openness} color={COLORS.teal} lightColor={COLORS.tealLight} />
        <ScoreBar label="Conscientiousness" score={scores.conscientiousness} color={COLORS.green} lightColor={COLORS.greenLight} />
        <ScoreBar label="Extraversion" score={scores.extraversion} color={COLORS.gold} lightColor={COLORS.goldLight} />
        <ScoreBar label="Agreeableness" score={scores.agreeableness} color={COLORS.rose} lightColor={COLORS.roseLight} />
        <ScoreBar label="Neuroticism" score={scores.neuroticism} color={COLORS.coral} lightColor={COLORS.coralLight} />
        <p style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, margin: "1.5rem 0 14px" }}>Behavioural Profile</p>
        <ScoreBar label="Manipulation" score={scores.manipulation} color={COLORS.coral} lightColor={COLORS.coralLight} />
        <ScoreBar label="Leadership" score={scores.leadership} color={COLORS.teal} lightColor={COLORS.tealLight} />
        <ScoreBar label="Emotional Intelligence" score={scores.emotionalIntelligence} color={COLORS.rose} lightColor={COLORS.roseLight} />
      </div>
    </div>
  );
}

function Characters({ characters }) {
  const [selected, setSelected] = useState(null);
  if (!characters || !Array.isArray(characters)) return (
    <p style={{ color: COLORS.muted, fontSize: 14 }}>No profiles available.</p>
  );
  
  const safe = characters.map(c => ({
    ...c,
    traits: Array.isArray(c.traits) ? c.traits : [],
    psychology: c.psychology || ""
  }));
  const featured = safe.slice(0, 3);
  const rest = safe.slice(3);

  return (
    <>
      {selected && <CharacterModal char={selected} onClose={() => setSelected(null)} />}

      {/* featured cards — first 3 only */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14, marginBottom: rest.length > 0 ? 24 : 0 }}>
        {featured.map((char, i) => {
          const p = PALETTES[i % PALETTES.length];
          return (
            <div key={i} onClick={() => setSelected(char)}
              style={{
                background: p.bg, border: `1px solid ${p.border}`,
                borderRadius: 16, padding: "1.4rem",
                cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <p style={{ fontWeight: 700, fontSize: 16, color: p.text, margin: "0 0 10px" }}>{char.name}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {char.traits.map((t, j) => (
                  <span key={j} style={{
                    background: "#fff", border: `1px solid ${p.border}`,
                    borderRadius: 20, padding: "2px 10px", fontSize: 11, color: p.text
                  }}>{t}</span>
                ))}
              </div>
              <p style={{ fontSize: 13, color: COLORS.muted, margin: "0 0 12px", lineHeight: 1.6 }}>{char.psychology}</p>
              <p style={{ fontSize: 12, color: p.text, margin: 0, fontWeight: 500 }}>View full profile →</p>
            </div>
          );
        })}
      </div>

      {/* remaining characters as list — only shown if more than 3 */}
      {rest.length > 0 && (
        <div>
          <p style={{
            fontSize: 12, fontWeight: 600, color: COLORS.muted,
            textTransform: "uppercase", letterSpacing: 1, marginBottom: 12
          }}>More people in this document</p>
          <div style={{
            background: "#fff", border: "1px solid #e8e4da",
            borderRadius: 16, overflow: "hidden"
          }}>
            {rest.map((char, i) => {
              const p = PALETTES[(i + 3) % PALETTES.length];
              return (
                <div key={i} onClick={() => setSelected(char)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 20px",
                    borderBottom: i < rest.length - 1 ? "1px solid #f0ece4" : "none",
                    cursor: "pointer", transition: "background 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#faf8f3"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: p.bg, border: `1px solid ${p.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700, color: p.text, flexShrink: 0
                    }}>{char.name.charAt(0)}</div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COLORS.text }}>{char.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: COLORS.muted }}>{(char.traits || []).slice(0, 2).join(" · ")}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: COLORS.muted }}>View profile →</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default function Results({ data, onReset }) {
  const [flashcardKey, setFlashcardKey] = useState(0);
  const [shuffledCards, setShuffledCards] = useState(data.flashcards);
  const [activeSection, setActiveSection] = useState("concepts");

  const conceptRef = useRef(null);
  const flashRef = useRef(null);
  const peopleRef = useRef(null);

  const reloadFlashcards = useCallback(() => {
    if (!data.flashcards) return;
    setShuffledCards([...data.flashcards].sort(() => Math.random() - 0.5));
    setFlashcardKey(k => k + 1);
  }, [data.flashcards]);

  // track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.dataset.section);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (conceptRef.current) observer.observe(conceptRef.current);
    if (flashRef.current) observer.observe(flashRef.current);
    if (peopleRef.current) observer.observe(peopleRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = [
    { id: "concepts", label: "Concept Map", icon: "🗺", ref: conceptRef },
    { id: "flashcards", label: "Flashcards", icon: "🃏", ref: flashRef },
    { id: "people", label: "People", icon: "👤", ref: peopleRef },
  ];

  const label = {
    fontSize: 11, fontWeight: 600, color: COLORS.muted,
    textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16,
    textAlign: "center"
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', system-ui, sans-serif !important; }
        html { scroll-behavior: smooth; }
        .section-divider {
          display: flex; align-items: center; gap: 16px; margin: 0 0 28px;
        }
        .section-divider::before, .section-divider::after {
          content: ''; flex: 1; height: 1px; background: #e0dbd0;
        }
      `}</style>

      <div style={{ minHeight: "100vh", width: "100vw", background: COLORS.bg, display: "flex" }}>

        {/* sidebar */}
        <div style={{
          width: 220, flexShrink: 0,
          background: "linear-gradient(160deg, #2d6a4f 0%, #1b4332 100%)",
          padding: "2rem 1.5rem",
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          position: "sticky", top: 0, height: "100vh"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem" }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
              }}>✦</div>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>Docademia</span>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.07)",
              borderRadius: 10, padding: "12px",
              marginBottom: "1.5rem"
            }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Now reading</p>
              <p style={{ color: "#fff", fontWeight: 600, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{data.title}</p>
            </div>

            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Jump to</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.ref)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, border: "none",
                  background: activeSection === item.id ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)",
                  color: activeSection === item.id ? "#fff" : "rgba(255,255,255,0.6)",
                  fontSize: 13, fontWeight: activeSection === item.id ? 600 : 400,
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s", fontFamily: "inherit",
                  borderLeft: activeSection === item.id ? "3px solid rgba(255,255,255,0.6)" : "3px solid transparent"
                }}>
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Document stats</p>
              {[
                { label: "Concepts", value: data.concept_map?.length || 0 },
                { label: "Flashcards", value: shuffledCards?.length || 0 },
                { label: "People", value: data.characters?.length || 0 },
              ].map((stat, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{stat.label}</span>
                  <span style={{
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: 10, padding: "2px 10px",
                    fontSize: 12, fontWeight: 700, color: "#fff"
                  }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={onReset} style={{
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            borderRadius: 10, padding: "10px",
            cursor: "pointer", color: "rgba(255,255,255,0.7)",
            fontSize: 13, width: "100%", fontFamily: "inherit"
          }}>↑ Upload another</button>
        </div>

        {/* main */}
        <div style={{ flex: 1, padding: "3rem 4rem", overflowY: "auto" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>

            {/* hero header */}
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span style={{
                background: COLORS.greenLight, border: `1px solid ${COLORS.greenMid}`,
                borderRadius: 20, padding: "4px 14px",
                fontSize: 11, color: COLORS.green,
                textTransform: "uppercase", letterSpacing: 1.5,
                display: "block", marginBottom: 20
              }}>Analysis Complete</span>

              {/* title with green underline accent */}
              <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
                <h1 style={{
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 800, color: COLORS.text,
                  lineHeight: 1.15, margin: 0
                }}>{data.title}</h1>
                <div style={{
                  height: 4, borderRadius: 2,
                  background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.teal}, ${COLORS.coral})`,
                  marginTop: 10
                }} />
              </div>

              <p style={{
                color: COLORS.muted, fontSize: 15, lineHeight: 1.9,
                maxWidth: 520, margin: "0 auto"
              }}>{data.summary}</p>

              {/* quick stat pills */}
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
                {[
                  { icon: "🗺", val: data.concept_map?.length || 0, label: "concepts" },
                  { icon: "🃏", val: shuffledCards?.length || 0, label: "flashcards" },
                  { icon: "👤", val: data.characters?.length || 0, label: "people" },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: "#fff",
                    border: "1px solid #e8e4da",
                    borderRadius: 20, padding: "6px 16px",
                    fontSize: 13, color: COLORS.muted,
                    display: "flex", alignItems: "center", gap: 6,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                  }}>
                    <span>{s.icon}</span>
                    <strong style={{ color: COLORS.text }}>{s.val}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* concept map */}
            <div style={{ marginBottom: "4rem" }} ref={conceptRef} data-section="concepts">
              <div className="section-divider">
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.green, textTransform: "uppercase", letterSpacing: 2 }}>
                  🗺 Concept Map
                </span>
              </div>
              <ConceptMap nodes={data.concept_map} />
            </div>

            {/* flashcards */}
            <div style={{ marginBottom: "4rem" }} ref={flashRef} data-section="flashcards">
              <div className="section-divider">
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 2 }}>
                  🃏 Flashcards
                </span>
              </div>
              <Flashcards key={flashcardKey} cards={shuffledCards} onReload={reloadFlashcards} />
            </div>

            {/* people */}
            <div style={{ marginBottom: "4rem", textAlign: "left" }} ref={peopleRef} data-section="people">
              <div className="section-divider">
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.coral, textTransform: "uppercase", letterSpacing: 2 }}>
                  👤 People Profiles
                </span>
              </div>
              <Characters characters={data.characters} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}