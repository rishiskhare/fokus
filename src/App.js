import logo from "./logo.svg";
import "./App.css";
import Timer from "./components/Timer";
import Header from "./components/Header";
import Todo from "./components/Todoli";
import { useState } from "react";

function App() {
  const [view, setView] = useState(0);

  const toggleView = (v) => {
    if (v === 0) {
      setView(1);
    } else {
      setView(0);
    }
  };

  return (
    <div>
      <main>
        <Header toggleView={() => toggleView(view)} />
        {view === 0 ? <Timer /> : <Todo />}
      </main>
    </div>
  );
}

export default App;
