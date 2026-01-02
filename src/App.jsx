import { useState } from "react";

import "./App.css";
import GameScreen from "./pages/GameScreen";
function App() {
  const [count, setCount] = useState(0);

  return <GameScreen />;
}

export default App;
