import { useEffect, useMemo, useState } from "react";
import Keyboard from "../components/Keyboard";

// 5-letter word list (you can expand this later)
const WORDS = [
  "crane",
  "slate",
  "stare",
  "trace",
  "adieu",
  "audio",
  "train",
  "cigar",
  "rebut",
  "sissy",
  "humph",
  "awake",
  "blush",
  "focal",
  "evade",
  "naval",
  "serve",
  "heath",
  "dwarf",
  "model",
];

const MAX_ROWS = 6;
const WORD_LEN = 5;

const rank = { absent: 0, present: 1, correct: 2 };
const clampKeyStatus = (prev, next) => (rank[next] > rank[prev] ? next : prev);

function evaluateGuess(guess, answer) {
  const g = guess.split("");
  const a = answer.split("");

  const result = Array(WORD_LEN).fill("absent");
  const counts = {};

  for (let i = 0; i < WORD_LEN; i++) {
    counts[a[i]] = (counts[a[i]] || 0) + 1;
  }

  // correct pass
  for (let i = 0; i < WORD_LEN; i++) {
    if (g[i] === a[i]) {
      result[i] = "correct";
      counts[g[i]] -= 1;
    }
  }

  // present pass
  for (let i = 0; i < WORD_LEN; i++) {
    if (result[i] === "correct") continue;
    if (counts[g[i]] > 0) {
      result[i] = "present";
      counts[g[i]] -= 1;
    }
  }

  return result;
}

function tileClass(status, isActiveRow, hasLetter) {
  if (status === "correct") return "bg-green-600 border-green-600 text-white";
  if (status === "present") return "bg-yellow-600 border-yellow-600 text-white";
  if (status === "absent")
    return "bg-neutral-700 border-neutral-700 text-white";

  // not submitted yet
  if (hasLetter) return "bg-transparent border-neutral-800 text-neutral-900";
  if (isActiveRow) return "bg-transparent border-neutral-800 text-neutral-900";
  return "bg-transparent border-[#3a3a3c] text-neutral-900";
}

export default function GameScreen() {
  const answer = useMemo(() => {
    const pick = WORDS[Math.floor(Math.random() * WORDS.length)];
    return pick.toUpperCase();
  }, []);

  const [guesses, setGuesses] = useState(Array(MAX_ROWS).fill(""));
  const [scores, setScores] = useState(Array(MAX_ROWS).fill(null));
  const [row, setRow] = useState(0);
  const [message, setMessage] = useState("");
  const [isOver, setIsOver] = useState(false);
  const [keyStatus, setKeyStatus] = useState({});

  const allowed = useMemo(() => new Set(WORDS.map((w) => w.toLowerCase())), []);

  const showMessage = (m) => {
    setMessage(m);
    window.clearTimeout(showMessage._t);
    showMessage._t = window.setTimeout(() => setMessage(""), 1500);
  };

  const submitGuess = () => {
    const current = guesses[row];

    if (current.length !== WORD_LEN) {
      showMessage("Not enough letters");
      return;
    }

    if (!allowed.has(current.toLowerCase())) {
      showMessage("Not in word list");
      return;
    }

    const guessUpper = current.toUpperCase();
    const res = evaluateGuess(guessUpper, answer);

    setScores((prev) => {
      const next = [...prev];
      next[row] = res;
      return next;
    });

    setKeyStatus((prev) => {
      const next = { ...prev };
      for (let i = 0; i < WORD_LEN; i++) {
        const ch = guessUpper[i].toLowerCase();
        const s = res[i];
        if (!next[ch]) next[ch] = s;
        else next[ch] = clampKeyStatus(next[ch], s);
      }
      return next;
    });

    if (guessUpper === answer) {
      setIsOver(true);
      showMessage("You got it!");
      return;
    }

    if (row === MAX_ROWS - 1) {
      setIsOver(true);
      showMessage(`Answer: ${answer}`);
      return;
    }

    setRow((r) => r + 1);
  };

  const handleKey = (k) => {
    if (isOver) return;

    if (k === "enter") return submitGuess();

    if (k === "backspace" || k === "del") {
      setGuesses((prev) => {
        const next = [...prev];
        next[row] = next[row].slice(0, -1);
        return next;
      });
      return;
    }

    if (/^[a-z]$/.test(k)) {
      setGuesses((prev) => {
        const next = [...prev];
        if (next[row].length >= WORD_LEN) return next;
        next[row] = next[row] + k.toUpperCase();
        return next;
      });
    }
  };

  // physical keyboard
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Enter") return handleKey("enter");
      if (e.key === "Backspace") return handleKey("backspace");

      const lower = e.key.toLowerCase();
      if (/^[a-z]$/.test(lower)) handleKey(lower);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row, isOver, guesses]);

  return (
    <section className="bg-[#fbf6ea] relative min-h-screen flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold tracking-widest text-neutral-900">
            WORD GAME
          </h1>
          <button
            type="button"
            className="text-sm px-3 py-1 rounded bg-neutral-900 text-white hover:bg-neutral-800"
            onClick={() => window.location.reload()}
          >
            New
          </button>
        </div>

        {/* Board: 6 rows x 5 cols = 30 */}
        <div className="mb-6 grid gap-1.5 w-fit mx-auto">
          {Array.from({ length: MAX_ROWS }).map((_, r) => {
            const word = (guesses[r] || "").padEnd(WORD_LEN, " ");
            const res = scores[r];
            return (
              <div key={r} className="grid grid-cols-5 gap-1.5 w-fit mx-auto">
                {Array.from({ length: WORD_LEN }).map((__, c) => {
                  const ch = word[c] === " " ? "" : word[c];
                  const status = res ? res[c] : null;
                  const isActiveRow = r === row && !scores[r] && !isOver;
                  const hasLetter = Boolean(ch);

                  return (
                    <div
                      key={c}
                      className={`w-14 h-14 border-2 rounded flex items-center justify-center font-bold text-lg ${tileClass(
                        status,
                        isActiveRow,
                        hasLetter
                      )}`}
                    >
                      {ch}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Message */}
        {message && (
          <div className="w-fit mx-auto mb-4 px-4 py-2 rounded bg-neutral-900 text-white text-sm font-medium">
            {message}
          </div>
        )}

        {/* Keyboard */}
        <Keyboard onKey={handleKey} keyStatus={keyStatus} />
      </div>
    </section>
  );
}
