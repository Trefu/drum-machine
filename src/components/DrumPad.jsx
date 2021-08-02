import { useEffect } from "react"

export const DrumPad = ({ sound, colors, setActualSound }) => {

    const handleClick = (e) => {
        const audio = document.getElementById(sound.keyTrigger);
        setActualSound(sound.id)
        audio.play()
    }
    const handleKeyDown = (e) => {
        const audio = document.getElementById(sound.keyTrigger);
        if (e.keyCode === sound.keyCode) {
            audio.play();
            setActualSound(sound.id);
        }

        return console.log('not coincidence');
    }
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            console.log('limpiando');
            document.removeEventListener('keydown', handleKeyDown)
        }
    })
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