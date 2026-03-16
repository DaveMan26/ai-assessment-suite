import { useState, useEffect, useRef, useCallback } from 'react';
import { DIMS, DIM_ORDER, S, generateSpeedItems } from './iqData';
import { getLevel, getLevelColor } from './iqScoring';
import { generateMarkdown, generatePDFHtml } from './iqExport';
import { downloadFile } from '../../lib/export';

// ═══════════════════════════════════════════════════════════
// SVG SHAPE PRIMITIVES
// ═══════════════════════════════════════════════════════════

export function Shape({ type, x, y, size, fill = "none", stroke = "#2D6A9F", strokeWidth = 2.5, rotation = 0 }) {
  const s = size;
  const transform = rotation ? `rotate(${rotation} ${x} ${y})` : undefined;
  switch (type) {
    case "circle":
      return <circle cx={x} cy={y} r={s * 0.42} fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform} />;
    case "square":
      return <rect x={x - s * 0.36} y={y - s * 0.36} width={s * 0.72} height={s * 0.72} fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform} />;
    case "triangle": {
      const tp = `${x},${y - s * 0.42} ${x - s * 0.4},${y + s * 0.3} ${x + s * 0.4},${y + s * 0.3}`;
      return <polygon points={tp} fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform} />;
    }
    case "diamond": {
      const dp = `${x},${y - s * 0.42} ${x + s * 0.32},${y} ${x},${y + s * 0.42} ${x - s * 0.32},${y}`;
      return <polygon points={dp} fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform} />;
    }
    case "star": {
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const aO = (i * 72 - 90) * Math.PI / 180;
        const aI = ((i * 72) + 36 - 90) * Math.PI / 180;
        pts.push(`${x + s * 0.42 * Math.cos(aO)},${y + s * 0.42 * Math.sin(aO)}`);
        pts.push(`${x + s * 0.2 * Math.cos(aI)},${y + s * 0.2 * Math.sin(aI)}`);
      }
      return <polygon points={pts.join(" ")} fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform} />;
    }
    case "cross": {
      const w = s * 0.16, h = s * 0.42;
      return <g transform={transform}>
        <rect x={x - w} y={y - h} width={w * 2} height={h * 2} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        <rect x={x - h} y={y - w} width={h * 2} height={w * 2} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      </g>;
    }
    case "hexagon": {
      const hp = [];
      for (let i = 0; i < 6; i++) {
        const a = (i * 60 - 30) * Math.PI / 180;
        hp.push(`${x + s * 0.4 * Math.cos(a)},${y + s * 0.4 * Math.sin(a)}`);
      }
      return <polygon points={hp.join(" ")} fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform} />;
    }
    case "line_h":
      return <line x1={x - s * 0.35} y1={y} x2={x + s * 0.35} y2={y} stroke={stroke} strokeWidth={strokeWidth + 1} transform={transform} />;
    case "line_d":
      return <line x1={x - s * 0.3} y1={y - s * 0.3} x2={x + s * 0.3} y2={y + s * 0.3} stroke={stroke} strokeWidth={strokeWidth + 1} transform={transform} />;
    case "dots2":
      return <g transform={transform}>
        <circle cx={x - s * 0.15} cy={y} r={s * 0.1} fill={stroke} />
        <circle cx={x + s * 0.15} cy={y} r={s * 0.1} fill={stroke} />
      </g>;
    case "dots3":
      return <g transform={transform}>
        <circle cx={x} cy={y - s * 0.18} r={s * 0.09} fill={stroke} />
        <circle cx={x - s * 0.16} cy={y + s * 0.12} r={s * 0.09} fill={stroke} />
        <circle cx={x + s * 0.16} cy={y + s * 0.12} r={s * 0.09} fill={stroke} />
      </g>;
    default:
      return <circle cx={x} cy={y} r={s * 0.3} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />;
  }
}

export function PatternCell({ shapes, size = 70, bg = "#f8f9fc", border = "#dde3ed" }) {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ background: bg, borderRadius: 8, border: `1.5px solid ${border}` }}>
      {shapes.map((s, i) => <Shape key={i} {...s} />)}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// TASK RENDERERS
// ═══════════════════════════════════════════════════════════

export function LogicTaskRenderer({ task, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const isGrid = !!task.grid;
  const cellSize = 70;
  return (
    <div>
      <p style={{ fontSize: 14, color: "#777", textAlign: "center", marginBottom: 20 }}>{task.instruction}</p>
      {isGrid ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${task.gridCols}, ${cellSize}px)`, gap: 6 }}>
            {task.grid.map((cell, i) => cell ? (
              <PatternCell key={i} shapes={cell} size={cellSize} />
            ) : (
              <div key={i} style={{ width: cellSize, height: cellSize, background: "#edf2f8", borderRadius: 8, border: "2px dashed #2D6A9F55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#2D6A9F88" }}>?</div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {task.sequence.map((s, i) => <PatternCell key={i} shapes={s} size={cellSize} />)}
          <div style={{ width: cellSize, height: cellSize, background: "#edf2f8", borderRadius: 8, border: "2px dashed #2D6A9F55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#2D6A9F88" }}>?</div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, maxWidth: 400, margin: "0 auto" }}>
        {task.options.map((opt, i) => (
          <button key={i} onClick={() => { setSelected(i); setTimeout(() => onAnswer(i), 250); }}
            style={{ padding: 8, background: selected === i ? "#2D6A9F15" : "#fff", border: selected === i ? "2.5px solid #2D6A9F" : "1.5px solid #dde3ed", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <PatternCell shapes={opt} size={60} bg={selected === i ? "#edf2f8" : "#f8f9fc"} />
            <span style={{ fontSize: 12, fontWeight: 600, color: selected === i ? "#2D6A9F" : "#999" }}>{String.fromCharCode(65 + i)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function VerbalTaskRenderer({ task, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const dimColor = "#3D7B8A";
  const handleClick = (i) => { setSelected(i); setTimeout(() => onAnswer(i), 300); };

  if (task.type === "analogy" || (!task.type && task.stem)) {
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 32, padding: "20px 24px", background: "#f4f8fc", borderRadius: 14, border: "1px solid #dde3ed" }}>
          <p style={{ fontSize: 15, color: "#777", marginBottom: 8 }}>Analogie:</p>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#2D2D2D", marginBottom: 6 }}>{task.stem}</p>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: dimColor }}>{task.analogy}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 420, margin: "0 auto" }}>
          {task.options.map((opt, i) => (
            <button key={i} onClick={() => handleClick(i)}
              style={{ padding: "16px 12px", background: selected === i ? `${dimColor}12` : "#fff", border: selected === i ? `2.5px solid ${dimColor}` : "1.5px solid #dde3ed", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: selected === i ? 700 : 500, color: selected === i ? dimColor : "#2D2D2D", fontFamily: "'DM Sans'", transition: "all 0.2s" }}>
              <span style={{ fontSize: 12, color: "#999", marginRight: 6 }}>{String.fromCharCode(65 + i)}</span>{opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (task.type === "synonym" || task.type === "antonym") {
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 32, padding: "24px 24px", background: "#f4f8fc", borderRadius: 14, border: "1px solid #dde3ed" }}>
          <p style={{ fontSize: 14, color: "#777", marginBottom: 14 }}>{task.instruction}</p>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: dimColor, fontWeight: 400, letterSpacing: 2 }}>{task.word}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 420, margin: "0 auto" }}>
          {task.options.map((opt, i) => (
            <button key={i} onClick={() => handleClick(i)}
              style={{ padding: "16px 12px", background: selected === i ? `${dimColor}12` : "#fff", border: selected === i ? `2.5px solid ${dimColor}` : "1.5px solid #dde3ed", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: selected === i ? 700 : 500, color: selected === i ? dimColor : "#2D2D2D", fontFamily: "'DM Sans'", transition: "all 0.2s" }}>
              <span style={{ fontSize: 12, color: "#999", marginRight: 6 }}>{String.fromCharCode(65 + i)}</span>{opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (task.type === "text_conclusion") {
    return (
      <div>
        <div style={{ marginBottom: 24, padding: "20px 24px", background: "#f4f8fc", borderRadius: 14, border: "1px solid #dde3ed", textAlign: "left" }}>
          <p style={{ fontSize: 12, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Přečti si text:</p>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: "#2D2D2D", lineHeight: 1.7 }}>{task.passage}</p>
        </div>
        <p style={{ fontSize: 15, color: dimColor, fontWeight: 600, textAlign: "center", marginBottom: 16 }}>{task.question}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, maxWidth: 480, margin: "0 auto" }}>
          {task.options.map((opt, i) => (
            <button key={i} onClick={() => handleClick(i)}
              style={{ padding: "14px 16px", textAlign: "left", background: selected === i ? `${dimColor}12` : "#fff", border: selected === i ? `2.5px solid ${dimColor}` : "1.5px solid #dde3ed", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: selected === i ? 600 : 400, color: selected === i ? dimColor : "#2D2D2D", fontFamily: "'DM Sans'", transition: "all 0.2s" }}>
              <span style={{ fontWeight: 700, color: "#999", marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export function NumericalTaskRenderer({ task, onAnswer }) {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <p style={{ fontSize: 14, color: "#777", textAlign: "center", marginBottom: 12 }}>{task.hint}</p>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        {task.sequence.map((n, i) => (
          <div key={i} style={{ width: 52, height: 52, borderRadius: 10, background: "#fdf5e6", border: "1.5px solid #E8A83844", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: "#E8A838" }}>{n}</div>
        ))}
        <div style={{ width: 52, height: 52, borderRadius: 10, background: "#fff8ec", border: "2px dashed #E8A83866", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#E8A83888" }}>?</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, maxWidth: 400, margin: "0 auto" }}>
        {task.options.map((opt, i) => (
          <button key={i} onClick={() => { setSelected(i); setTimeout(() => onAnswer(i), 250); }}
            style={{ padding: "14px 8px", background: selected === i ? "#E8A83815" : "#fff", border: selected === i ? "2.5px solid #E8A838" : "1.5px solid #dde3ed", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: selected === i ? "#E8A838" : "#2D2D2D", transition: "all 0.2s" }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SpatialTaskRenderer({ task, onAnswer }) {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <p style={{ fontSize: 14, color: "#777", textAlign: "center", marginBottom: 16 }}>{task.instruction}</p>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-block", padding: 8, background: "#edf5fc", borderRadius: 14, border: "2px solid #5BA4D944" }}>
          <p style={{ fontSize: 11, color: "#5BA4D9", fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Reference</p>
          <PatternCell shapes={task.reference} size={90} bg="#f0f7ff" border="#5BA4D966" />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, maxWidth: 440, margin: "0 auto" }}>
        {task.options.map((opt, i) => (
          <button key={i} onClick={() => { setSelected(i); setTimeout(() => onAnswer(i), 250); }}
            style={{ padding: 8, background: selected === i ? "#5BA4D915" : "#fff", border: selected === i ? "2.5px solid #5BA4D9" : "1.5px solid #dde3ed", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <PatternCell shapes={opt} size={70} bg={selected === i ? "#edf5fc" : "#f8f9fc"} />
            <span style={{ fontSize: 12, fontWeight: 600, color: selected === i ? "#5BA4D9" : "#999" }}>{String.fromCharCode(65 + i)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function MemoryTaskRenderer({ task, onAnswer }) {
  if (task.type === "backward_span") return <BackwardSpanRenderer task={task} onAnswer={onAnswer} />;
  if (task.type === "letter_number") return <LetterNumberRenderer task={task} onAnswer={onAnswer} />;
  return <ForwardRecallRenderer task={task} onAnswer={onAnswer} />;
}

export function ForwardRecallRenderer({ task, onAnswer }) {
  const [phase, setPhase] = useState("show");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("blank"), task.displayMs);
    const t2 = setTimeout(() => setPhase("answer"), task.displayMs + 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [task]);

  if (phase === "show") {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 15, color: "#8FBCD4", fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 2 }}>Zapamatuj si sekvenci</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
          {task.sequence.map((n, i) => (
            <div key={i} style={{ width: 56, height: 64, borderRadius: 12, background: "#edf5fc", border: "2px solid #8FBCD4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 800, color: "#2D6A9F", animation: `fadeIn 0.3s ease ${i * 0.15}s both` }}>{n}</div>
          ))}
        </div>
        <div style={{ width: 60, height: 4, borderRadius: 2, background: "#e0e0e0", margin: "0 auto", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#8FBCD4", animation: `shrink ${task.displayMs}ms linear forwards` }} />
        </div>
        <style>{`@keyframes shrink{from{width:100%}to{width:0%}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    );
  }

  if (phase === "blank") {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 32, color: "#8FBCD4", animation: "pulse 1s ease infinite" }}>▣</div>
        <style>{`@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 15, color: "#8FBCD4", fontWeight: 700, marginBottom: 20 }}>Jaká byla správná sekvence?</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, maxWidth: 340, margin: "0 auto" }}>
        {task.options.map((opt, i) => (
          <button key={i} onClick={() => { setSelected(i); setTimeout(() => onAnswer(i), 300); }}
            style={{ padding: "14px 20px", background: selected === i ? "#8FBCD418" : "#fff", border: selected === i ? "2.5px solid #8FBCD4" : "1.5px solid #dde3ed", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 700, color: selected === i ? "#2D6A9F" : "#2D2D2D", transition: "all 0.2s", display: "flex", justifyContent: "center", gap: 8, letterSpacing: 4 }}>
            <span style={{ fontSize: 12, color: "#999", fontWeight: 400, alignSelf: "center", letterSpacing: 0, marginRight: 8 }}>{String.fromCharCode(65 + i)}</span>
            {opt.join("  ")}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BackwardSpanRenderer({ task, onAnswer }) {
  const [phase, setPhase] = useState("show");
  const [userInput, setUserInput] = useState([]);

  useEffect(() => {
    setPhase("show");
    setUserInput([]);
    const t1 = setTimeout(() => setPhase("blank"), task.displayMs);
    const t2 = setTimeout(() => setPhase("input"), task.displayMs + 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [task]);

  if (phase === "show") {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 15, color: "#8FBCD4", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 2 }}>Zapamatuj si čísla</p>
        <p style={{ fontSize: 13, color: "#999", marginBottom: 16 }}>Budeš je zadávat v <strong style={{ color: "#2D6A9F" }}>OPAČNÉM</strong> pořadí</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
          {task.sequence.map((n, i) => (
            <div key={i} style={{ width: 56, height: 64, borderRadius: 12, background: "#edf5fc", border: "2px solid #8FBCD4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 800, color: "#2D6A9F", animation: `fadeIn 0.3s ease ${i * 0.15}s both` }}>{n}</div>
          ))}
        </div>
        <div style={{ width: 60, height: 4, borderRadius: 2, background: "#e0e0e0", margin: "0 auto", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#8FBCD4", animation: `shrink ${task.displayMs}ms linear forwards` }} />
        </div>
        <style>{`@keyframes shrink{from{width:100%}to{width:0%}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    );
  }

  if (phase === "blank") {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 32, color: "#8FBCD4", animation: "pulse 1s ease infinite" }}>▣</div>
        <style>{`@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
      </div>
    );
  }

  const handleDigit = (d) => { if (userInput.length < task.sequence.length) setUserInput([...userInput, d]); };
  const handleDelete = () => setUserInput(userInput.slice(0, -1));
  const handleConfirm = () => {
    const isCorrect = userInput.length === task.correctReverse.length && userInput.every((v, i) => v === task.correctReverse[i]);
    onAnswer(isCorrect ? 0 : 1);
  };

  const seqLen = task.sequence.length;
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 15, color: "#8FBCD4", fontWeight: 700, marginBottom: 6 }}>Zadej čísla v OPAČNÉM pořadí</p>
      <p style={{ fontSize: 12, color: "#999", marginBottom: 20 }}>← pozpátku</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
        {Array.from({ length: seqLen }).map((_, i) => (
          <div key={i} style={{
            width: 52, height: 60, borderRadius: 12,
            background: i < userInput.length ? "#8FBCD418" : "#fff",
            border: i < userInput.length ? "2px solid #8FBCD4" : "2px dashed #ddd",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 800,
            color: "#2D6A9F", transition: "all 0.2s"
          }}>
            {i < userInput.length ? userInput[i] : ""}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, maxWidth: 300, margin: "0 auto 16px" }}>
        {[1,2,3,4,5,6,7,8,9,0].map(d => (
          <button key={d} onClick={() => handleDigit(d)} disabled={userInput.length >= seqLen}
            style={{ width: 52, height: 52, borderRadius: 12, border: "1.5px solid #dde3ed", background: "#fff", cursor: userInput.length >= seqLen ? "default" : "pointer", fontSize: 20, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#2D2D2D", transition: "all 0.15s", opacity: userInput.length >= seqLen ? 0.4 : 1 }}>
            {d}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <button onClick={handleDelete} disabled={userInput.length === 0}
          style={{ padding: "10px 20px", borderRadius: 10, border: "1.5px solid #D97B5B33", background: "#fff", color: "#D97B5B", fontSize: 14, fontWeight: 600, cursor: userInput.length === 0 ? "default" : "pointer", fontFamily: "'DM Sans'", opacity: userInput.length === 0 ? 0.4 : 1, transition: "all 0.2s" }}>
          ← Smazat
        </button>
        <button onClick={handleConfirm} disabled={userInput.length !== seqLen}
          style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: userInput.length === seqLen ? "#8FBCD4" : "#ddd", color: "#fff", fontSize: 14, fontWeight: 700, cursor: userInput.length !== seqLen ? "default" : "pointer", fontFamily: "'DM Sans'", transition: "all 0.2s" }}>
          Potvrdit ✓
        </button>
      </div>
    </div>
  );
}

export function LetterNumberRenderer({ task, onAnswer }) {
  const [phase, setPhase] = useState("show");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setPhase("show");
    setSelected(null);
    const t1 = setTimeout(() => setPhase("blank"), task.displayMs);
    const t2 = setTimeout(() => setPhase("answer"), task.displayMs + 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [task]);

  if (phase === "show") {
    return (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 15, color: "#8FBCD4", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 2 }}>Zapamatuj si znaky</p>
        <p style={{ fontSize: 13, color: "#999", marginBottom: 16 }}>Budeš je řadit: <strong>čísla vzestupně</strong>, pak <strong>písmena abecedně</strong></p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
          {task.sequence.map((item, i) => {
            const isNum = !isNaN(item);
            return (
              <div key={i} style={{
                width: 56, height: 64, borderRadius: 12,
                background: isNum ? "#fdf5e6" : "#edf5fc",
                border: isNum ? "2px solid #E8A838" : "2px solid #8FBCD4",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 800,
                color: isNum ? "#E8A838" : "#2D6A9F",
                animation: `fadeIn 0.3s ease ${i * 0.15}s both`
              }}>{item}</div>
            );
          })}
        </div>
        <div style={{ width: 60, height: 4, borderRadius: 2, background: "#e0e0e0", margin: "0 auto", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#8FBCD4", animation: `shrink ${task.displayMs}ms linear forwards` }} />
        </div>
        <style>{`@keyframes shrink{from{width:100%}to{width:0%}} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    );
  }

  if (phase === "blank") {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 32, color: "#8FBCD4", animation: "pulse 1s ease infinite" }}>▣</div>
        <style>{`@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 15, color: "#8FBCD4", fontWeight: 700, marginBottom: 20 }}>{task.question}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, maxWidth: 380, margin: "0 auto" }}>
        {task.options.map((opt, i) => (
          <button key={i} onClick={() => { setSelected(i); setTimeout(() => onAnswer(i), 300); }}
            style={{ padding: "14px 20px", background: selected === i ? "#8FBCD418" : "#fff", border: selected === i ? "2.5px solid #8FBCD4" : "1.5px solid #dde3ed", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, color: selected === i ? "#2D6A9F" : "#2D2D2D", transition: "all 0.2s", letterSpacing: 1 }}>
            <span style={{ fontSize: 12, color: "#999", fontWeight: 400, letterSpacing: 0, marginRight: 10 }}>{String.fromCharCode(65 + i)}</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SpeedTaskRenderer({ onComplete }) {
  const [items] = useState(() => generateSpeedItems());
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, 30 - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) { setFinished(true); clearInterval(interval); }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (finished) {
      const correct = results.filter(r => r.correct).length;
      const total = results.length;
      onComplete({ correct, total, items: items.length });
    }
  }, [finished]);

  const handleAnswer = (sameClicked) => {
    if (finished) return;
    const isCorrect = sameClicked === items[current].same;
    const newResults = [...results, { correct: isCorrect }];
    setResults(newResults);
    if (current + 1 >= items.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
    }
  };

  if (finished) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#2A4858" }}>Sekce dokončena!</p>
        <p style={{ fontSize: 14, color: "#999", marginTop: 8 }}>Vyhodnocení bude součástí celkových výsledků.</p>
      </div>
    );
  }

  const item = items[current];
  const pct = (timeLeft / 30) * 100;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: "#999", fontFamily: "'DM Mono'" }}>{current + 1}/{items.length}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: timeLeft < 10 ? "#D97B5B" : "#2A4858", fontFamily: "'DM Mono'" }}>{Math.ceil(timeLeft)}s</span>
          <div style={{ width: 100, height: 6, background: "#eee", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: timeLeft < 10 ? "#D97B5B" : "#2A4858", transition: "width 0.1s linear" }} />
          </div>
        </div>
      </div>
      <p style={{ fontSize: 15, color: "#777", textAlign: "center", marginBottom: 20 }}>Jsou tyto dva tvary STEJNÉ?</p>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginBottom: 32 }}>
        <PatternCell shapes={item.left} size={90} bg="#f8f9fc" border="#dde3ed" />
        <span style={{ fontSize: 20, color: "#ccc" }}>vs</span>
        <PatternCell shapes={item.right} size={90} bg="#f8f9fc" border="#dde3ed" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 320, margin: "0 auto" }}>
        <button onClick={() => handleAnswer(true)} style={{ padding: "16px", background: "#fff", border: "2px solid #2A485833", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#2A4858", fontFamily: "'DM Sans'", transition: "all 0.15s" }}
          onMouseDown={e => { e.currentTarget.style.transform = "scale(0.96)"; }}
          onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}>
          ✓ Stejné
        </button>
        <button onClick={() => handleAnswer(false)} style={{ padding: "16px", background: "#fff", border: "2px solid #D97B5B33", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#D97B5B", fontFamily: "'DM Sans'", transition: "all 0.15s" }}
          onMouseDown={e => { e.currentTarget.style.transform = "scale(0.96)"; }}
          onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}>
          ✗ Jiné
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PRACTICE RENDERERS
// ═══════════════════════════════════════════════════════════

export function PracticeFeedback({ correct, explanation, wrongExplanation, onContinue }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 440, margin: "0 auto" }}>
      <div style={{
        padding: "28px 24px", borderRadius: 16, marginBottom: 20,
        background: correct ? "#f0fdf4" : "#fef2f2",
        border: correct ? "2px solid #81B29A" : "2px solid #C44E3F"
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{correct ? "✓" : "✗"}</div>
        <p style={{ fontSize: 20, fontWeight: 700, color: correct ? "#81B29A" : "#C44E3F", marginBottom: 12 }}>
          {correct ? "Správně!" : "Špatně"}
        </p>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
          {correct ? explanation : wrongExplanation}
        </p>
      </div>
      <div style={{ padding: "14px 16px", background: "#f8f6f1", borderRadius: 10, marginBottom: 24, fontSize: 13, color: "#888", lineHeight: 1.6 }}>
        ℹ️ Toto byl tréninkový příklad — nepočítá se do skóre. Nyní začínají ostré úlohy.
      </div>
      <button onClick={onContinue}
        style={{ background: "#2D6A9F", color: "#fff", border: "none", borderRadius: 10, padding: "14px 36px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", boxShadow: "0 4px 12px rgba(45,106,159,0.3)", transition: "all 0.2s" }}
        onMouseOver={e => e.target.style.transform = "translateY(-1px)"}
        onMouseOut={e => e.target.style.transform = "translateY(0)"}>
        Začít ostré úlohy →
      </button>
    </div>
  );
}

export function SpeedPracticeRenderer({ onComplete }) {
  const [items] = useState(() => generateSpeedItems().slice(0, 3));
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (sameClicked) => {
    const isCorrect = sameClicked === items[current].same;
    setFeedback(isCorrect ? "correct" : "wrong");
    setResults([...results, { correct: isCorrect }]);
    setTimeout(() => {
      setFeedback(null);
      if (current + 1 >= items.length) {
        setFinished(true);
      } else {
        setCurrent(current + 1);
      }
    }, 600);
  };

  if (finished) {
    const correct = results.filter(r => r.correct).length;
    return (
      <div style={{ textAlign: "center", maxWidth: 440, margin: "0 auto" }}>
        <div style={{ padding: "28px 24px", borderRadius: 16, marginBottom: 20, background: "#f0fdf4", border: "2px solid #81B29A" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#81B29A", marginBottom: 8 }}>Trénink dokončen!</p>
          <p style={{ fontSize: 14, color: "#555" }}>{correct}/{items.length} správně</p>
        </div>
        <div style={{ padding: "14px 16px", background: "#f8f6f1", borderRadius: 10, marginBottom: 24, fontSize: 13, color: "#888", lineHeight: 1.6 }}>
          ⚡ Teď začne ostrý test — budeš mít <strong>30 sekund</strong> na co nejvíce správných odpovědí. Žádná zpětná vazba během testu.
        </div>
        <button onClick={onComplete}
          style={{ background: "#2A4858", color: "#fff", border: "none", borderRadius: 10, padding: "14px 36px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", boxShadow: "0 4px 12px rgba(42,72,88,0.3)", transition: "all 0.2s" }}
          onMouseOver={e => e.target.style.transform = "translateY(-1px)"}
          onMouseOut={e => e.target.style.transform = "translateY(0)"}>
          Začít ostrý test (30s) →
        </button>
      </div>
    );
  }

  const item = items[current];
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: "#999", fontFamily: "'DM Mono'" }}>Trénink {current + 1}/{items.length}</span>
      </div>
      {feedback && (
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: feedback === "correct" ? "#81B29A" : "#C44E3F" }}>
            {feedback === "correct" ? "✓ Správně" : "✗ Špatně"}
          </span>
        </div>
      )}
      <p style={{ fontSize: 15, color: "#777", textAlign: "center", marginBottom: 20 }}>Jsou tyto dva tvary STEJNÉ?</p>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginBottom: 32 }}>
        <PatternCell shapes={item.left} size={90} bg="#f8f9fc" border="#dde3ed" />
        <span style={{ fontSize: 20, color: "#ccc" }}>vs</span>
        <PatternCell shapes={item.right} size={90} bg="#f8f9fc" border="#dde3ed" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 320, margin: "0 auto" }}>
        <button onClick={() => !feedback && handleAnswer(true)} disabled={!!feedback}
          style={{ padding: "16px", background: "#fff", border: "2px solid #2A485833", borderRadius: 12, cursor: feedback ? "default" : "pointer", fontSize: 16, fontWeight: 700, color: "#2A4858", fontFamily: "'DM Sans'", transition: "all 0.15s", opacity: feedback ? 0.5 : 1 }}>
          ✓ Stejné
        </button>
        <button onClick={() => !feedback && handleAnswer(false)} disabled={!!feedback}
          style={{ padding: "16px", background: "#fff", border: "2px solid #D97B5B33", borderRadius: 12, cursor: feedback ? "default" : "pointer", fontSize: 16, fontWeight: 700, color: "#D97B5B", fontFamily: "'DM Sans'", transition: "all 0.15s", opacity: feedback ? 0.5 : 1 }}>
          ✗ Jiné
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RESULTS COMPONENTS (IQ-specific local versions)
// ═══════════════════════════════════════════════════════════

export function DimensionBar({ dimKey, score }) {
  const dim = DIMS[dimKey]; const pct = Math.round(score);
  const desc = pct >= 65 ? dim.highDesc : pct <= 35 ? dim.lowDesc : dim.midDesc;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontWeight: 700, color: dim.color, fontSize: 15, fontFamily: "'DM Sans'" }}>{dim.icon} {dim.full}</span>
        <span style={{ fontWeight: 800, fontSize: 20, color: dim.color, fontFamily: "'DM Mono', monospace" }}>{pct}%</span>
      </div>
      <div style={{ width: "100%", height: 10, background: "#f0ede8", borderRadius: 5, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${dim.colorLight}, ${dim.color})`, borderRadius: 5, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 11, color: getLevelColor(pct), fontWeight: 600 }}>{getLevel(pct)}</span>
      </div>
      <p style={{ fontSize: 13, color: "#555", marginTop: 6, lineHeight: 1.55 }}>{desc}</p>
    </div>
  );
}

export function ExportPanel({ scores }) {
  const [exported, setExported] = useState({ md: false, html: false });
  const handleMD = () => { const md = generateMarkdown(scores); downloadFile(md, `iq-vysledky_${new Date().toISOString().split("T")[0]}.md`, "text/markdown;charset=utf-8"); setExported(p => ({ ...p, md: true })); };
  const handleHTML = () => { const html = generatePDFHtml(scores); downloadFile(html, `iq-report_${new Date().toISOString().split("T")[0]}.html`, "text/html;charset=utf-8"); setExported(p => ({ ...p, html: true })); };
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 32, border: "2px solid #2D6A9F33", boxShadow: "0 4px 24px rgba(45,106,159,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#2D6A9F15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💾</div>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2D2D", fontWeight: 400, margin: 0 }}>Exportovat výsledky</h2>
      </div>
      <p style={{ fontSize: 13, color: "#999", marginBottom: 24, lineHeight: 1.6 }}>Vizuální report pro archivaci a strukturovaný markdown pro další AI analýzu.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <button onClick={handleHTML} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "24px 16px", background: exported.html ? "#f0fdf4" : "#f4f8fc", border: exported.html ? "2px solid #81B29A" : "2px solid #2D6A9F44", borderRadius: 16, cursor: "pointer", transition: "all 0.25s ease", fontFamily: "'DM Sans'" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: exported.html ? "#81B29A22" : "#2D6A9F12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{exported.html ? "✓" : "📊"}</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: exported.html ? "#81B29A" : "#2D6A9F" }}>{exported.html ? "Staženo!" : "Vizuální report"}</div>
          <div style={{ fontSize: 12, color: "#999", textAlign: "center", lineHeight: 1.5 }}>HTML s grafem a škálami<br /><span style={{ fontSize: 11, color: "#bbb" }}>Otevři → Ctrl+P → ulož PDF</span></div>
        </button>
        <button onClick={handleMD} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "24px 16px", background: exported.md ? "#f0fdf4" : "#f8f6f1", border: exported.md ? "2px solid #81B29A" : "2px solid #E8A83844", borderRadius: 16, cursor: "pointer", transition: "all 0.25s ease", fontFamily: "'DM Sans'" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: exported.md ? "#81B29A22" : "#E8A83812", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{exported.md ? "✓" : "📝"}</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: exported.md ? "#81B29A" : "#E8A838" }}>{exported.md ? "Staženo!" : "Markdown pro AI"}</div>
          <div style={{ fontSize: 12, color: "#999", textAlign: "center", lineHeight: 1.5 }}>Strukturovaný .md soubor<br /><span style={{ fontSize: 11, color: "#bbb" }}>Včetně JSON dat pro AI zpracování</span></div>
        </button>
      </div>
      <div style={{ marginTop: 20, padding: "12px 16px", background: "#f8f6f1", borderRadius: 10, fontSize: 12, color: "#999", lineHeight: 1.6 }}>
        💡 <strong>Tip:</strong> Markdown soubor můžeš rovnou přiložit do nové konverzace s AI jako kontext pro další testy nebo analýzy.
      </div>
    </div>
  );
}
