import './App.css';
import { useState, useEffect } from 'react'
import InteractivePiano from './components/InteractivePiano';
import { WebMidi } from 'webmidi';

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

  return <button onMouseDown={handleMouseDown} onDoubleClick={handleDoubleClick}>{bpm} BPM</button>
}

function SettingsBar({ isPlaying, setIsPlaying, bpm, setBpm }) {
  let playStopClass = isPlaying ? 'bi bi-stop' : 'bi bi-play';
  const handlePlayStop = () => { setIsPlaying(!isPlaying) };

  return (
    <div className='col settings-bar'>
      <div className='row'>
        <div className='col d-flex justify-content-center align-items-center'>
          <BpmAdjuster bpm={bpm} setBpm={setBpm} />
        </div>
        <div className='col d-flex justify-content-center align-items-center'>
          <i className={playStopClass} onClick={handlePlayStop} style={{ fontSize: '10vh' }} />
        </div>
        <div className='col d-flex justify-content-center align-items-center'>
          <i className='bi bi-arrow-clockwise' style={{ fontSize: '6vh' }} />
        </div>
      </div>
    </div>
  )
}

function SequencerStep({ value, isActive, isSelected, selectStep }) {
  let style = {
    backgroundColor: isActive ? 'blue' : 'grey',
    border: isSelected ? '5px solid red' : 'none'
  }

  return (
    <div className='col w-25 p-3 sequencer-step'>
      <button className='w-100 h-100 sequencer-step-button' style={style} onClick={() => selectStep(value)}>
        {value}
      </button>
    </div>
  );
}

function Sequencer({ isPlaying, selectedStep, selectStep, activeStep }) {
  const beats = 4;
  const stepsPerBeat = 4;

  const grid = Array.from({ length: beats }, (_, beatIndex) => {
    const beat = Array.from({ length: stepsPerBeat }, (_, stepIndex) => {
      const value = beatIndex * 4 + stepIndex;
      const isActive = isPlaying && value === activeStep;
      const isSelected = value === selectedStep;
      return <SequencerStep key={value} value={value} isActive={isActive} isSelected={isSelected} selectStep={selectStep} />;
    });

    return (
      <div key={beatIndex} className='row'>{beat}</div>
    );
  });

  return <div className='text-center'>{grid}</div>;
}

function MidiHandler({ isPlaying, bpm, activeStep, setActiveStep, energies }) {
  useEffect(() => {
    WebMidi
      .enable()
      .then(() => console.log("WebMidi enabled!"))
      .catch(err => alert(err));
  }, []);

  useEffect(() => {
    let intervalId;
    let interval = 60 * 1000 / bpm / 4;

    if (isPlaying) {
      intervalId = setInterval(() => {
        sendAllNotesOff();
        playActiveStep();
        setActiveStep(prevStep => (prevStep + 1) % 16);
      }, interval);
    } else {
      setActiveStep(0);
    }


    function playActiveStep() {
      let activeEnergies = energies[activeStep];
      if (activeEnergies.size === 0) return;

      let totalEnergy = 0
      activeEnergies.forEach((energy, _) => totalEnergy += energy);

      let randomEnergy = getRandomIntInclusive(0, totalEnergy);

      let noteToPlay;
      let energySeen = 0;

      for (let [note, energy] of activeEnergies) {
        noteToPlay = note;
        energySeen += energy;
        if (energySeen >= randomEnergy) break;
      }

      WebMidi.outputs.forEach(output => {
        output.playNote(noteToPlay);
      });
    }

    function getRandomIntInclusive(min, max) {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
    }

    function sendAllNotesOff() {
      WebMidi.outputs.forEach(output => {
        output.sendAllNotesOff();
      });
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, bpm, activeStep, setActiveStep, energies]);
}

function ProbabilisticMidiSequencer() {
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

  function selectStep(step) {
    setSelectedStep(step);
  }

  return (
    <>
      <div className='d-flex align-items-center vh-100'>
        <div className="container text-center" style={{ maxWidth: '1000px' }}>
          <div className='row'>
            <SettingsBar isPlaying={isPlaying} setIsPlaying={setIsPlaying} bpm={bpm} setBpm={setBpm} />
          </div>
          <div className='row my-3'>
            <Sequencer isPlaying={isPlaying} selectedStep={selectedStep} selectStep={selectStep} activeStep={activeStep} />
          </div>
          <div className='row'>
            <div className='d-flex justify-content-center align-items-center'>
              <InteractivePiano
                selectedStepEnergies={energies[selectedStep]}
                setSelectedStepEnergies={setSelectedStepEnergies}
              />
            </div>
          </div>
        </div>
      </div>
      <MidiHandler isPlaying={isPlaying} bpm={bpm} activeStep={activeStep} setActiveStep={setActiveStep} energies={energies} />
    </>
  );
}

export default ProbabilisticMidiSequencer;
