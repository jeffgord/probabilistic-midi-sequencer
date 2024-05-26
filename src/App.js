import './App.css';
import { useState, useRef, useEffect } from 'react'
import SettingsBar from './components/SettingsBar';
import Sequencer from './components/Sequencer';
import EnergyPiano from './components/EnergyPiano';
import MidiHandler from './components/MidiHandler';

function ConnectorArrow({ startX, startY, endX, endY, arrowDirection }) {
    const bumpX = arrowDirection === 'right' ? startX - 40 : startX + 40;
    const radius = 20;
    const cornerX = arrowDirection === 'right' ? bumpX + radius : bumpX - radius;
    const lineEndX = arrowDirection === 'right' ? endX - 20 : endX + 20;

    const pathD = `
        M${startX},${startY} 
        L${cornerX},${startY} 
        A${radius},${radius} 0 0 ${arrowDirection === 'left' ? 1 : 0} ${bumpX},${startY + radius} 
        L${bumpX},${endY - radius} 
        A${radius},${radius} 0 0 ${arrowDirection === 'left' ? 1 : 0} ${cornerX},${endY} 
        L${lineEndX},${endY}
    `;

    const arrowX = arrowDirection === 'right' ? endX - 20 : endX + 20;
    const points = `${endX},${endY} ${arrowX},${endY + 20} ${arrowX},${endY - 20}`;

    const style = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }

    return (
        <svg style={style}>
            <path d={pathD} stroke='var(--dark-grey)' strokeWidth="10" fill='none' />
            <polygon points={points} fill='var(--dark-grey)' />
        </svg>
    )
}


export default function ProbabilisticMidiSequencer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(120);
    const [energies, setEnergies] = useState(Array.from({ length: 16 }, () => (new Map())));
    const [activeStep, setActiveStep] = useState(0); // The currently "playing" step
    const [selectedStep, setSelectedStep] = useState(0); // The step for which the user is editing energies

    function setSelectedStepEnergies(selectedStepEnergies) {
        const nextEnergies = energies.slice();
        nextEnergies[selectedStep] = selectedStepEnergies;
        setEnergies(nextEnergies);
    }

    function clearAllEnergies() {
        setEnergies(Array.from({ length: 16 }, () => (new Map())));
    }

    function togglePlay() {
        setIsPlaying(prevValue => !prevValue);
    }

    const settingsBarRef = useRef(null);
    const sequencerRef = useRef(null);
    const energyPianoRef = useRef(null);

    // Hide these off canvas by default
    const [settingsSequencerConnector, setSettingsSequencerConnector] = useState({
        startX: -2000,
        startY: -2000,
        endX: -2000,
        endY: -2000,
        arrowDirection: 'right'
    });
    const [sequencerPianoConnector, setSequencerPianoConnector] = useState({
        startX: -2000,
        startY: -2000,
        endX: -2000,
        endY: -2000,
        arrowDirection: 'left'
    });

    useEffect(() => {
        const settingsBarRect = settingsBarRef.current.getBoundingClientRect();
        const sequencerRect = sequencerRef.current.getBoundingClientRect();
        const energyPianoRect = energyPianoRef.current.getBoundingClientRect();

        setSettingsSequencerConnector({
            startX: settingsBarRect.left,
            startY: settingsBarRect.top + 0.5 * settingsBarRect.height,
            endX: sequencerRect.left,
            endY: sequencerRect.top + sequencerRect.height * 0.125,
            arrowDirection: 'right'
        });

        setSequencerPianoConnector({
            startX: sequencerRect.right,
            startY: sequencerRect.bottom - 0.125 * sequencerRect.height,
            endX: energyPianoRect.right,
            endY: energyPianoRect.top + energyPianoRect.height * 0.3,
            arrowDirection: 'left'
        });
    }, []);

    return (
        <>
            <ConnectorArrow {...settingsSequencerConnector} />
            <ConnectorArrow {...sequencerPianoConnector} />
            <div className='d-flex align-items-center vh-100 background light-grey-background'>
                <div className="container text-center" style={{ maxWidth: '800px' }}>
                    <div className='row card' ref={settingsBarRef}>
                        <SettingsBar
                            isPlaying={isPlaying}
                            togglePlay={togglePlay}
                            bpm={bpm}
                            setBpm={setBpm}
                            clearAllEnergies={clearAllEnergies}
                        />
                    </div>
                    <div className='row card my-3' ref={sequencerRef}>
                        <Sequencer
                            isPlaying={isPlaying}
                            selectedStep={selectedStep}
                            setSelectedStep={setSelectedStep}
                            activeStep={activeStep}
                        />
                    </div>
                    <div className='row card' ref={energyPianoRef}>
                        <EnergyPiano
                            selectedStepEnergies={energies[selectedStep]}
                            setSelectedStepEnergies={setSelectedStepEnergies}
                        />
                    </div>
                </div>
                <div className='copyright-text'>
                    Probabilistic MIDI Sequencer
                    <br />
                    © 2024 Jeffrey Gordon
                </div>
            </div>
            <MidiHandler
                isPlaying={isPlaying}
                bpm={bpm}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                energies={energies}
            />
        </>
    );
}