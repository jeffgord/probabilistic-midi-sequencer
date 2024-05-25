import { useEffect } from "react";
import { WebMidi } from 'webmidi';

export default function MidiHandler({ isPlaying, bpm, activeStep, setActiveStep, energies }) {
    useEffect(() => {
        (new Promise(resolve => {
            alert("Note that the Probabilistic MIDI Sequencer does not make sound on its own. Please connect/open a MIDI enabled device to hear sound.\n\nAlso, the browser may prompt you to allow MIDI control. Please allow MIDI control if you wish to use the sequencer.");
            resolve();
        })).then(() => {
            WebMidi
                .enable()
                .then(() => console.log("WebMidi enabled!"))
                .catch(() => alert("Error enabling WebMidi! Please confirm that you are using one of the following supported browsers and try again: \n\n- Edge\n- Chrome\n- Opera\n- Firefox"));
        });

        return () => WebMidi.disable();
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
            sendAllNotesOff();
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
            try {
                WebMidi.outputs.forEach(output => {
                    output.sendAllNotesOff();
                });
            } catch { console.error("SendAllNotesOff error"); }
        }

        return () => clearInterval(intervalId);
    }, [isPlaying, bpm, activeStep, setActiveStep, energies]);
}