let activeChord: string[] = [];
let prevMsg = "";
let currentNoteLength: number = 0;
let strip: neopixel.Strip = null;
let testBeatMsgs: string[] = [];
let testChordMessages: string[] = [];

input.onButtonPressed(Button.A, function() {
  processMessage("R1");
});

input.onButtonPressed(Button.B, function() {
  let testMsg = pickFromArray(testBeatMsgs);
  processMessage(testMsg);
});

input.onButtonPressed(Button.AB, function() {
  let testMsg = pickFromArray(testChordMessages);
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

function freqForNote(noteName: string): number {
  //TODO: can we do this with a simple js object with the letters as the keys?
  switch (noteName) {
    case "C":
      return 131;
    case "D":
      return 147;
    case "E":
      return 165;
    case "F":
      return 175;
    case "G":
      return 196;
    case "A":
      return 220;
    case "B":
      return 247;
    default:
      return 0;
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
// note num will be 1, 3, 5, or 7
function playNoteFromNoteNumberAndChord(noteNum: number, chordNotes: string[]) {
  let noteName: string = chordNotes[noteNum];
  let freq: number = freqForNote(noteName);
  strip.showColor(neopixel.colors(NeoPixelColors.Red));
  music.playTone(freq, currentNoteLength);
  strip.showColor(neopixel.colors(NeoPixelColors.Black));
}

function neoPixelsShowColour(index: number) {
  strip.showColor(neopixel.colors(myColours[index]));
}

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

const myColours: number[] = [
  neopixel.colors(NeoPixelColors.Red),
  neopixel.colors(NeoPixelColors.Green),
  neopixel.rgb(155, 155, 255),
  neopixel.colors(NeoPixelColors.Yellow),
  neopixel.colors(NeoPixelColors.Purple)
];
const noteLengths: number[] = [100, 200, 300, 400];
currentNoteLength = noteLengths[0];

testChordMessages = ["HC", "HG", "HF"];
testBeatMsgs = ["R1", "R2", "R3", "R4"];
strip = neopixel.create(DigitalPin.P1, 5, NeoPixelMode.RGB);
strip.setBrightness(255);
strip.showColor(neopixel.colors(NeoPixelColors.Red));

const CMaj: string[] = ["C", "E", "G"];
const FMaj: string[] = ["F", "A", "C"];
const G7Maj: string[] = ["G", "B", "D", "F"];

activeChord = CMaj;

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
  playNoteFromNoteNumberAndChord(0, activeChord);
  music.rest(currentNoteLength);
}
