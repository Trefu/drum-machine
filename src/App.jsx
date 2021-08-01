import { useState } from "react";

function App() {
  const [on, setOn] = useState(true)
  const colors = {
    green: 'green-300',
    blueStrong: 'blue-400',
    yellowStrong: 'yellow-500',
    blue: 'blue-200',
    yellow: 'yellow-100'

  }
  return (
    <div className={`bg-${colors.green} min-h-screen flex justify-center items-center `} >
      <h1>buenas</h1>
      <h1>buenas</h1>
      <h1>buenas</h1>
    </div>
  );
}

export default App;
