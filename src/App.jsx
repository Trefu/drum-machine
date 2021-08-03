import { useState } from "react";
import { Display } from "./components/Display";
import { Drumpads } from "./containers/DrumPads";

function App() {
  const [power, setPower] = useState(true);
  const [actualSound, setActualSound] = useState('Nothing');
  const [volume, setVolume] = useState(0.3)
  return (
    <div id='drum-machine' className={` bg-gray-500 min-h-screen flex justify-center items-center  `} >
      <div className={`bg-gray-400 flex p-5 border-4 border-white shadow-2xl `}>
        <Drumpads
          power={power}
          setActualSound={setActualSound}
          volume={volume} />
        <Display
          setVolume={setVolume}
          volume={volume}
          power={power} setPower={setPower}
          actualSound={actualSound} />
      </div>
    </div >

  )
}

export default App;
