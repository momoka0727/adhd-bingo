import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const FREE_INDEX = 12;
const FREE_TASK = "FREE\n你已经很棒了";

const defaultTasks = [
  "起床后喝一杯水",
  "刷牙洗脸",
  "整理床铺",
  "吃早餐",
  "查看今天计划",
  "回复一条重要消息",
  "清理桌面 5 分钟",
  "专注完成一个小任务",
  "站起来活动一下",
  "补充水分",
  "午饭按时吃",
  "FREE\n你已经很棒了",
  "把一个待办写下来",
  "休息 10 分钟",
  "收拾一个小角落",
  "出门前检查钥匙手机钱包",
  "完成一件拖延的事",
  "减少一次分心",
  "散步或拉伸 5 分钟",
  "按时吃晚饭",
  "洗澡",
  "给明天留一个提醒",
  "睡前放下手机 10 分钟",
  "表扬自己一次",
  "准备睡觉",
];

const lines = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

const encouragingMessages = [
  "做得很好，继续保持。",
  "你已经完成一条线了，真的很棒。",
  "一步一步来，你正在前进。",
  "今天的你已经很努力了。",
  "完成得很好，给自己一点肯定。",
];

export default function ADHDDailyBingo() {
  const [tasks, setTasks] = useState(defaultTasks);
  const [editorText, setEditorText] = useState(defaultTasks.filter((_, i) => i !== FREE_INDEX).join("\n"));
  const [completed, setCompleted] = useState(new Set([FREE_INDEX]));
  const [celebrate, setCelebrate] = useState(false);
  const [message, setMessage] = useState("今天也慢慢来，我们一格一格完成。");
  const [completedLines, setCompletedLines] = useState(0);
  const [flashCells, setFlashCells] = useState([]);

  const messageResetRef = useRef(null);
  const celebrateRef = useRef(null);

  const activeLines = useMemo(() => {
    return lines.filter((line) => line.every((i) => completed.has(i)));
  }, [completed]);

  const progress = Math.round(((completed.size - 1) / 24) * 100);

  useEffect(() => {
    if (activeLines.length > completedLines) {
      const newLine = activeLines[activeLines.length - 1] || [];
      const nextMessage = encouragingMessages[activeLines.length % encouragingMessages.length];

      setFlashCells(newLine);
      setCelebrate(true);
      setMessage(nextMessage);
      setCompletedLines(activeLines.length);

      clearTimeout(celebrateRef.current);
      celebrateRef.current = setTimeout(() => {
        setCelebrate(false);
        setFlashCells([]);
      }, 1400);
      return;
    }

    if (activeLines.length < completedLines) {
      setCompletedLines(activeLines.length);
    }
  }, [activeLines, completedLines]);

  useEffect(() => {
    clearTimeout(messageResetRef.current);
    messageResetRef.current = setTimeout(() => {
      setMessage("今天也慢慢来，我们一格一格完成。");
    }, 2400);

    return () => clearTimeout(messageResetRef.current);
  }, [message]);

  useEffect(() => {
    return () => {
      clearTimeout(messageResetRef.current);
      clearTimeout(celebrateRef.current);
    };
  }, []);

  const toggleTask = (index) => {
    if (index === FREE_INDEX) return;

    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
        setMessage("没关系，随时可以重新开始。");
      } else {
        next.add(index);
        setMessage("完成一项了，辛苦啦。");
      }
      return next;
    });
  };

  const applyCustomTasks = () => {
    const raw = editorText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (raw.length < 24) {
      setMessage(`请至少输入 24 条任务，现在是 ${raw.length} 条。`);
      return;
    }

    const next = [...raw.slice(0, 12), FREE_TASK, ...raw.slice(12, 24)];
    setTasks(next);
    setCompleted(new Set([FREE_INDEX]));
    setCompletedLines(0);
    setFlashCells([]);
    setCelebrate(false);
    setMessage("新的今日 Bingo 已经生成。");
  };

  const resetToday = () => {
    setCompleted(new Set([FREE_INDEX]));
    setCompletedLines(0);
    setFlashCells([]);
    setCelebrate(false);
    setMessage("已重置，今天重新开始也很好。");
  };

  const restoreDefaultEditor = () => {
    setEditorText(defaultTasks.filter((_, i) => i !== FREE_INDEX).join("\n"));
    setMessage("已恢复默认示例任务。");
  };

  const validTaskCount = editorText
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean).length;

  return (
    <main className="page">
      <section className="hero-layout">
        <article className="panel hero-panel">
          <p className="eyebrow">Daily Support Bingo</p>
          <h1>ADHD Daily Bingo</h1>
          <p className="intro">把今天要做的事情放进 5×5 表格里。完成一项就点亮一格，连成一条线时给自己一点鼓励。</p>

          <div className="stats-grid">
            <div className="stat-card stat-progress">
              <h2>完成度</h2>
              <div className="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
                <span style={{ width: `${progress}%` }} />
              </div>
              <strong>{progress}%</strong>
            </div>

            <div className="stat-card stat-done">
              <h2>已完成格子</h2>
              <strong>{completed.size - 1}</strong>
            </div>

            <div className="stat-card stat-lines">
              <h2>连线数</h2>
              <strong>{activeLines.length}</strong>
            </div>
          </div>

          <div className={`message-banner ${celebrate ? "is-celebrating" : ""}`}>
            {celebrate && (
              <div className="confetti-layer" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} style={{ left: `${8 + i * 7}%`, animationDelay: `${i * 0.03}s` }}>
                    ✨
                  </span>
                ))}
              </div>
            )}
            <span>{message}</span>
          </div>

          <div className="actions">
            <button type="button" className="btn btn-dark" onClick={resetToday}>
              重置今日进度
            </button>
            <button type="button" className="btn btn-light" onClick={restoreDefaultEditor}>
              恢复默认任务
            </button>
          </div>
        </article>

        <aside className="panel editor-panel">
          <div className="editor-head">
            <div>
              <h2>自定义任务</h2>
              <p>每行输入一项任务。输入 24 条后会自动放入中间的 FREE 格，生成 5×5 表格。</p>
            </div>
            <button type="button" className="btn btn-gradient" onClick={applyCustomTasks}>
              生成表格
            </button>
          </div>

          <label className="sr-only" htmlFor="task-editor">
            任务编辑器
          </label>
          <textarea
            id="task-editor"
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
            placeholder="每行输入一个今天要做的任务"
          />

          <p className="editor-count">当前有效任务数：{validTaskCount}</p>
        </aside>
      </section>

      <section className="panel board-panel">
        <div className="board-grid">
          {tasks.map((task, index) => {
            const isCompleted = completed.has(index);
            const isFree = index === FREE_INDEX;
            const isHighlighted = flashCells.includes(index);

            return (
              <button
                key={index}
                type="button"
                onClick={() => toggleTask(index)}
                className={`cell ${isCompleted ? "is-completed" : ""} ${isFree ? "is-free" : ""} ${
                  isHighlighted ? "is-highlighted" : ""
                }`}
                aria-pressed={isCompleted}
                aria-label={isFree ? "FREE 格" : `任务 ${index + 1}: ${task}`}
              >
                <span className="cell-index">{isFree ? "FREE" : index + 1}</span>
                <span className="cell-text">{task}</span>

                {isCompleted && !isFree && <span className="cell-check">✓</span>}
                {isFree && <span className="cell-free-tip">KEEP GOING</span>}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
