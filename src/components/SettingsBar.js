import { useState, useEffect } from "react";
import './SettingsBar.css'
import './global.css'
import CustomTip from "./CustomTip";

function BpmAdjuster({ bpm, setBpm }) {
    const [isDragging, setIsDragging] = useState(false);
    const [lastDragY, setLastDragY] = useState(0);

    const handleMouseDown = (event) => {
        setIsDragging(true);
        setLastDragY(event.clientY);
    }

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (!isDragging) return;

            let dragAmount = Math.round((lastDragY - event.clientY));
            let newBpm = Math.min(Math.max(bpm + dragAmount, 30), 200)
            setBpm(newBpm);
            setLastDragY(event.clientY);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

    }, [isDragging, lastDragY, bpm, setBpm]);

    const handleDoubleClick = (event) => {
        setBpm(120);
    }

    const tipContent = (
        <div>
            click & drag to adjust
            <br />
            double click to reset
        </div>
    )

    return (
        <>
            <button
                className='gold k2d-regular bpm-button'
                onMouseDown={handleMouseDown}
                onDoubleClick={handleDoubleClick}
                data-tooltip-id='bpm-tooltip'
                data-tooltip-delay-show={1000}
            >{bpm} BPM</button>
            <CustomTip id='bpm-tooltip' place='left' children={tipContent} />
        </>);
}

export default function SettingsBar({ isPlaying, togglePlay, bpm, setBpm, clearAllEnergies }) {
    const [isPlayStopHovering, setIsPlayStopHovering] = useState(false);
    const [isClearHovering, setIsClearHovering] = useState(false);

    const playStopClass = `gold bi bi-${isPlaying ? 'stop' : 'play'}${isPlayStopHovering ? '-fill' : ''} mx-4`;
    const clearClass = `gold bi bi-trash${isClearHovering ? '-fill' : ''}`;

    const handleKeyDown = (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            togglePlay();
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => { window.removeEventListener('keydown', handleKeyDown) };
    });

    const playStopTip = (
        <div>
            play/stop
            <br />
            (spacebar)
        </div>
    );

    return (
        <div className='col'>
            <div className='row'>
                <div className='col d-flex justify-content-start align-items-center mx-5'>
                    <BpmAdjuster bpm={bpm} setBpm={setBpm} />
                </div>
                <div className='col d-flex justify-content-end align-items-center mx-5'>
                    <i className={playStopClass}
                        onMouseEnter={() => setIsPlayStopHovering(true)}
                        onMouseLeave={() => setIsPlayStopHovering(false)}
                        onClick={togglePlay}
                        style={{ fontSize: '10vh' }}
                        data-tooltip-id='play-stop'
                        data-tooltip-delay-show={1000}
                    />
                    <i className={clearClass}
                        onMouseEnter={() => setIsClearHovering(true)}
                        onMouseLeave={() => setIsClearHovering(false)}
                        onClick={clearAllEnergies}
                        style={{ fontSize: '6vh' }}
                        data-tooltip-id='clear-energies'
                        data-tooltip-content='clear note energies'
                        data-tooltip-delay-show={1000}
                    />
                    <CustomTip id='play-stop' children={playStopTip} />
                    <CustomTip id='clear-energies' />
                </div>
            </div>
        </div>
    )
}