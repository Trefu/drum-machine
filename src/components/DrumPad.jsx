
export const DrumPad = ({ sound, colors }) => {
    const handleClick = (e) => {
        const audio = document.getElementById(sound.keyTrigger)
        console.log(audio)
        audio.play()
    }
    return (
        <>
            {/*   //DRUMPAD ELEMENT */}
            <button onClick={handleClick} id={sound.id} className={`drum-pad bg-${colors.yellow}`}>
                {sound.keyTrigger}
                <audio id={`${sound.keyTrigger}`} className='clip bg-red-300 w-1' src={`${sound.url}`}></audio>
            </button>

        </>
    )
}