function Keyboard() {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
  ]

  return (
    <div className="flex flex-col gap-2 w-full max-w-lg mx-auto px-2">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1.5 justify-center">
          {rowIdx === 1 && <div className="w-3" />}

          {row.map((key) => (
            <button
              key={key}
              data-key={key.toLowerCase()}
              className={`
                bg-[#818384] hover:bg-[#909294] active:bg-[#707274]
                text-white font-bold
                rounded
                h-14
                flex items-center justify-center
                transition-colors
                touch-manipulation
                ${key === "ENTER" || key === "⌫" ? "px-4 text-xs" : "w-10 text-base"}
              `}
              type="button"
            >
              {key}
            </button>
          ))}

          {rowIdx === 1 && <div className="w-3" />}
        </div>
      ))}
    </div>
  )
}

export default Keyboard
