import { useEffect, useState } from "react";
import { Display } from "./components/Display";
import { Drumpads } from "./containers/DrumPads";

function App() {
  const [on, setOn] = useState(true)
  const colors = {
    green: 'green-300',
    blueStrong: 'blue-400',
    yellowStrong: 'yellow-500',
    blue: 'blue-200',
    yellow: 'yellow-100'

  }
  const handleKeyDown = (e) => {
    console.log(e.keyCode)
  }
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      console.log('limpiando');
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <div id='drum-machine' className={`bg-${colors.green} min-h-screen flex justify-center items-center `} >
      <Drumpads colors={colors} />
      <Display colors={colors} />
    </div >

  )
}

export default App;
