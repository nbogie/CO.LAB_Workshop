let activeChord: number[] = [];
let prevMsg = "";
let currentNoteLength: number = 0;
let strip: neopixel.Strip = null;
let testBeatMsgs: string[] = [];
let testMessages: string[] = [];

input.onButtonPressed(Button.A, function() {
  processMessage("R1");
});

input.onButtonPressed(Button.B, function() {
  let testMsg = pickFromArray(testBeatMsgs);
  processMessage(testMsg);
});

input.onButtonPressed(Button.AB, function() {
  let testMsg = pickFromArray(testMessages);
  processMessage(testMsg);
});

function pickFromArray<T>(arr: T[]): T {
  return arr[Math.randomRange(0, arr.length - 1)];
}

radio.onReceivedString(function(receivedString) {
  //indicate we got a message
  led.toggle(0, 0);
  processMessage(receivedString);
});

// Processes the Message and Plays a note
function processMessage(msg: string) {
  if (msg.charAt(0) == "H") {
    updateChord(msg);
  } else {
    if (prevMsg !== msg) {
      if (msg == "R.") {
        music.ringTone(0);
        neopixel.colors(NeoPixelColors.Black);
      } else if (msg.charAt(0) == "R") {
        if (msg.charAt(1) == "P") {
          //no pro-mode designed for rhythm receiver
        } else {
          currentNoteLength = noteLengths[parseInt(msg.charAt(1)) - 1];
        }
      }
    }
    prevMsg = msg;
  }
}

// updates current chord based on what chord has just
// been sent by the Harmony Glove
function updateChord(msg: string) {
  if (msg.length < 2) {
    return;
  }
  let chordChar = msg.charAt(1);
  basic.clearScreen();
  switch (chordChar) {
    case "C":
      activeChord = CMaj;
      led.plot(4, 0);
      break;
    case "G":
      activeChord = G7Maj;
      led.plot(4, 1);
      break;
    case "F":
      activeChord = FMaj;
      led.plot(4, 2);
      break;
    default:
      //do nothing - unrecognised chord char
      break;
  }
}

// Playing note from Message sent and chord set
function playNoteFromNoteNumberAndChord(noteNum: number, chordIxs: number[]) {
  let freqIx = chordIxs[noteNum];
  let freq = noteFreqs[freqIx];
  strip.showColor(neopixel.colors(NeoPixelColors.Red));
  serial.writeLine(`playing: freqIx: ${freqIx}: freq: ${freq}`);
  music.playTone(freq, currentNoteLength);
  strip.showColor(neopixel.colors(NeoPixelColors.Black));
}

function neoPixelsShowColour(index: number) {
  strip.showColor(neopixel.colors(myColours[index]));
}

const myColours: number[] = [
  neopixel.colors(NeoPixelColors.Red),
  neopixel.colors(NeoPixelColors.Green),
  neopixel.rgb(155, 155, 255),
  neopixel.colors(NeoPixelColors.Yellow),
  neopixel.colors(NeoPixelColors.Purple)
];
// Frequency and Test array setups
const noteFreqs: number[] = [220, 247, 131, 147, 165, 175, 196];
const noteLengths: number[] = [100, 200, 300, 400];
currentNoteLength = noteLengths[0];

testMessages = ["HC", "HG", "HF"];
testBeatMsgs = ["R1", "R2", "R3", "R4"];
strip = neopixel.create(DigitalPin.P1, 5, NeoPixelMode.RGB);
strip.setBrightness(255);
strip.showColor(neopixel.colors(NeoPixelColors.Red));

// setting up chord arrays
const CMaj: number[] = [2, 4, 6];
const FMaj: number[] = [5, 7, 2];
const G7Maj: number[] = [6, 1, 3, 5];

activeChord = CMaj;

function setUpRadioGroup() {
  // Radio Setup
  if (input.buttonIsPressed(Button.A)) {
    radio.setGroup(42);
    basic.showNumber(42);
  } else if (input.buttonIsPressed(Button.B)) {
    radio.setGroup(43);
    basic.showNumber(43);
  } else {
    radio.setGroup(41);
    basic.showNumber(41);
  }
}

// Show there is power
basic.showLeds(`
    # # . . .
    # . . . .
    # . # # .
    . . # . .
    . . # . .
    `);

// We avoid using forever as it has a 20ms pause built-in
// which messes with our real note durations.
// We must be careful to include a pause within our work
// to let other tasks get processor time.
while (true) {
  playNoteFromNoteNumberAndChord(2, activeChord);
  music.rest(currentNoteLength);
}
