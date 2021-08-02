import { useState } from "react";
import { Display } from "./components/Display";
import { Drumpads } from "./containers/DrumPads";

function App() {
  const [on, setOn] = useState(true);
  const [actualSound, setActualSound] = useState('nothing');


  return (
    <div id='drum-machine' className={`bg-gray-500 min-h-screen flex justify-center items-center  `} >
      <div className={`bg-gray-400 flex p-5 border-4 border-white shadow-2xl `}>
        <Drumpads setActualSound={setActualSound} />
        <Display actualSound={actualSound} />

      </div>
    </div >

  )
}

export default App;
