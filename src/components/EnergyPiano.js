// modified from: https://github.com/lillydinhle/react-piano-component/blob/master/src/demo/components/InteractivePiano.js
import React, { useEffect } from 'react';
import Piano from 'react-piano-component';
import './EnergyPiano.css';
import { useState } from 'react';
import CustomTip from './CustomTip';

function PianoContainer({ children }) {
    return (
        <div
            className={'interactive-piano__piano-container'}
            onMouseDown={event => event.preventDefault()}
        >
            {children}
        </div>
    );
}

function AccidentalKey({ onMouseDown, onDoubleClick, noteEnergy }) {
    let normal = {
        r: 52,
        g: 52,
        b: 52
    }

    let full = {
        r: 160,
        g: 18,
        b: 18
    }

    let r = normal.r - (normal.r - full.r) * noteEnergy / 100;
    let g = normal.g - (normal.g - full.g) * noteEnergy / 100;
    let b = normal.b - (normal.b - full.b) * noteEnergy / 100;

    let backgroundColor = `rgb(${r}, ${g}, ${b})`;

    return (
        <div className={'interactive-piano__accidental-key__wrapper'}>
            <button className='interactive-piano__accidental-key' onMouseDown={onMouseDown} onDoubleClick={onDoubleClick} style={{ backgroundColor: backgroundColor }}>
            </button>
        </div>
    );
}

function NaturalKey({ noteEnergy, onMouseDown, onDoubleClick }) {
    let normal = {
        r: 255,
        g: 255,
        b: 255
    }

    let full = {
        r: 160,
        g: 18,
        b: 18
    }

    let r = normal.r - (normal.r - full.r) * noteEnergy / 100;
    let g = normal.g - (normal.g - full.g) * noteEnergy / 100;
    let b = normal.b - (normal.b - full.b) * noteEnergy / 100;

    let backgroundColor = `rgb(${r}, ${g}, ${b})`;

    return (
        <button className='interactive-piano__natural-key' onMouseDown={onMouseDown} onDoubleClick={onDoubleClick} style={{ backgroundColor: backgroundColor }}>
        </button >
    );
}


function PianoKey({ note, isNoteAccidental, getNoteEnergy, updateNoteEnergy }) {
    const [isDragging, setIsDragging] = useState(false);
    const [lastDragY, setLastDragY] = useState(0);

    const handleMouseDown = (event) => {
        setIsDragging(true);
        setLastDragY(event.clientY);
    }

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (!isDragging) return;

            const dragAmount = Math.round((lastDragY - event.clientY));
            const newEnergy = Math.max(Math.min(getNoteEnergy(note) + dragAmount, 100), 0)
            updateNoteEnergy(note, newEnergy);
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

    }, [isDragging, lastDragY, note, getNoteEnergy, updateNoteEnergy]);

    const handleDoubleClick = (event) => {
        if (getNoteEnergy(note) > 0) updateNoteEnergy(note, 0);
        else updateNoteEnergy(note, 100);
    }

    const KeyComponent = isNoteAccidental ? AccidentalKey : NaturalKey;

    return (<KeyComponent
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick} n
        noteEnergy={getNoteEnergy(note)}
    />);
}

export default function EnergyPiano({ selectedStepEnergies, setSelectedStepEnergies }) {
    function updateNoteEnergy(note, energy) {
        let nextSelectedStepEnergies = new Map(selectedStepEnergies);
        nextSelectedStepEnergies.set(note, energy);
        setSelectedStepEnergies(nextSelectedStepEnergies);
    }

    function getNoteEnergy(note) {
        return selectedStepEnergies.get(note) || 0;
    }

    const tip = (
        <div>
            Drag on a note to adjust energy. Double click to toggle max/min energy. Notes with high energy have a greater probability of being played on the selected step.
        </div>
    );

    return (
        <>
            <div
                className='d-flex justify-content-center align-items-center p-3'
                data-tooltip-id='energy-piano'
                data-tooltip-delay-show={1000} >
                <PianoContainer>
                    <Piano startNote={'C4'} endNote={'B5'} renderPianoKey={(props) => (
                        <PianoKey
                            {...props}
                            getNoteEnergy={getNoteEnergy}
                            updateNoteEnergy={updateNoteEnergy}
                        />
                    )} />
                </PianoContainer>
            </div>
            <CustomTip id='energy-piano' children={tip} />
        </>
    );
}
