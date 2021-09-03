export const Display = ({ volume, setVolume, power, setPower, actualSound }) => {
    const handleRangeChange = (e) => {
        setVolume(e.target.value)
    }
    const handleChange = (e) => {
        setPower(!power)
    }
    return (
        <div id='display' className={`w-1/4  flex flex-col justify-between space-y-4 bg-gray-400 text-center text-green-400 font-bold `}>
            <div className={`bg-gray-500 py-4 rounded-lg`}>
                <p> {actualSound}</p>
            </div>
            <div className={`flex justify-center bg-gray-500 py-2  mt-4 rounded-lg`}>
                <div className='rounded-lg  flex flex-col justify-center items-center bg-gray-400 text-white'>
                    <p>OFF / ON</p>
                    <label className="switch transform scale-75 md:scale-100">
                        <input checked={power} type="checkbox" onChange={handleChange} />
                        <span className='slider '></span>
                    </label>
                </div>

            </div>
            <div className="volumen-slider p-1  mt-auto rounded-lg bg-gray-500  ">
                <p>Volumen</p>
                <input className='w-14 md:w-28' max='1' min='0' step='0.1' type="range" value={volume} onChange={handleRangeChange} />
            </div>
        </div>
    )
}