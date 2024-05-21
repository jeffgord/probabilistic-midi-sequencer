// modified from: https://github.com/lillydinhle/react-piano-component/blob/master/src/demo/components/InteractivePiano.js
import React, { useEffect } from 'react';
import Piano from 'react-piano-component';
import './InteractivePiano.css';
import { useState } from 'react';

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

function AccidentalKey({ noteProbability, onMouseDown, onDoubleClick }) {
    let grey = 68

    let r = grey + (255 - grey) * noteProbability;
    let g = grey - 68 * noteProbability;
    let b = grey - 68 * noteProbability;

    let backgroundColor = `rgb(${r}, ${g}, ${b})`;

    return (
        <div className={'interactive-piano__accidental-key__wrapper'}>
            <button className='interactive-piano__accidental-key' onMouseDown={onMouseDown} onDoubleClick={onDoubleClick} style={{ backgroundColor: backgroundColor }}>
                <div className='interactive-piano__text'>{noteProbability}</div>
            </button>
        </div>
    );
}

function NaturalKey({ noteProbability, onMouseDown, onDoubleClick }) {
    let r = 255;
    let g = Math.round(255 * (1 - noteProbability));
    let b = Math.round(255 * (1 - noteProbability));

    let backgroundColor = `rgb(${r}, ${g}, ${b})`;

    return (
        <button className='interactive-piano__natural-key' onMouseDown={onMouseDown} onDoubleClick={onDoubleClick} style={{ backgroundColor: backgroundColor }}>
            <div className={'interactive-piano__text'}>{noteProbability}</div>
        </button >
    );
}


function PianoKey({ note, isNoteAccidental, getNoteEnergy, getNoteProbability, updateNoteEnergy }) {
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
    const noteProbability = getNoteProbability(note).toFixed(2);

    return <KeyComponent onMouseDown={handleMouseDown} onDoubleClick={handleDoubleClick} noteProbability={noteProbability} />;
}

export default function InteractivePiano({ selectedStepEnergies, setSelectedStepEnergies }) {
    function updateNoteEnergy(note, energy) {
        let nextSelectedStepEnergies = new Map(selectedStepEnergies);
        nextSelectedStepEnergies.set(note, energy);
        setSelectedStepEnergies(nextSelectedStepEnergies);
    }

    function getNoteEnergy(note) {
        return selectedStepEnergies.get(note) || 0;
    }

    function getNoteProbability(note) {
        let noteEnergy = getNoteEnergy(note);

        let totalEnergy = 0;
        selectedStepEnergies.forEach((energy, _) => totalEnergy += energy);
        return totalEnergy === 0 ? 0 : noteEnergy / totalEnergy;
    }

    return (
        <PianoContainer>
            <Piano startNote={'C4'} endNote={'B5'} renderPianoKey={(props) => (
                <PianoKey
                    {...props}
                    getNoteEnergy={getNoteEnergy}
                    getNoteProbability={getNoteProbability}
                    updateNoteEnergy={updateNoteEnergy}
                />
            )} />
        </PianoContainer>
    );
}
