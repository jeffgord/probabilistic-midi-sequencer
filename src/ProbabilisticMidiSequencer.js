import './ProbabilisticMidiSequencer.css';
import { useState } from 'react'
import { RoundSlider } from 'mz-react-round-slider'

function SettingsBar() {
  const [pointers, SetPointers] = useState({ value: 0 });

  return (
    <div className='col settings-bar'>
      <div className='row'>
        <div className='col d-flex justify-content-center align-items-center'>
          <RoundSlider pathRadius={30} onChange={SetPointers} pathStartAngle={135} pathEndAngle={45} />
        </div>
        <div className='col'>
          <i className='bi bi-play bi-lg settings-bar-icon' />
        </div>
        <div className='col'>
          <i className='bi bi-arrow-clockwise settings-bar-icon' />
        </div>
      </div>
    </div>
  )
}

function SequencerStep({ value }) {
  return (
    <div className='col w-25 p-3 sequencer-step'>
      <button className='w-100 h-100 sequencer-step-button'>{value}</button>
    </div>
  )
}

function SequencerGrid() {
  return (
    <div className='text-center'>
      <div className='row'>
        <SequencerStep value='1.1' />
        <SequencerStep value='1.2' />
        <SequencerStep value='1.3' />
        <SequencerStep value='1.4' />
      </div>
      <div className='row'>
        <SequencerStep value='2.1' />
        <SequencerStep value='2.2' />
        <SequencerStep value='2.3' />
        <SequencerStep value='2.4' />
      </div>
      <div className='row'>
        <SequencerStep value='3.1' />
        <SequencerStep value='3.2' />
        <SequencerStep value='3.3' />
        <SequencerStep value='3.4' />
      </div>
      <div className='row'>
        <SequencerStep value='4.1' />
        <SequencerStep value='4.2' />
        <SequencerStep value='4.3' />
        <SequencerStep value='4.4' />
      </div>

    </div>
  )
}

function ProbabilisticMidiSequencer() {
  const style = {
    maxWidth: '1000px'
  }

  return (
    <div className='d-flex align-items-center vh-100'>
      <div className="container text-center" style={style}>
        <div className='row'>
          <SettingsBar />
        </div>
        <div className='row'>
          <SequencerGrid />
        </div>
      </div>
    </div>
  );
}

export default ProbabilisticMidiSequencer;
