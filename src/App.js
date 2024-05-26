import './App.css';
import { useState, useRef } from 'react'
import SettingsBar from './components/SettingsBar';
import Sequencer from './components/Sequencer';
import EnergyPiano from './components/EnergyPiano';
import MidiHandler from './components/MidiHandler';
import ConnectorArrow from './components/ConnectorArrow';


export default function ProbabilisticMidiSequencer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(120);
    const [energies, setEnergies] = useState(Array.from({ length: 16 }, () => (new Map())));
    const [activeStep, setActiveStep] = useState(0); // The currently "playing" step
    const [selectedStep, setSelectedStep] = useState(0); // The step for which the user is editing energies

    const settingsBarRef = useRef(null);
    const sequencerRef = useRef(null);
    const energyPianoRef = useRef(null);

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

    return (
        <>
            <ConnectorArrow
                startRef={settingsBarRef}
                endRef={sequencerRef}
                arrowDirection='right'
            />
            <ConnectorArrow
                startRef={sequencerRef}
                endRef={energyPianoRef}
                arrowDirection='left'
            />
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