export const Display = ({ colors, actualSound = 'nothing' }) => {
    return (
        <div id='display' className={`bg-${colors.yellowStrong}`}>
            {actualSound}
        </div>
    )
}