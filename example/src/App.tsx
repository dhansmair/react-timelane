import { MyComponent, sayHello } from "react-timeline-calendar";
import "./App.css";

function App() {
  sayHello();

  return (
    <>
      <h1>Vite + React</h1>
      <MyComponent title="my title" />
    </>
  );
}

export default App;
