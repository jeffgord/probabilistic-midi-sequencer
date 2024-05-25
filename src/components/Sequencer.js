import './Sequencer.css';
import CustomTip from './CustomTip';

function SequencerStep({ value, isActive, isSelected, onClick }) {
    let style = {
        backgroundColor: isSelected ? 'var(--gold)' : 'var(--medium-grey)',
        border: isActive ? '2px solid var(--dark-red)' : '2px solid var(--light-grey)'
    }

    return (
        <div className='col w-25 p-3 sequencer-step'>
            <button className='w-100 h-100 sequencer-step-button' style={style} onClick={onClick}>
            </button>
        </div>
    );
}

export default function Sequencer({ isPlaying, selectedStep, setSelectedStep, activeStep }) {
    const beats = 4;
    const stepsPerBeat = 4;

    const grid = Array.from({ length: beats }, (_, beatIndex) => {
        const beat = Array.from({ length: stepsPerBeat }, (_, stepIndex) => {
            const value = beatIndex * 4 + stepIndex;
            const isActive = isPlaying && value === activeStep;
            const isSelected = value === selectedStep;
            const handleClick = () => setSelectedStep(value);

            return <SequencerStep key={value} value={value} isActive={isActive} isSelected={isSelected} onClick={handleClick} />;
        });

        return (
            <div key={beatIndex} className='row'>{beat}</div>
        );
    });

    return (<>
        <div
            className='text-center'
            data-tooltip-id='sequencer'
            data-tooltip-content='click on a step to select it'
            data-tooltip-delay-show={1000}
        >{grid}</div>
        <CustomTip id='sequencer' />
    </>);
}