import { useEffect } from "react"

export const DrumPad = ({ volume, power, sound, setActualSound }) => {
    const handleClick = (e) => {
        if (!power) return
        const audio = document.getElementById(sound.keyTrigger);
        //para que no espere a que termine el audio anterior
        audio.currentTime = 0
        audio.volume = volume
        setActualSound(sound.id)
        audio.play()
    }
    const handleKeyDown = (e) => {
        if (!power) return
        const btn = document.getElementById(sound.id);
        if (e.keyCode === sound.keyCode) {
            btn.classList.replace('text-green-600', 'text-green-400')
            btn.click()
            return setActualSound(sound.id);
        }
        return null
    }
    const handleKeyUp = (e) => {
        const btn = document.getElementById(sound.id);
        if (e.keyCode === sound.keyCode) {
            return btn.classList.replace('text-green-400', 'text-green-600')
        }
        return null
    }
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }
        //eslint-disable-next-line
    }, [])
    return (
        <>
            {/*   //DRUMPAD ELEMENT */}
            <button onClick={handleClick} id={sound.id} className={`rounded-xl drum-pad bg-gray-700 p-10 font-bold text-xl text-green-600 active:text-green-400 shadow-2xl`}>
                {sound.keyTrigger}
                <audio preload='auto' id={`${sound.keyTrigger}`} className='clip bg-red-300 w-1' src={`${sound.url}`}></audio>
            </button>

        </>
    )
}