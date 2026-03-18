import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DIMS, DIM_ORDER, SECTIONS, PRACTICE_TASKS,
         LOGIC_TASKS, VERBAL_TASKS, NUMERICAL_TASKS,
         SPATIAL_TASKS, MEMORY_TASKS } from './iqData';
import { calculateIqScores, getLevel } from './iqScoring';
import {
  LogicTaskRenderer, VerbalTaskRenderer, NumericalTaskRenderer,
  SpatialTaskRenderer, MemoryTaskRenderer, SpeedTaskRenderer,
  PracticeFeedback, SpeedPracticeRenderer,
  DimensionBar, ExportPanel
} from './iqComponents';
import RadarChart from '../../components/RadarChart';
import { saveResults } from '../../lib/storage';
import { useResults } from '../../context/ResultsContext';

const allTasks = { LOGIC: LOGIC_TASKS, VERBAL: VERBAL_TASKS, NUMERICAL: NUMERICAL_TASKS, SPATIAL: SPATIAL_TASKS, MEMORY: MEMORY_TASKS };
const totalTasks = SECTIONS.reduce((sum, s) => sum + s.taskCount, 0);

export default function IqTest() {
  const navigate = useNavigate();
  const { saveTestResult } = useResults();
  const [phase, setPhase] = useState("intro");
  const [sectionIdx, setSectionIdx] = useState(0);
  const [taskIdx, setTaskIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState(null);
  const [startTimes, setStartTimes] = useState({});
  const [animating, setAnimating] = useState(false);
  const [practiceResult, setPracticeResult] = useState(null);

  const currentSection = SECTIONS[sectionIdx];
  const currentDim = currentSection?.dim;
  const taskList = allTasks[currentDim] || [];

  const completedTasks = SECTIONS.slice(0, sectionIdx).reduce((sum, s) => sum + s.taskCount, 0) + (phase === "task" ? taskIdx : 0);
  const progress = (completedTasks / totalTasks) * 100;

  const startTest = () => { setPhase("sectionIntro"); setSectionIdx(0); setTaskIdx(0); setAnswers({}); setPracticeResult(null); };

  const startPractice = () => {
    setPracticeResult(null);
    setPhase("practice");
  };

  const finishPractice = () => {
    setPhase("task");
    setTaskIdx(0);
    setStartTimes(p => ({ ...p, [`${sectionIdx}-0`]: Date.now() }));
  };

  const handlePracticeAnswer = useCallback((answerIdx) => {
    const practiceTask = PRACTICE_TASKS[currentDim];
    const isCorrect = answerIdx === practiceTask.correct;
    setPracticeResult({ correct: isCorrect, task: practiceTask });
  }, [currentDim]);

  const handleAnswer = useCallback((answerIdx) => {
    if (animating) return;
    setAnimating(true);
    const key = `${currentDim}-${taskIdx}`;
    const elapsed = Date.now() - (startTimes[`${sectionIdx}-${taskIdx}`] || Date.now());
    const newAnswers = { ...answers, [key]: { answer: answerIdx, time: elapsed } };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (taskIdx + 1 >= taskList.length) {
        if (sectionIdx + 1 >= SECTIONS.length) {
          const result = calculateIqScores(newAnswers, allTasks);
          setScores(result);
          const payload = { scores: result, date: new Date().toISOString() };
          saveResults('IQ', payload);
          saveTestResult('IQ', payload);
          setPhase("results");
        } else {
          setSectionIdx(sectionIdx + 1);
          setTaskIdx(0);
          setPracticeResult(null);
          setPhase("sectionIntro");
        }
      } else {
        setTaskIdx(taskIdx + 1);
        setStartTimes(p => ({ ...p, [`${sectionIdx}-${taskIdx + 1}`]: Date.now() }));
      }
      setAnimating(false);
    }, 350);
  }, [animating, currentDim, taskIdx, sectionIdx, taskList.length, answers, startTimes]);

  const handleSpeedComplete = (result) => {
    const newAnswers = { ...answers, SPEED_RESULT: result };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (sectionIdx + 1 >= SECTIONS.length) {
        const scored = calculateIqScores(newAnswers, allTasks);
        setScores(scored);
        const payload = { scores: scored, date: new Date().toISOString() };
        saveResults('IQ', payload);
        saveTestResult('IQ', payload);
        setPhase("results");
      } else {
        setSectionIdx(sectionIdx + 1);
        setTaskIdx(0);
        setPracticeResult(null);
        setPhase("sectionIntro");
      }
    }, 1500);
  };

  const bg = "#FDFBF7";

  const backButton = phase !== "intro" && (
    <button onClick={() => navigate('/')} style={{
      position: 'fixed', top: 16, left: 16, zIndex: 20,
      background: '#fff', border: '1px solid #ebe8e2', borderRadius: 8,
      padding: '8px 14px', fontSize: 13, color: '#999', cursor: 'pointer',
      fontFamily: "'DM Sans'", boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      ← Menu
    </button>
  );

  // ─── INTRO ───
  if (phase === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16, color: "#2D6A9F" }}>◈</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "#2D2D2D", marginBottom: 12, fontWeight: 400, lineHeight: 1.2 }}>
            Kognitivní profil
          </h1>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#888", marginBottom: 32, fontWeight: 400 }}>
            IQ Assessment — 6 dimenzí
          </p>
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", textAlign: "left", marginBottom: 32, border: "1px solid #ebe8e2", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 16 }}>
              Test mapuje tvůj kognitivní profil v <strong>6 oblastech</strong> — logika, verbální schopnosti, numerika, prostorová představivost, pracovní paměť a rychlost zpracování.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", fontSize: 14, color: "#777" }}>
              <div>⏱ ~20 minut</div>
              <div>🧩 {totalTasks} úloh</div>
              <div>🎯 6 typů úloh</div>
              <div>📥 Export výsledků</div>
            </div>
            <div style={{ marginTop: 20, padding: "14px 16px", background: "#f4f8fc", borderRadius: 10, fontSize: 13, color: "#888", lineHeight: 1.6, borderLeft: "3px solid #2D6A9F44" }}>
              <strong>Pozor:</strong> Na rozdíl od osobnostních testů zde existují správné a špatné odpovědi. Výsledek ukazuje tvůj <em>relativní kognitivní profil</em> — silné a slabší oblasti. Nejde o absolutní IQ číslo.
            </div>
            <div style={{ marginTop: 12, padding: "14px 16px", background: "#f8f6f1", borderRadius: 10, fontSize: 13, color: "#888", lineHeight: 1.6 }}>
              💡 Test je rozdělen do 6 sekcí. Každá sekce začíná krátkým tréninkovým příkladem se zpětnou vazbou.
            </div>
          </div>
          <button onClick={startTest}
            style={{ background: "#2D6A9F", color: "#fff", border: "none", borderRadius: 12, padding: "16px 48px", fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'", boxShadow: "0 4px 16px rgba(45,106,159,0.35)", transition: "all 0.2s" }}
            onMouseOver={e => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={e => e.target.style.transform = "translateY(0)"}>
            Začít test →
          </button>
        </div>
      </div>
    );
  }

  // ─── SECTION INTRO ───
  if (phase === "sectionIntro") {
    const sec = SECTIONS[sectionIdx];
    const dim = DIMS[sec.dim];
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans'" }}>
        {backButton}
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#999", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16, fontFamily: "'DM Mono'" }}>
            Sekce {sectionIdx + 1} / {SECTIONS.length}
          </div>
          <div style={{ fontSize: 48, marginBottom: 12, color: dim.color }}>{sec.icon}</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#2D2D2D", fontWeight: 400, marginBottom: 8 }}>{sec.title}</h2>
          <p style={{ fontSize: 15, color: "#888", marginBottom: 24 }}>{sec.subtitle}</p>
          <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", marginBottom: 28, border: `1px solid ${dim.color}22`, textAlign: "left" }}>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{sec.instructions}</p>
            <div style={{ marginTop: 12, fontSize: 13, color: "#999" }}>
              📋 {sec.taskCount} úloh{sec.dim === "SPEED" ? " • ⏱ časový limit 30 sekund" : sec.dim === "MEMORY" ? " • ⏱ zapamatuj si sekvenci" : " • rostoucí obtížnost"} • 1 tréninkový příklad
            </div>
          </div>
          <button onClick={startPractice}
            style={{ background: dim.color, color: "#fff", border: "none", borderRadius: 10, padding: "14px 40px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", boxShadow: `0 4px 12px ${dim.color}44`, transition: "all 0.2s" }}
            onMouseOver={e => e.target.style.transform = "translateY(-1px)"}
            onMouseOut={e => e.target.style.transform = "translateY(0)"}>
            Začít sekci →
          </button>
        </div>
      </div>
    );
  }

  // ─── PRACTICE ───
  if (phase === "practice") {
    const practiceTask = PRACTICE_TASKS[currentDim];
    const dim = DIMS[currentDim];

    if (practiceResult) {
      return (
        <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans'" }}>
          {backButton}
          <PracticeFeedback
            correct={practiceResult.correct}
            explanation={practiceTask.explanation}
            wrongExplanation={practiceTask.wrongExplanation}
            onContinue={finishPractice}
          />
        </div>
      );
    }

    if (currentDim === "SPEED") {
      return (
        <div style={{ minHeight: "100vh", background: bg, fontFamily: "'DM Sans'", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          {backButton}
          <div style={{ maxWidth: 480, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: "#999", fontFamily: "'DM Mono'", textTransform: "uppercase", letterSpacing: 2 }}>Trénink — {dim.name}</span>
            </div>
            <SpeedPracticeRenderer onComplete={finishPractice} />
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "'DM Sans'", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        {backButton}
        <div style={{ maxWidth: 580, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#E8A838", fontWeight: 700, background: "#fdf5e6", padding: "5px 14px", borderRadius: 20, border: "1px solid #E8A83833", textTransform: "uppercase", letterSpacing: 1 }}>
              🎯 Tréninkový příklad
            </span>
          </div>
          {currentDim === "LOGIC" && <LogicTaskRenderer task={practiceTask} onAnswer={handlePracticeAnswer} key="practice-logic" />}
          {currentDim === "VERBAL" && <VerbalTaskRenderer task={practiceTask} onAnswer={handlePracticeAnswer} key="practice-verbal" />}
          {currentDim === "NUMERICAL" && <NumericalTaskRenderer task={practiceTask} onAnswer={handlePracticeAnswer} key="practice-numerical" />}
          {currentDim === "SPATIAL" && <SpatialTaskRenderer task={practiceTask} onAnswer={handlePracticeAnswer} key="practice-spatial" />}
          {currentDim === "MEMORY" && <MemoryTaskRenderer task={practiceTask} onAnswer={handlePracticeAnswer} key="practice-memory" />}
        </div>
      </div>
    );
  }

  // ─── TASK ───
  if (phase === "task") {
    const dim = DIMS[currentDim];
    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "'DM Sans'", display: "flex", flexDirection: "column" }}>
        {backButton}
        <div style={{ position: "sticky", top: 0, zIndex: 10, background: bg, borderBottom: "1px solid #ebe8e2" }}>
          <div style={{ height: 4, background: "#f0ede8" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #2D6A9F, #5BA4D9)", transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px" }}>
            <span style={{ fontSize: 13, color: "#999", fontFamily: "'DM Mono'" }}>{completedTasks + (currentDim !== "SPEED" ? taskIdx + 1 : 0)} / {totalTasks}</span>
            <span style={{ fontSize: 12, color: dim.color, fontWeight: 600, background: dim.colorLight, padding: "4px 12px", borderRadius: 20 }}>
              {dim.icon} {dim.name} ({currentDim !== "SPEED" ? `${taskIdx + 1}/${taskList.length}` : "⏱"})
            </span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
          <div style={{ maxWidth: 580, width: "100%", opacity: animating ? 0.3 : 1, transform: animating ? "translateY(8px)" : "translateY(0)", transition: "all 0.3s ease" }}>
            {currentDim === "LOGIC" && <LogicTaskRenderer task={taskList[taskIdx]} onAnswer={handleAnswer} key={`${sectionIdx}-${taskIdx}`} />}
            {currentDim === "VERBAL" && <VerbalTaskRenderer task={taskList[taskIdx]} onAnswer={handleAnswer} key={`${sectionIdx}-${taskIdx}`} />}
            {currentDim === "NUMERICAL" && <NumericalTaskRenderer task={taskList[taskIdx]} onAnswer={handleAnswer} key={`${sectionIdx}-${taskIdx}`} />}
            {currentDim === "SPATIAL" && <SpatialTaskRenderer task={taskList[taskIdx]} onAnswer={handleAnswer} key={`${sectionIdx}-${taskIdx}`} />}
            {currentDim === "MEMORY" && <MemoryTaskRenderer task={taskList[taskIdx]} onAnswer={handleAnswer} key={`${sectionIdx}-${taskIdx}`} />}
            {currentDim === "SPEED" && <SpeedTaskRenderer onComplete={handleSpeedComplete} key={sectionIdx} />}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS ───
  if (phase === "results" && scores) {
    const sorted = [...DIM_ORDER].sort((a, b) => scores[b] - scores[a]);
    const top = sorted[0], low = sorted[sorted.length - 1];
    const avgScore = DIM_ORDER.reduce((sum, d) => sum + scores[d], 0) / DIM_ORDER.length;

    return (
      <div style={{ minHeight: "100vh", background: bg, fontFamily: "'DM Sans'", padding: "40px 24px" }}>
        {backButton}
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 14, color: "#999", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Mono'" }}>Výsledky</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "#2D2D2D", fontWeight: 400, marginBottom: 8 }}>Tvůj kognitivní profil</h1>
            <p style={{ color: "#999", fontSize: 14 }}>Na základě {totalTasks} kognitivních úloh v 6 dimenzích</p>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: 32, marginBottom: 32, border: "1px solid #ebe8e2", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <RadarChart scores={scores} dimensions={DIMS} />
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 32, border: "1px solid #ebe8e2", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2D2D", fontWeight: 400, marginBottom: 20 }}>Rychlý přehled</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: DIMS[top].colorLight, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>Nejsilnější</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: DIMS[top].color }}>{DIMS[top].icon} {DIMS[top].name}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: DIMS[top].color, fontFamily: "'DM Mono'" }}>{Math.round(scores[top])}%</div>
              </div>
              <div style={{ background: "#f8f6f1", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>Průměr</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#E8A838" }}>∅</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#E8A838", fontFamily: "'DM Mono'" }}>{Math.round(avgScore)}%</div>
              </div>
              <div style={{ background: DIMS[low].colorLight, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>Nejnižší</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: DIMS[low].color }}>{DIMS[low].icon} {DIMS[low].name}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: DIMS[low].color, fontFamily: "'DM Mono'" }}>{Math.round(scores[low])}%</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {sorted.map(d => (
                <span key={d} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: DIMS[d].colorLight, border: `1px solid ${DIMS[d].color}33`, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 600, color: DIMS[d].color }}>
                  {DIMS[d].icon} {DIMS[d].name}: {getLevel(scores[d])}
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 32, border: "1px solid #ebe8e2", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2D2D", fontWeight: 400, marginBottom: 24 }}>Detailní profil</h2>
            {DIM_ORDER.map(d => <DimensionBar key={d} dimKey={d} score={scores[d]} />)}
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", marginBottom: 32, border: "1px solid #ebe8e2", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2D2D", fontWeight: 400, marginBottom: 20 }}>Co to znamená v praxi</h2>
            <div style={{ fontSize: 14, color: "#555", lineHeight: 1.75 }}>
              <p style={{ marginBottom: 16 }}>
                <strong>Kognitivní styl:</strong> Tvůj profil ukazuje, že nejsilněji se opíráš o <strong>{DIMS[top].name.toLowerCase()}</strong>{sorted[1] && scores[sorted[1]] > 55 ? ` a ${DIMS[sorted[1]].name.toLowerCase()}` : ""}. {scores[top] >= 75 ? "To je výrazná kognitivní přednost, kterou můžeš využít jako competitive advantage." : "To jsou oblasti, kde se cítíš nejjistěji."}
              </p>
              <p style={{ marginBottom: 16 }}>
                <strong>Oblasti pro rozvoj:</strong> {scores[low] < 40 ? `Oblast "${DIMS[low].name}" je tvým relativně slabším místem. Neznamená to deficit — spíše to, že tvůj mozek preferuje jiné strategie řešení.` : "Tvůj profil je relativně vyrovnaný, bez výrazných slabých míst."}
              </p>
              <p>
                <strong>Doporučení:</strong> {avgScore >= 65 ? "Celkově nadprůměrný profil naznačuje vysoký kognitivní potenciál. Zaměř se na oblasti, které tě baví a kde excelujete." : avgScore >= 40 ? "Solidní kognitivní základ. Cílený trénink v slabších oblastech může výrazně posílit celkový profil." : "Kognitivní trénink a pravidelná praxe mohou výrazně zlepšit výkon ve všech oblastech."}
              </p>
            </div>
          </div>

          <ExportPanel scores={scores} />

          <div style={{ textAlign: "center", marginBottom: 32, padding: "20px 24px", background: "#f8f6f1", borderRadius: 16 }}>
            <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>
              ⚠️ Orientační výkonový test — 44 kognitivních úloh v 6 oblastech. Výsledky ukazují relativní kognitivní profil, nikoli absolutní IQ. Nenahrazuje standardizovaný psychologický test.
            </p>
          </div>

          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <button onClick={() => { setPhase("intro"); setScores(null); setAnswers({}); }}
              style={{ background: "transparent", color: "#999", border: "1px solid #ddd", borderRadius: 10, padding: "12px 32px", fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans'", transition: "all 0.2s" }}
              onMouseOver={e => { e.target.style.borderColor = "#2D6A9F"; e.target.style.color = "#2D6A9F"; }}
              onMouseOut={e => { e.target.style.borderColor = "#ddd"; e.target.style.color = "#999"; }}>
              ↺ Zopakovat test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
