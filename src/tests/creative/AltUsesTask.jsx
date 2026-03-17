import { useState, useEffect } from 'react';

export default function AltUsesTask({ items, onComplete, accentColor = '#FF6B6B', secondaryColor = '#4ECDC4' }) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(items[0]?.timeLimit ?? 60);
  const [timerRunning, setTimerRunning] = useState(true);
  const [text, setText] = useState('');
  const [answers, setAnswers] = useState({});

  const currentItem = items[currentItemIndex];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const ideaCount = lines.length;
  const canFinish = ideaCount >= 2;

  useEffect(() => {
    if (!timerRunning || !currentItem) return;
    if (timeLeft <= 0) {
      const id = currentItem.id;
      const nextAnswers = { ...answers, [id]: text };
      setAnswers(nextAnswers);
      setText('');
      if (currentItemIndex + 1 >= items.length) {
        setTimerRunning(false);
        onComplete(nextAnswers);
      } else {
        setCurrentItemIndex(prev => prev + 1);
        const next = items[currentItemIndex + 1];
        setTimeLeft(next?.timeLimit ?? 60);
        setTimerRunning(true);
      }
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timerRunning, timeLeft, currentItem, currentItemIndex, items.length, text, answers, onComplete]);

  const handleDone = () => {
    if (!currentItem) return;
    const id = currentItem.id;
    const nextAnswers = { ...answers, [id]: text };
    setAnswers(nextAnswers);
    setText('');
    if (currentItemIndex + 1 >= items.length) {
      onComplete(nextAnswers);
    } else {
      setCurrentItemIndex(prev => prev + 1);
      const next = items[currentItemIndex + 1];
      setTimeLeft(next?.timeLimit ?? 60);
      setTimerRunning(true);
    }
  };

  if (!currentItem) return null;

  const timerColor = timeLeft > 30 ? '#22c55e' : timeLeft > 10 ? '#f97316' : '#dc2626';

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col px-6 py-8">
      <div className="max-w-[720px] mx-auto w-full flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <span className="font-mono text-[13px] text-[#999]">
            Kreativní úloha {currentItemIndex + 1}/{items.length}
          </span>
          <span
            className="font-mono text-[32px] font-medium tabular-nums"
            style={{ color: timerColor }}
          >
            ⏱ {timeLeft}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#ebe8e2] shadow-sm p-6 sm:p-8 flex-1 flex flex-col">
          <h2
            className="font-serif-display text-[28px] font-normal text-[#2D2D2D] mb-2"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {currentItem.label}
          </h2>
          <p className="text-[15px] text-[#555] leading-relaxed mb-6">
            {currentItem.instruction}
          </p>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Jeden nápad na řádek..."
            className="w-full min-h-[200px] rounded-xl border border-[#ddd] p-4 text-[14px] resize-y focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              '--tw-ring-color': accentColor
            }}
            aria-label="Nápady"
          />

          <div className="flex justify-between items-center mt-4">
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
            >
              {ideaCount} nápadů
            </span>
            <button
              type="button"
              onClick={handleDone}
              disabled={!canFinish}
              className="border-none rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: canFinish ? accentColor : '#ccc',
                cursor: canFinish ? 'pointer' : 'not-allowed',
                boxShadow: canFinish ? `0 4px 12px ${accentColor}44` : 'none'
              }}
              onMouseOver={e => {
                if (canFinish) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${accentColor}55`;
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = canFinish ? `0 4px 12px ${accentColor}44` : 'none';
              }}
            >
              Hotovo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
