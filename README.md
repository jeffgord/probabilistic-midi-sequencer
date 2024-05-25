This project is live <a href="https://github.com/jeffgord/probabilistic-midi-sequencer/tree/master">here</a>.


Todo:
- change page icon + title
- add small copyright + title somewhere
- change tooltip font
- send note off on pause
- make more legit readme


Usage:

*** Note that the probabilistic-midi-sequencer does not make sound on its own. It merely sends midi messaages. To hear anything, you must connect/open a synth of your choosing. As long as the device is capable of receiving midi messaages, probabilistic-midi-sequencer should detect it and be able to send midi messages to it.

Top controls are self explanatory - bpm adjuster changes speed of changing steps. Play/pause stops/starts the sequencer. The trash can clears all note energies (for every step).

To input notes, select a step and use the keyboard to add a note. You can click & drag to set the energy of the note, or double click to toggle max/min energy. Higher energy means that the note has a higher probability of being selected, and playing, when the step becomes active.
