import logo from "./logo.svg";
import "./App.css";
import Timer from "./components/Timer";
import Header from "./components/Header";
import Todo from "./components/Todoli";

function App() {
  // let i = 1;
  // if (i == 1) {
  //   return <Todo></Todo>
  // }
  return (
    <div>
      <main>
        <Header />
        <Timer />
        {/* <div>HUI</div>
        <Todo /> */}
      </main>
    </div>
  );
}

export default App;
