export const Display = ({ actualSound = 'nothing' }) => {
    return (
        <div id='display' className={`bg-blue-300 text-center`}>
            <div className={`py-1 bg-yellow-200`}>
                <p>Display</p>
            </div>
            <div className={`bg-purple-400 my-auto py-4`}>
                <p> {actualSound}</p>
            </div>
            <div className="volumen-slider h-0.5 flex-col">
                <p>volumen</p>
                <input type="range" />
            </div>
        </div>
    )
}