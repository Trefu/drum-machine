
export const DrumPad = ({ sound, colors }) => {
    console.log(sound)
    return <button id={sound.key} className={`drum-pad bg-${colors.yellow}`}> {sound.key}</button>

}