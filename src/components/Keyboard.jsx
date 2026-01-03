function Keyboard({ onKey, keyStatus = {} }) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ];

  const statusToClass = (k) => {
    const key = k.toLowerCase();
    const s = keyStatus[key];
    if (s === "correct") return "bg-green-600 hover:bg-green-600";
    if (s === "present") return "bg-yellow-600 hover:bg-yellow-600";
    if (s === "absent") return "bg-neutral-700 hover:bg-neutral-700";
    return "bg-[#818384] hover:bg-[#909294] active:bg-[#707274]";
  };

  const normalizeKey = (k) => {
    if (k === "ENTER") return "enter";
    if (k === "⌫") return "backspace";
    return k.toLowerCase();
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-lg mx-auto px-2 select-none">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1.5 justify-center">
          {rowIdx === 1 && <div className="w-3" />}

          {row.map((k) => {
            const norm = normalizeKey(k);
            return (
              <button
                key={k}
                data-key={norm}
                type="button"
                onClick={() => onKey(norm)}
                className={`
                  ${statusToClass(k)}
                  text-white font-bold
                  rounded
                  h-14
                  flex items-center justify-center
                  transition-colors
                  touch-manipulation
                  ${k === "ENTER" || k === "⌫" ? "px-4 text-xs" : "w-10 text-base"}
                `}
              >
                {k}
              </button>
            );
          })}

          {rowIdx === 1 && <div className="w-3" />}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
