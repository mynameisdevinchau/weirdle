function Keyboard() {
  const rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "del"],
  ];

  const baseBtn =
    "bg-gray-500 border border-1 text-white px-3 py-2 rounded";

  const labelFor = (key) => {
    if (key === "enter") return "Enter";
    if (key === "del") return "Del";
    return key;
  };

  return (
    <div id="keyboard-container">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="text-white flex gap-2 mb-2">
          {row.map((key) => (
            <button
              key={key}
              data-key={key}
              className={baseBtn}
              type="button"
            >
              {labelFor(key)}
            </button>
          ))}

          {rowIdx === 1 && <div className="spacer-half" />}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
