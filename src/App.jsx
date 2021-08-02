import { useState } from "react";
import { Display } from "./components/Display";
import { Drumpads } from "./containers/DrumPads";

function App() {
  const [on, setOn] = useState(true);
  const [actualSound, setActualSound] = useState('nothing');
  const colors = {
    green: 'green-300',
    blueStrong: 'blue-400',
    yellowStrong: 'yellow-500',
    blue: 'blue-200',
    yellow: 'yellow-100'

  }



  return (
    <div id='drum-machine' className={`bg-${colors.green} min-h-screen flex justify-center items-center `} >
      <Drumpads colors={colors} setActualSound={setActualSound} />
      <Display colors={colors} actualSound={actualSound} />
    </div >

  )
}

export default App;
